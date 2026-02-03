"use client";
import { useState, useEffect } from "react";
import styles from "./OurStories.module.scss";

const members = [
  {
    name: "Agus",
    profession: "cofounder of wallapop",
    story: `Un cáncer a los 39 me enseñó algo muy sencillo: la gente a la que le importo de verdad sólo quiere verme feliz.
    No quiere que sea fuerte todo el tiempo, ni valiente, ni ejemplar. No quiere discursos, ni grandes lecciones de vida. Quiere que esté bien. Y si no lo estoy, quiere que pueda decirlo sin sentir que fallo a nadie.
    Antes de enfermar pensaba que querer a alguien era acompañarlo en los éxitos, celebrar las buenas noticias, estar presente cuando todo va hacia arriba. El cáncer me desmontó esa idea con una crudeza que aún hoy me sorprende. Querer, de verdad, era quedarse cuando ya no había nada que admirar: cuando tenía miedo, cuando estaba cansado, cuando mi cuerpo no respondía y mi cabeza se llenaba de preguntas que no tenían respuesta.
    Aprendí también a distinguir con claridad. Hubo quien se alejó sin hacer ruido, incapaz de sostener conversaciones incómodas, silencios largos o verdades que no se pueden maquillar. Y hubo quien se quedó sin saber qué decir, pero sin irse. Personas que no intentaban arreglarme, ni animarme a la fuerza, ni minimizar lo que estaba pasando. Simplemente estaban. Y eso era suficiente.
    Durante ese tiempo dejé de pedir permiso para sentir. Dejé de justificar mis límites. Entendí que descansar no es rendirse, que decir "no puedo" no es decepcionar, y que cuidarme no es egoísmo. La enfermedad me obligó a escucharme de una forma radical, sin escapatorias.
    Hoy sé que la felicidad no es una meta lejana ni un estado permanente. A veces es algo muy pequeño: una conversación honesta, una risa inesperada, un día sin dolor, una tarde tranquila sin culpa. Y la gente que me quiere de verdad celebra esas pequeñas cosas conmigo, sin exigirme nada más.
    El cáncer no me hizo mejor persona ni más sabio. Me hizo más consciente. Me enseñó que el amor auténtico no pide heroicidades. Sólo pide verdad. Y que, al final, lo único que importa es esto: que esté vivo, que esté aquí… y que, dentro de lo posible, sea feliz.`,
    image: "/members/agus.webp" 
  },
  {
    name: "Adrià",
    profession: "former lead designer at wallapop",
    story: `Acabo de ser padre y todo se siente como una nube: amor, cansancio y desconcierto mezclados. Estar tanto en casa pesa, pero me ha enseñado a frenar y estar presente.
    Los días ya no se miden igual. El tiempo se estira y se encoge a la vez: horas larguísimas que pasan volando, noches que parecen eternas y mañanas que llegan sin haber dormido del todo. El cuerpo va por inercia, pero el corazón está despierto de una forma nueva, como si hubiera aprendido otro ritmo.
    Hay momentos de felicidad pura, casi absurda. Una mano diminuta agarrando un dedo, una respiración tranquila sobre el pecho, una mirada que todavía no entiende el mundo pero ya confía. Y luego está el cansancio, profundo, acumulado, ese que no se quita durmiendo una siesta porque la cabeza sigue encendida incluso cuando el cuerpo cae.
    También está el desconcierto. La sensación de no saber muy bien qué hacer, de dudar constantemente, de preguntarse si lo estás haciendo bien mientras haces lo mejor que puedes. Nadie te prepara para ese vértigo: la responsabilidad repentina, el miedo silencioso, el amor enorme que no sabías que cabía dentro.
    Estar tanto en casa pesa porque te enfrenta a ti mismo. A tus límites, a tu impaciencia, a tus rutinas rotas. Pero también te obliga a frenar sin excusas. A mirar de verdad. A estar ahí, incluso cuando no pasa nada. Y empiezo a entender que eso es lo que quedará: la presencia, no la perfección.
    No sé todavía qué tipo de padre seré. Lo que sí sé es que estoy aprendiendo a estar. A no huir del cansancio ni del caos. A quedarme. Y en medio de esta nube espesa y confusa, empiezo a notar algo claro: aquí, ahora, aunque duela y pese, es donde tengo que estar.`,
    image: "/members/adria.webp"
  },
  {
    name: "Marta",
    profession: "former lead designer at wallapop",
    story: `Acabo de ser padre y todo se siente como una nube: amor, cansancio y desconcierto mezclados. Estar tanto en casa pesa, pero me ha enseñado a frenar y estar presente.
    Los días ya no se miden igual. El tiempo se estira y se encoge a la vez: horas larguísimas que pasan volando, noches que parecen eternas y mañanas que llegan sin haber dormido del todo. El cuerpo va por inercia, pero el corazón está despierto de una forma nueva, como si hubiera aprendido otro ritmo.
    Hay momentos de felicidad pura, casi absurda. Una mano diminuta agarrando un dedo, una respiración tranquila sobre el pecho, una mirada que todavía no entiende el mundo pero ya confía. Y luego está el cansancio, profundo, acumulado, ese que no se quita durmiendo una siesta porque la cabeza sigue encendida incluso cuando el cuerpo cae.
    También está el desconcierto. La sensación de no saber muy bien qué hacer, de dudar constantemente, de preguntarse si lo estás haciendo bien mientras haces lo mejor que puedes. Nadie te prepara para ese vértigo: la responsabilidad repentina, el miedo silencioso, el amor enorme que no sabías que cabía dentro.
    Estar tanto en casa pesa porque te enfrenta a ti mismo. A tus límites, a tu impaciencia, a tus rutinas rotas. Pero también te obliga a frenar sin excusas. A mirar de verdad. A estar ahí, incluso cuando no pasa nada. Y empiezo a entender que eso es lo que quedará: la presencia, no la perfección.
    No sé todavía qué tipo de padre seré. Lo que sí sé es que estoy aprendiendo a estar. A no huir del cansancio ni del caos. A quedarme. Y en medio de esta nube espesa y confusa, empiezo a notar algo claro: aquí, ahora, aunque duela y pese, es donde tengo que estar.`,
    image: "/members/marta.webp"
  },
  {
    name: "Miguel",
    profession: "former lead designer at wallapop",
    story: `Acabo de ser padre y todo se siente como una nube: amor, cansancio y desconcierto mezclados. Estar tanto en casa pesa, pero me ha enseñado a frenar y estar presente.
    Los días ya no se miden igual. El tiempo se estira y se encoge a la vez: horas larguísimas que pasan volando, noches que parecen eternas y mañanas que llegan sin haber dormido del todo. El cuerpo va por inercia, pero el corazón está despierto de una forma nueva, como si hubiera aprendido otro ritmo.
    Hay momentos de felicidad pura, casi absurda. Una mano diminuta agarrando un dedo, una respiración tranquila sobre el pecho, una mirada que todavía no entiende el mundo pero ya confía. Y luego está el cansancio, profundo, acumulado, ese que no se quita durmiendo una siesta porque la cabeza sigue encendida incluso cuando el cuerpo cae.
    También está el desconcierto. La sensación de no saber muy bien qué hacer, de dudar constantemente, de preguntarse si lo estás haciendo bien mientras haces lo mejor que puedes. Nadie te prepara para ese vértigo: la responsabilidad repentina, el miedo silencioso, el amor enorme que no sabías que cabía dentro.
    Estar tanto en casa pesa porque te enfrenta a ti mismo. A tus límites, a tu impaciencia, a tus rutinas rotas. Pero también te obliga a frenar sin excusas. A mirar de verdad. A estar ahí, incluso cuando no pasa nada. Y empiezo a entender que eso es lo que quedará: la presencia, no la perfección.
    No sé todavía qué tipo de padre seré. Lo que sí sé es que estoy aprendiendo a estar. A no huir del cansancio ni del caos. A quedarme. Y en medio de esta nube espesa y confusa, empiezo a notar algo claro: aquí, ahora, aunque duela y pese, es donde tengo que estar.`,
    image: "/members/miguel.jpg"
  },
  {
    name: "Jordi",
    profession: "creative developer",
    story: `Acabo de ser padre y todo se siente como una nube: amor, cansancio y desconcierto mezclados. Estar tanto en casa pesa, pero me ha enseñado a frenar y estar presente.
    Los días ya no se miden igual. El tiempo se estira y se encoge a la vez: horas larguísimas que pasan volando, noches que parecen eternas y mañanas que llegan sin haber dormido del todo. El cuerpo va por inercia, pero el corazón está despierto de una forma nueva, como si hubiera aprendido otro ritmo.
    Hay momentos de felicidad pura, casi absurda. Una mano diminuta agarrando un dedo, una respiración tranquila sobre el pecho, una mirada que todavía no entiende el mundo pero ya confía. Y luego está el cansancio, profundo, acumulado, ese que no se quita durmiendo una siesta porque la cabeza sigue encendida incluso cuando el cuerpo cae.
    También está el desconcierto. La sensación de no saber muy bien qué hacer, de dudar constantemente, de preguntarse si lo estás haciendo bien mientras haces lo mejor que puedes. Nadie te prepara para ese vértigo: la responsabilidad repentina, el miedo silencioso, el amor enorme que no sabías que cabía dentro.
    Estar tanto en casa pesa porque te enfrenta a ti mismo. A tus límites, a tu impaciencia, a tus rutinas rotas. Pero también te obliga a frenar sin excusas. A mirar de verdad. A estar ahí, incluso cuando no pasa nada. Y empiezo a entender que eso es lo que quedará: la presencia, no la perfección.
    No sé todavía qué tipo de padre seré. Lo que sí sé es que estoy aprendiendo a estar. A no huir del cansancio ni del caos. A quedarme. Y en medio de esta nube espesa y confusa, empiezo a notar algo claro: aquí, ahora, aunque duela y pese, es donde tengo que estar.`,
    image: "/members/jordi.jpg"
  },
  {
    name: "Pau",
    profession: "former lead designer at wallapop",
    story: `Acabo de ser padre y todo se siente como una nube: amor, cansancio y desconcierto mezclados. Estar tanto en casa pesa, pero me ha enseñado a frenar y estar presente.
    Los días ya no se miden igual. El tiempo se estira y se encoge a la vez: horas larguísimas que pasan volando, noches que parecen eternas y mañanas que llegan sin haber dormido del todo. El cuerpo va por inercia, pero el corazón está despierto de una forma nueva, como si hubiera aprendido otro ritmo.
    Hay momentos de felicidad pura, casi absurda. Una mano diminuta agarrando un dedo, una respiración tranquila sobre el pecho, una mirada que todavía no entiende el mundo pero ya confía. Y luego está el cansancio, profundo, acumulado, ese que no se quita durmiendo una siesta porque la cabeza sigue encendida incluso cuando el cuerpo cae.
    También está el desconcierto. La sensación de no saber muy bien qué hacer, de dudar constantemente, de preguntarse si lo estás haciendo bien mientras haces lo mejor que puedes. Nadie te prepara para ese vértigo: la responsabilidad repentina, el miedo silencioso, el amor enorme que no sabías que cabía dentro.
    Estar tanto en casa pesa porque te enfrenta a ti mismo. A tus límites, a tu impaciencia, a tus rutinas rotas. Pero también te obliga a frenar sin excusas. A mirar de verdad. A estar ahí, incluso cuando no pasa nada. Y empiezo a entender que eso es lo que quedará: la presencia, no la perfección.
    No sé todavía qué tipo de padre seré. Lo que sí sé es que estoy aprendiendo a estar. A no huir del cansancio ni del caos. A quedarme. Y en medio de esta nube espesa y confusa, empiezo a notar algo claro: aquí, ahora, aunque duela y pese, es donde tengo que estar.`,
    image: "/members/pau.jpg"
  },
  {
    name: "Rafa",
    profession: "former lead designer at wallapop",
    story: `Acabo de ser padre y todo se siente como una nube: amor, cansancio y desconcierto mezclados. Estar tanto en casa pesa, pero me ha enseñado a frenar y estar presente.
    Los días ya no se miden igual. El tiempo se estira y se encoge a la vez: horas larguísimas que pasan volando, noches que parecen eternas y mañanas que llegan sin haber dormido del todo. El cuerpo va por inercia, pero el corazón está despierto de una forma nueva, como si hubiera aprendido otro ritmo.
    Hay momentos de felicidad pura, casi absurda. Una mano diminuta agarrando un dedo, una respiración tranquila sobre el pecho, una mirada que todavía no entiende el mundo pero ya confía. Y luego está el cansancio, profundo, acumulado, ese que no se quita durmiendo una siesta porque la cabeza sigue encendida incluso cuando el cuerpo cae.
    También está el desconcierto. La sensación de no saber muy bien qué hacer, de dudar constantemente, de preguntarse si lo estás haciendo bien mientras haces lo mejor que puedes. Nadie te prepara para ese vértigo: la responsabilidad repentina, el miedo silencioso, el amor enorme que no sabías que cabía dentro.
    Estar tanto en casa pesa porque te enfrenta a ti mismo. A tus límites, a tu impaciencia, a tus rutinas rotas. Pero también te obliga a frenar sin excusas. A mirar de verdad. A estar ahí, incluso cuando no pasa nada. Y empiezo a entender que eso es lo que quedará: la presencia, no la perfección.
    No sé todavía qué tipo de padre seré. Lo que sí sé es que estoy aprendiendo a estar. A no huir del cansancio ni del caos. A quedarme. Y en medio de esta nube espesa y confusa, empiezo a notar algo claro: aquí, ahora, aunque duela y pese, es donde tengo que estar.`,
    image: "/members/miguel.jpg"
  },
  {
    name: "Sergio",
    profession: "former lead designer at wallapop",
    story: `Acabo de ser padre y todo se siente como una nube: amor, cansancio y desconcierto mezclados. Estar tanto en casa pesa, pero me ha enseñado a frenar y estar presente.
    Los días ya no se miden igual. El tiempo se estira y se encoge a la vez: horas larguísimas que pasan volando, noches que parecen eternas y mañanas que llegan sin haber dormido del todo. El cuerpo va por inercia, pero el corazón está despierto de una forma nueva, como si hubiera aprendido otro ritmo.
    Hay momentos de felicidad pura, casi absurda. Una mano diminuta agarrando un dedo, una respiración tranquila sobre el pecho, una mirada que todavía no entiende el mundo pero ya confía. Y luego está el cansancio, profundo, acumulado, ese que no se quita durmiendo una siesta porque la cabeza sigue encendida incluso cuando el cuerpo cae.
    También está el desconcierto. La sensación de no saber muy bien qué hacer, de dudar constantemente, de preguntarse si lo estás haciendo bien mientras haces lo mejor que puedes. Nadie te prepara para ese vértigo: la responsabilidad repentina, el miedo silencioso, el amor enorme que no sabías que cabía dentro.
    Estar tanto en casa pesa porque te enfrenta a ti mismo. A tus límites, a tu impaciencia, a tus rutinas rotas. Pero también te obliga a frenar sin excusas. A mirar de verdad. A estar ahí, incluso cuando no pasa nada. Y empiezo a entender que eso es lo que quedará: la presencia, no la perfección.
    No sé todavía qué tipo de padre seré. Lo que sí sé es que estoy aprendiendo a estar. A no huir del cansancio ni del caos. A quedarme. Y en medio de esta nube espesa y confusa, empiezo a notar algo claro: aquí, ahora, aunque duela y pese, es donde tengo que estar.`,
    image: "/members/pau.jpg"
  },
]

