import styles from "./LoaderGenerate.module.scss";

interface LoaderGenerateProps {
  statusLine?: string | null;
}

const LoaderGenerate = ({ statusLine }: LoaderGenerateProps) => {
  return (
    <div className={styles.loaderGenerate}>
      <h4>{statusLine || 'Creando tu historia y una reflexión...'}</h4>
      <span className={styles.loaderGenerate__loader}></span>
    </div>
  )
}

export default LoaderGenerate;
