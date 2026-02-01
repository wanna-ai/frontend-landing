import styles from "./LoaderGenerate.module.scss";
const LoaderGenerate = () => {
  return (
    <div className={styles.loaderGenerate}>
      <h4>Generando resumen de la conversación...</h4>
      <span className={styles.loaderGenerate__loader}></span>
    </div>
  )
}

export default LoaderGenerate;