import styles from "./BirthdayPicker.module.scss";
import { useState } from "react";

const BirthdayPicker = () => {
  
  const [day, setDay] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [year, setYear] = useState<number | "">("");

  return (
    <div className={styles.birthday}>
      <div className={styles.birthday__header}>
        <p>Fecha de nacimiento</p>
      </div>
      <div className={styles.birthday__items}>
        <div className={styles.birthday__item}>
          {/* <p>Día</p> */}
          <input
            className={styles.birthday__item__input}
            type="number"
            placeholder="DD"
            value={day || ""}
            min={1}
            max={31}
            onChange={(e) =>
              setDay(e.target.value ? parseInt(e.target.value) : "")
            }
          />
        </div>
        <div className={styles.birthday__item}>
          {/* <p>Mes</p> */}
          <input
            className={styles.birthday__item__input}
            type="number"
            placeholder="MM"
            value={month}
            min={1}
            max={12}
            onChange={(e) =>
              setMonth(e.target.value ? parseInt(e.target.value) : "")
            }
          />
        </div>
        <div className={styles.birthday__item}>
          {/* <p>Año</p> */}
          <input
            className={styles.birthday__item__input}
            type="number"
            placeholder="YYYY"
            value={year}
            min={1900}
            max={new Date().getFullYear()}
            onChange={(e) =>
              setYear(e.target.value ? parseInt(e.target.value) : "")
            }
          />
        </div>
      </div>
    </div>
  )
}

export default BirthdayPicker