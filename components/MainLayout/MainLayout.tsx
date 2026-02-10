// components/MainLayout/MainLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import { AppContext } from "@/context/AppContext";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Toast from "@/components/Toast/Toast";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isResult = pathname?.includes("/result");

  const { toast, setToast, setColorInverse, colorInverse } = useContext(AppContext);

  useEffect(() => {
    if (pathname?.includes("/result")) {
      setColorInverse(true);
    } else {
      setColorInverse(false);
    }
  }, [pathname]);

  return (
    <>
      <Header />
      
      <Toast success={toast.type === "success"} visible={toast.show} onClose={() => setToast({ ...toast, show: false })}>
        <p>{toast.message}</p>
      </Toast>

      <main className={`main ${colorInverse ? " main--color-inverse" : ""}`}>
        <div className="main__content">
          {children}
        </div>
      </main>
      
      <Footer />
    </>
  );
}