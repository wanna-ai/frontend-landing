"use client";
import { useEffect, useState } from "react";
import styles from "./Toast.module.scss";
import Image from "next/image";
const Toast = ({ children, success, visible, onClose }: { children: React.ReactNode, success: boolean, visible: boolean, onClose: () => void }) => {


  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setHasBeenVisible(true);
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!hasBeenVisible) return null; // render nothing until first shown

  return (
    <div className={`${styles.toast} ${success ? styles.success : styles.error} ${visible ? styles.visible : styles.hidden}`}>
      {children}
      <button onClick={onClose}>
        <Image src="/svg/close-white.svg" alt="Close" width={12} height={12} />
      </button>
    </div>
  );
};

export default Toast;