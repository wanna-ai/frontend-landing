import { useState } from 'react'
import styles from './FAQS.module.scss'

const faqs = [
  {
    question: '¿Qué es Wanna y quién hay detrás?',
    answer: 'Wanna será un espacio para encontrarnos a través de lo que vivimos. Una plataforma para compartir nuestras experiencias más profundas, genuinas y transformadoras e iluminar el camino a otros con ellas. En Wanna nos hemos propuesto una misión épica: mostrar al mundo la gran conexión universal que nos une. Actualmente somos un pequeño equipo con sede en Barcelona: Adrià Sánchez, Agus Gómez, Jordi Garreta, Marta González, Miguel Garat y Pau Simó. Te mantendremos informado de cómo avanzamos. Próximamente tendrás noticias nuestras, vas a flipar'
  },
  {
    question: '¿Qué se supone que tengo que explicar?',
    answer: 'Buscamos historias genuinas y que te hayan pasado a ti. De temática cuotidiana, sentimental, de trabajo, identidad, salud, propósito… Puedes hablar de cualquier cosa, por pequeña que te parezca. Wanna te ayudará a ir poniendo en orden tus pensamientos, no hace falta ni que se lo expliques de forma estructurada. Siéntete libre y deja que fluya.'
  },
  {
    question: '¿Dónde va a parar mi conversación?',
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
      <h2 className={styles.faqs__title}>Preguntas frecuentes</h2>

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
              <p className={styles.faqs__items__item__answer}>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQS