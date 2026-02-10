import { useState } from 'react'
import styles from './FAQS.module.scss'

const faqs = [
  {
    question: '¿Qué es Wanna?',
    answer: 'Wanna es un espacio para encontrarnos a través de lo que vivimos. Nuestras experiencias pueden ayudar a otras personas más de lo que creemos... y a nosotros mismos.'
  },
  {
    question: '¿Qué se supone que tengo que explicar?',
    answer: 'No necesitas explicar nada especial, solo real.<br/>Puede ser algo cotidiano, sentimental, de trabajo, identidad, salud, propósito… Lo que quieras, tú decides.<br/>Detrás de cualquier vivencia, por pequeña que sea, siempre hay algo que antes no habíamos visto.'
  },
  {
    question: '¿Dónde irá a parar mi conversación?',
    answer: 'En Wanna la privacidad es nuestra prioridad. Por defecto, tu conversación no se compartirá con nadie. Cuando termines de hablar con Wanna, verás el resultado y podrás decidir qué hacer: guardártelo solo para ti o compartirlo y publicarlo para ayudar a otras personas. También recibirás un correo electrónico con el que podrás acceder a tu publicación y editarla, hacerla pública o incluso eliminarla si así lo deseas. En un futuro, Wanna podrá citar tus historias públicas, atribuyendo con total transparencia la autoría de su contenido a tu nombre de usuario.'
  }
]

const FAQS = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={styles.faqs}>
      {/* <h2 className={styles.faqs__title}>Preguntas frecuentes</h2> */}
      <div className={styles.faqs__items}>
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`${styles.faqs__items__item} ${openIndex === index ? styles.faqs__items__item__open : ''}`}
          >
            <button
              className={styles.faqs__items__item__question}
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              <span className={styles.faqs__items__item__icon}>
                {openIndex === index ? '−' : '+'}
              </span>
              {faq.question}
            </button>
            
            <div 
              className={styles.faqs__items__item__answer__wrapper}
              style={{
                maxHeight: openIndex === index ? '500px' : '0',
              }}
            >
              <p className={styles.faqs__items__item__answer} dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQS