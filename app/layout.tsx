import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";
import { Suspense } from "react";
import { AppProvider } from "@/context/AppContext";
import MainLayout from "@/components/MainLayout/MainLayout";

const diatypeSemiMonoFont = localFont({
  src: [
    { path: "./fonts/Diatype Semi-Mono/ABCDiatypeSemi-Mono-Medium.woff2" },
    { path: "./fonts/Diatype Semi-Mono/ABCDiatypeSemi-Mono-Medium.woff" },
  ],
  variable: "--font-diatype-semi-mono",
  display: "swap",
});

const diatypeExpandedFont = localFont({
  src: [
    { path: "./fonts/Diatype Expanded/ABCDiatypeExpanded-Bold.woff2" },
    { path: "./fonts/Diatype Expanded/ABCDiatypeExpanded-Bold.woff" },
  ],
  variable: "--font-diatype-expanded",
  display: "swap",
});

const diatypeTrialBoldFont = localFont({
  src: [
    { path: "./fonts/Diatype-Trial/ABCDiatype-Bold-Trial.woff" },
    { path: "./fonts/Diatype-Trial/ABCDiatype-Bold-Trial.woff2" },
  ],
  variable: "--font-diatype-trial-bold",
  display: "swap",
});

const diatypeTrialHeavyFont = localFont({
  src: [
    { path: "./fonts/Diatype-Trial/ABCDiatype-Heavy-Trial.woff" },
    { path: "./fonts/Diatype-Trial/ABCDiatype-Heavy-Trial.woff2" },
  ],
  variable: "--font-diatype-trial-heavy",
  display: "swap",
});

const openSansFont = localFont({
  src: [
    { path: "./fonts/OpenSans/OpenSans.ttf" },
  ],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wanna - prelanzamiento",
  description: "Conócete mejor con Wanna y comparte lo vivido.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon/favicon_light.png",
        href: "/favicon/favicon_light.png",
      },
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon/favicon_dark.png",
        href: "/favicon/favicon_dark.png",
      },
    ],
  },
  openGraph: {
    title: 'Wanna - Comparte experiencias auténticas',
    description: 'Una plataforma para compartir y descubrir historias reales.',
    url: 'https://wannna.ai',
    siteName: 'Wanna',
    images: [
      {
        url: 'https://wanna.app/og-image.jpg', // URL absoluta de tu imagen
        width: 1200,
        height: 630,
        alt: 'Wanna - Plataforma de experiencias auténticas',
      }
    ],
    locale: 'es_ES',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${diatypeSemiMonoFont.variable} ${diatypeExpandedFont.variable} ${diatypeTrialHeavyFont.variable} ${openSansFont.variable} ${diatypeTrialBoldFont.variable}`}>
        <AppProvider>
          <Suspense fallback={null}>
            <MainLayout>
              {children}
            </MainLayout>
          </Suspense>
        </AppProvider>
      </body>
    </html>
  );
}
