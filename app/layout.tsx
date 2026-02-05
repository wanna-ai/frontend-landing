import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Suspense } from "react";
import { AppProvider } from "@/context/AppContext";

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
  title: "Wanna",
  description: "Una plataforma para compartir y descubrir historias reales.",
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
      <body className={`${diatypeSemiMonoFont.variable} ${diatypeExpandedFont.variable} ${diatypeTrialHeavyFont.variable} ${openSansFont.variable}`}>
        <AppProvider>
          <Suspense fallback={null}>
              <Header />
              <main className="main">
                <div className="main__content">
                  {children}
                </div>
              </main>
              <Footer />
          </Suspense>
        </AppProvider>
      </body>
    </html>
  );
}
