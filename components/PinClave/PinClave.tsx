import styles from './PinClave.module.scss'

interface PinClaveProps {
  pin: string | number
}

const PinClave = ({ pin }: PinClaveProps) => {
  const digits = pin.toString().split('')
  
  return (
    <div className={styles.pinClave}>
      {digits.map((digit, index) => (
        <div key={index} className={styles.digitBox}>
          {digit}
        </div>
      ))}
    </div>
  )
}

export default PinClave