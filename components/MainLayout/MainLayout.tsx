// components/MainLayout/MainLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isResult = pathname?.includes("/result");

  return (
    <>
      <Header />
      <main className={`main${isResult ? " main--result" : ""}`}>
        <div className="main__content">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}