"use client";
import { useEffect } from "react";
import styles from "./Toast.module.scss";
import Image from "next/image";
const Toast = ({ children, success, visible, onClose }: { children: React.ReactNode, success: boolean, visible: boolean, onClose: () => void }) => {


  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  }, [ onClose, visible ]);

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