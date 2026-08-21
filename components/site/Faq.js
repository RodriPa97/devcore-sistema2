const questions = [
  {
    question: "¿DevCore hace sistemas desde cero?",
    answer:
      "Sí. Podemos desarrollar una solución nueva a partir de los procesos y necesidades de tu negocio, y también mejorar proyectos existentes cuando el alcance lo permite.",
  },
  {
    question: "¿Cómo se define el precio?",
    answer:
      "Primero relevamos lo que necesitás. Después armamos una propuesta según funcionalidades, complejidad, tiempos e integraciones. Preferimos cotizar cada proyecto de forma realista en lugar de publicar precios que después no coinciden con el trabajo.",
  },
  {
    question: "¿Trabajan solo en Formosa?",
    answer: "No. Trabajamos de forma remota y actualmente tenemos alcance en Argentina y Paraguay.",
  },
  {
    question: "¿Pueden integrar pagos o servicios externos?",
    answer:
      "Sí, cuando el proyecto lo requiere podemos integrar pasarelas de pago, APIs y otros servicios compatibles con la solución.",
  },
  {
    question: "¿Qué pasa después de la entrega?",
    answer:
      "Podemos continuar con soporte, mantenimiento, correcciones y nuevas funcionalidades según lo que el negocio vaya necesitando.",
  },
  {
    question: "¿Qué tecnologías utilizan?",
    answer:
      "Trabajamos con React, Next.js y Nest.js en el frontend y backend, bases de datos como PostgreSQL y MySQL/MariaDB, Prisma como ORM, autenticación con NextAuth, Git y GitHub para el control de versiones, y publicamos los proyectos en Vercel, además de integraciones y servicios externos según cada proyecto.",
  },
];

export default function Faq() {
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Preguntas frecuentes</span>
          <h2>FAQ</h2>
        </div>
        <div className="faq-list reveal">
          {questions.map(({ question, answer }, index) => (
            <details className="faq-item" open={index === 0} key={question}>
              <summary className="faq-q">
                <span>{question}</span>
                <span className="plus" aria-hidden="true">+</span>
              </summary>
              <div className="faq-a">
                <p>{answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
