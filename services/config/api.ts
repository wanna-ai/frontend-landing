export const API_BASE_URL = (() => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  
  if (!baseUrl) {
    console.warn('NEXT_PUBLIC_API_BASE_URL no está definida, usando fallback')
    return 'https://api.playground.wannna.ai'
  }
  
  return baseUrl
})()