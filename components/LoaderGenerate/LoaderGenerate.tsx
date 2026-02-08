"use client";
import { useState, useEffect } from 'react';
import styles from "./LoaderGenerate.module.scss";

const phrases = [
  "Creando tu historia y una reflexión...",
  "Wanna está preparando tu historia...",
  "Generando una experiencia única para ti...",
  "Un momento de inspiración está por llegar...",
  "Estamos tejiendo palabras para tu reflexión..."
];

const LoaderGenerate = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000); // Change phrase every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.loaderGenerate}>
      <h4>{phrases[currentPhraseIndex]}</h4>
      <span className={styles.loaderGenerate__loader}></span>
    </div>
  )
}

export default LoaderGenerate;
