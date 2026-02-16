# Session Init Flow

## Overview

On the user's first visit, the frontend generates a `WANNA_SESSION_ID` (UUID v4), stores it in an httpOnly cookie (30 min TTL), and notifies the backend via `POST /api/v1/session/init`.

If the cookie expires, the next page load generates a new session and calls init again.

## Architecture

```
Browser (useSession hook)
  │
  │  POST /api/session/init  (with client context in body)
  ▼
Next.js API Route (app/api/session/init/route.ts)
  │
  │  1. Check cookie WANNA_SESSION_ID
  │  2. If exists → return sessionId (no backend call)
  │  3. If missing → generate UUID, call backend, set cookie
  │
  │  POST {API_BASE_URL}/api/v1/session/init
  │  Header: X-Wanna-Session-Id: <uuid>
  │  Body: { language, userAgent, screenWidth, ... }
  ▼
Backend
```

## Files

| File | Role |
|------|------|
| `app/api/session/init/route.ts` | Server-side API route. Manages cookie and calls backend |
| `app/hook/useSession.ts` | Client hook. Gathers browser context and calls API route |
| `context/AppContext.tsx` | Stores `sessionId` in React context |
| `app/page.tsx` | Calls `useSession()` on home page load |
| `__tests__/api/session-init.test.ts` | Tests de la API route |
| `__tests__/hooks/useSession.test.tsx` | Tests del hook |

## Cookie Details

- **Name**: `WANNA_SESSION_ID`
- **Max-Age**: 1800 seconds (30 minutes)
- **HttpOnly**: true
- **Secure**: true in production
- **SameSite**: lax
- **Path**: /

## Client Context Sent to Backend

```json
{
  "language": "es-ES",
  "languages": ["es-ES", "en"],
  "userAgent": "Mozilla/5.0 ...",
  "screenWidth": 1920,
  "screenHeight": 1080,
  "timezone": "Europe/Madrid",
  "connection": {
    "effectiveType": "4g",
    "downlink": 10,
    "rtt": 50
  }
}
```

The `connection` field is only present if the browser supports the Network Information API.

## Tests

Se ejecutan con `npm test` (vitest). Configuración en `vitest.config.ts` con jsdom.

### API Route — `__tests__/api/session-init.test.ts` (7 tests)

| Test | Qué verifica |
|------|-------------|
| returns existing sessionId if cookie already exists | Si la cookie `WANNA_SESSION_ID` existe, devuelve el sessionId sin llamar al backend |
| generates new sessionId when no cookie exists | Sin cookie, genera un UUID nuevo |
| calls backend with X-Wanna-Session-Id header | La llamada al backend incluye el header `X-Wanna-Session-Id` con el UUID generado |
| forwards client context in body to backend | El body del cliente (language, screenWidth, etc.) se reenvía al backend |
| sets cookie with correct options on new session | La cookie se crea con `MaxAge=1800`, `HttpOnly`, `SameSite=lax`, `Path=/` |
| handles backend failure gracefully | Si el backend falla, devuelve HTTP 500 con mensaje de error |
| handles request with no body | Funciona aunque el request no tenga body (no rompe) |

### Hook — `__tests__/hooks/useSession.test.tsx` (5 tests)

| Test | Qué verifica |
|------|-------------|
| calls /api/session/init on mount | Al montarse, hace `POST /api/session/init` con `credentials: 'include'` |
| sends client context in request body | El body incluye `language`, `userAgent`, `screenWidth`, `screenHeight`, `timezone` |
| sets sessionId in context on success | Tras respuesta exitosa, llama a `setSessionId` con el valor recibido |
| does not call setSessionId on fetch failure | Si el fetch falla (response not ok), no actualiza el contexto |
| only calls init once even on re-render | Gracias al `useRef` guard, no repite la llamada aunque el componente se re-renderice |