interface ModalProps {
  member: typeof members[0] | null;
  onClose: () => void;
}

const Modal = ({ member, onClose }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  // Lock body scroll when modal is open
  useEffect(() => {
    if (member) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [member]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (member) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [member, onClose]);

  const handleClose = () => {
    setIsClosing(true);

    // Wait for animation to finish
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // same duration as CSS animation
  };

  if (!member) return null;

  return (
    <div className={`${styles.modal} ${isOpen ? styles.open : ''} ${isClosing ? styles.closing : ''}`} onClick={handleClose}>
      <div className={styles.modal__overlay}></div>
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.modal__header}>
          <div className={styles.modal__header__info}>
            <h2 className={styles.modal__header__info__name}>{member.name}</h2>
            <p className={styles.modal__header__info__profession}>{member.profession}</p>
          </div>
          <button 
            className={styles.modal__header__close} 
            onClick={handleClose}
            aria-label="Close modal"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.modal__story}>
          <div 
            className={styles.modal__story__image}
            style={{ backgroundImage: `url(${member.image})` }}
          />
          <p className={styles.modal__story__text}>{member.story}</p>
        </div>
      </div>
    </div>
  );
};

const OurStories = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null);

  const openModal = (member: typeof members[0]) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  const getTruncatedText = (text: string, maxWords: number = 20) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + "...";
  };

  const getMarginTop = (index: number): string => {
    const remainder = index % 3;
    if (remainder === 0) return '100px';  // 0, 3, 6, 9...
    if (remainder === 1) return '0px';  // 1, 4, 7, 10...
    return '50px';  // 2, 5, 8, 11...
  };

  return (
    <>
      <div className={styles.our_stories}>
        <div className={styles.our_stories__header}>
          <p className={styles.our_stories__header__title}>Aquí va algunas experiencias de nuestro equipo:</p>
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.32858 11.3536C3.52384 11.5488 3.84042 11.5488 4.03568 11.3536L7.21766 8.17157C7.41292 7.97631 7.41292 7.65973 7.21766 7.46447C7.0224 7.2692 6.70582 7.2692 6.51056 7.46447L3.68213 10.2929L0.853702 7.46447C0.658439 7.2692 0.341857 7.2692 0.146595 7.46447C-0.0486675 7.65973 -0.0486675 7.97631 0.146595 8.17157L3.32858 11.3536ZM3.68213 0L3.18213 -2.18557e-08L3.18213 11L3.68213 11L4.18213 11L4.18213 2.18557e-08L3.68213 0Z" fill="var(--color-gray)"/>
          </svg>

        </div>

        <div className={styles.our_stories__items}>
          {members.map((member, index) => {
            const isExpanded = expandedIndex === index;
            
            return (
              <div
                key={member.name}
                className={styles.our_stories__items__item}
                onClick={() => openModal(member)}
                style={{ top: getMarginTop(index) }}
              >
                <div className={styles.our_stories__items__item__header}>
                  <h3 className={styles.our_stories__items__item__header__name}>{member.name}</h3>
                  <p className={styles.our_stories__items__item__header__profession}>{member.profession}</p>
                </div>

                <div 
                  className={`${styles.our_stories__items__item__image} ${isExpanded ? styles.expanded : ''}`}
                  style={{ backgroundImage: `url(${member.image})` }}
                >
                  <svg 
                    className={styles.our_stories__items__item__image__icon} 
                    width="48" 
                    height="48" 
                    viewBox="0 0 48 48" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    <circle cx="24" cy="24" r="24" fill="white"/>
                    <path d="M24 19.5V30.5" stroke="#151515"/>
                    <path d="M29.5059 24.995L18.5059 24.995" stroke="#111111"/>
                  </svg>
                </div>

                <div 
                  className={`${styles.our_stories__items__item__content} ${isExpanded ? styles.expanded : styles.collapsed}`}
                >
                  <p className={styles.our_stories__items__item__content__story}>
                    {isExpanded ? member.story : getTruncatedText(member.story)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal member={selectedMember} onClose={closeModal} />
    </>
  )
}

export default OurStories;