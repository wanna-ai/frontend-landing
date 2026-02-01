"use client";
import styles from "./PublishAs.module.scss";
import { AppContext } from "@/context/AppContext";
import { useState } from "react";
import Image from "next/image";

const PublishAs = ({ handlePublishAs }: { handlePublishAs: (isAnonymous: boolean) => void }) => {

  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSelectPublishAs = (isAnonymous: boolean) => {
    setIsAnonymous(isAnonymous);
    handlePublishAs(isAnonymous);
  };

  return (
    <div className={styles.publishAs}>
      <div className={`${styles.publishAs__user} ${!isAnonymous ? styles.publishAs__user__active : ""}`} onClick={() => handleSelectPublishAs(false)}>
      <svg width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9193 6.41667C11.9193 8.44171 10.2776 10.0833 8.2526 10.0833C6.22756 10.0833 4.58594 8.44171 4.58594 6.41667C4.58594 4.39162 6.22756 2.75 8.2526 2.75C10.2776 2.75 11.9193 4.39162 11.9193 6.41667Z" stroke="#141B34" stroke-width="1.5"/>
        <path d="M13.75 10.0833C15.775 10.0833 17.4167 8.44171 17.4167 6.41667C17.4167 4.39162 15.775 2.75 13.75 2.75" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.0859 12.8333H6.41927C3.88797 12.8333 1.83594 14.8853 1.83594 17.4166C1.83594 18.4292 2.65675 19.25 3.66927 19.25H12.8359C13.8485 19.25 14.6693 18.4292 14.6693 17.4166C14.6693 14.8853 12.6172 12.8333 10.0859 12.8333Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M15.5859 12.8333C18.1172 12.8333 20.1693 14.8853 20.1693 17.4166C20.1693 18.4292 19.3485 19.25 18.3359 19.25H16.9609" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
        <p>Público</p>
      </div>
      <div className={styles.publishAs__separator} />
      <div className={`${styles.publishAs__anonymous} ${isAnonymous ? styles.publishAs__anonymous__active : ""}`} onClick={() => handleSelectPublishAs(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 14.9999C5.34315 14.9999 4 16.343 4 17.9999C4 19.6567 5.34315 20.9999 7 20.9999C8.65685 20.9999 10 19.6567 10 17.9999C10 16.343 8.65685 14.9999 7 14.9999Z" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 14.9999C15.3431 14.9999 14 16.343 14 17.9999C14 19.6567 15.3431 20.9999 17 20.9999C18.6569 20.9999 20 19.6567 20 17.9999C20 16.343 18.6569 14.9999 17 14.9999Z" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 17H10" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22 12.9999C19.5434 11.7724 15.9734 10.9999 12 10.9999C8.02658 10.9999 4.45659 11.7724 2 12.9999" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 11.4999L17.9425 4.71233C17.7268 3.32807 16.2232 2.578 15.0093 3.24907L14.3943 3.58903C12.9019 4.414 11.0981 4.414 9.60574 3.58903L8.99074 3.24907C7.77676 2.578 6.27318 3.32808 6.05751 4.71233L5 11.4999" stroke="#141B34" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <p>Anónimo</p>
      </div>
    </div>
  )
}

export default PublishAs