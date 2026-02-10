"use client";
import { useState, useEffect } from "react";
import styles from "./OurStories.module.scss";

const members = [
  {
    name: "Agus",
    profession: "CEO of <strong>WANNA</strong><br/>cofounder of <strong>WALLAPOP</strong>",
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
    profession: "corporate & legal manager",
    story: `Yo era de esas madres que su mejor momento era recoger a mi hija cada día en el colegio. Era mi ritual, mi conexión diaria con su mundo. Hasta que me separé. De repente pasé de vivir con ella el 100% del tiempo a tener solo la mitad. Las primeras veces que no fui a buscarla a las 16:30, me refugié en el trabajo. No quería darme cuenta de que era la hora de salida del colegio. Pero el dolor estaba ahí, esperándome. Lo que más me duele es perderme las pequeñas cosas del día a día: los líos con sus amigos, los deberes, esa nueva ilusión pasajera que tiene cada tarde. Y lo que más me parte el corazón es darme cuenta de que ella evita contarme su "otra mitad" para que no me ponga triste. Se ha vuelto más mayor, protegiéndome a mí. Las llamadas los días que no está conmigo no son fáciles. Pero he aprendido algo: cuando estamos juntas, estoy súper presente. Cero móvil, tareas resueltas, enfocada solo en ella. Porque aunque sea la mitad del tiempo, puede ser un tiempo más intenso y real.`,
    image: "/members/marta.webp"
  },
  {
    name: "Miguel",
    profession: "Emprendedor e inversor consciente",
    story: `Con 36 años, decidí lanzarme al vacío y montar mi propia empresa de muebles en Shanghái. Había convencido a una marca americana para distribuirlos en China y el plan era perfecto. Pero la euforia se convirtió en una puñalada cuando leí el contrato final: solo podía vender a empresas locales chinas. Las multinacionales, que eran mi mercado seguro, quedaban fuera
    En aquel momento eso era una locura. Las empresas chinas no valoraban la calidad, solo querían lo más barato. 
    Llegué a casa sintiéndome derrotado, y se lo conté a mi mujer. Ella, con esa calma suya que siempre me ancla, me miró y me dijo: “Tranquilo, Miguel. Ya has ganado”.  Y yo me lo creí. Con esa fe ciega y solo dos empleados, Jennifer y Kerry, arrancamos HWS.
    Los primeros cuatro meses fueron infernales. Ventas: cero. Mis ahorros se acababan. No podía dormir pensando en cómo pagar el colegio de mis hijos. Me puse a hacer networking como un loco, casi no pisaba la oficina. No quería que pensaran que su jefe era un fracasado. Pero la verdad era que nadie quería nuestros muebles.
    Un día, en un evento, escuché hablar de un megaproyecto: Alibaba, la empresa china mas exitosa del momento, iba a construir un campus gigantesco. Al principio, me reí de la idea de poder ganarlo. A ese proyecto se presentaban todas las grandes marcas. 
    Al despertar, recordé que Jack Ma (CEO y fundador de Alibaba) estaba en una asociación de empresarios conmigo. Busqué su móvil en el portal y le llamé. Una, dos, tres veces... A la semana me detuve porque aquello ya rozaba lo delictivo: Jack tenía 30 llamadas perdidas mías
    Sin nada que perder, le escribí un email: 'Jack, soy Miguel'. Le hablé de emprendedor a emprendedor, recordándole que él también empezó desde abajo. Fui sincero: confesé que no tenía ni un solo cliente. Le prometí que Alibaba sería mi prioridad absoluta. Fue mi última carta y la jugué desde el corazón.
    Días después mi teléfono empezó a sonar. Casi me da una taquicardia. Era él. Respondí: Hi Jack…pero salió una voz femenina. Soy Smile (los chinos escogen nombres en inglés muy peculiares para facilitarnos la vida). Jack sabe quién eres y quiere ayudarte, me dijo. Quiere que te reúnas con sus arquitectos y hableis del proyecto. Se lo agradecí de corazón. 
    Antes de terminar me dijo: Ah una cosa más: Jack te pide que no le llames más. Me eché a reír solo. 
    Fuimos a Hangzhou, conectamos con los arquitectos y presentamos nuestra propuesta. 
    Poco después, Smile me volvió a llamar y me lo soltó: “Vais a ganar”. Ahí sí que se me puso el corazón a mil…
    Cuando llegó el correo oficial, Kerry, Jennifer y yo casi rompemos el techo de la oficina de los saltos que dimos. Habíamos ganado un contrato para 80.000 personas y un acuerdo renovable cada tres años. No me lo podía creer. 
    Lo que parecía una condena (vender solo a empresas chinas) resultó ser una bendición: todas las empresas de tecnología chinas nos empezaron a ver como los proveedores de confianza del sector. Pronto ganamos proyectos de otros gigantes como Tencent, Baidu, Huawei o Didi.
    Esa noche, eufórico, pensé en llamar a Jack otra vez, quería darle las gracias, quería invitarle a todo... pero miré el teléfono me acordé de Smile y pensé: 'Miguel, quieto... que este tío es capaz de anular el contrato con tal de que no le suene más el móvil'.
    `,
    image: "/members/miguel.jpg"
  },
  {
    name: "Jordi",
    profession: "creative developer",
    story: `Tenía quince años cuando apareció. La psoriasis llegó sin avisar, sin explicación, y mi primera reacción fue la pregunta que tantos nos hacemos: "¿Por qué yo?". Era difícil mirarme al espejo, difícil aceptar algo que no había elegido y que no entendía. La adolescencia ya es complicada de por sí, y esto se sentía como una carga extra que no merecía.
    El tiempo pasó y, poco a poco, algo empezó a cambiar. Encontré un video en YouTube que se titulaba "CON P DE PSORIASIS", donde varias personas hablaban de su experiencia. Por primera vez me di cuenta de que no estaba solo. Había otros que habían pasado por lo mismo, que entendían esa mezcla de frustración y búsqueda de respuestas.
    Fue un proceso gradual, pero llegué a una conclusión que cambió todo: hay que quererla. Si está ahí, si forma parte de mi piel, si no me duele, ¿por qué no quererla? Empecé a verla diferente, a llamarla mis "tatuajes naturales". Porque eso es lo que son: marcas únicas, patrones que solo yo tengo, diseños que cuentan mi historia.
    Ahora entiendo algo fundamental: está para siempre, así que es mejor no darle muchas vueltas. No tiene sentido luchar contra algo que es parte de ti. La aceptación no llegó de la noche a la mañana, pero cuando llegó, trajo una paz que no sabía que necesitaba.
    `,
    image: "/members/jordi.jpg"
  },
  {
    name: "Pau",
    profession: "translator",
    story: `Estábamos recorriendo el circuito que rodea el Annapurna con tres buenos amigos. Hace ya unos cuantos años de esto. Fue una travesía dura, de menos a más. Empezamos en cotas bajas y cada día subíamos más y más, con más frío.
    Hasta que llegó la etapa épica de cruzar el Thorung La, el paso de montaña más elevado, casi a 6000 metros. Llevábamos días sin poder movernos de un refugio por mal tiempo y acumulación de nieve. Vimos peligrar la aventura por falta de días, pensando que igual no podíamos llegar a tiempo a la capital para coger el vuelo de vuelta. Hasta que el tiempo amainó y nos dispusimos a cruzar el paso. Fue un día durísimo, de los peores de mi vida: falta de aire por la altura, hundidos hasta la cintura en la nieve, los pies congelados... pero finalmente conseguimos llegar. La bajada fue también destructiva y eterna. Finalmente llegamos al pueblo sagrado de Muktinath, hechos trizas.
    Estábamos en el comedor del albergue y pedimos una cerveza. Solo una. En nuestro estado, fue suficiente para entonarnos de lo lindo. El local estaba regentado por una mujer y su sobrino que, al vernos contentillos, decidió sacar un viejo transistor. Música nepalí, completamente folklórica. Ad, que no hablaba ni una palabra de inglés, quiso comunicarse con él exclamando alegre como nunca: 'Very very musicale.' Nos empezamos a reír a carcajada limpia. En la vida me había reído tanto. Nuestro compañero alemán que llevaba días sin abrir la boca se desternilló con nosotros. Fue un momento mágico de comunión y colofón de nuestra aventura épica que siempre recordaré. La felicidad absoluta no existe si haber sufrido anteriormente. No hubiera reído así en ninguna otra circunstancia. La alegría de ese momento era exactamente proporcional a todo lo que habíamos pasado para llegar hasta allí. Y eso solo lo entiende quien lo ha vivido."
    `,
    image: "/members/pau.jpg"
  },
  /* {
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
  }, */
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
            <p className={styles.modal__header__info__profession} dangerouslySetInnerHTML={{ __html: member.profession }} />
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
          <h2 className={styles.our_stories__header__title}>Algunas <span className={styles.our_stories__header__title__span}>experiencias</span> de nuestro equipo generadas con Wanna</h2>
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
                  <p className={styles.our_stories__items__item__header__profession} dangerouslySetInnerHTML={{ __html: member.profession }} />
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