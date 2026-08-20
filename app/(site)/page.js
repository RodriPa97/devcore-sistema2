import Link from "next/link";
import Script from "next/script";

// Esta es la landing de DevCore (la página institucional de la empresa),
// convertida del index.html original a JSX. Vive en el grupo de rutas
// "(site)" con su propio layout y su propio CSS (public/landing.css) —
// totalmente separada del sistema de gestión (login, panel, admin), que
// vive en el grupo "(app)" con Tailwind. Así ninguno de los dos estilos
// choca con el otro.
export default function LandingPage() {
  return (
    <>
      <header className="site">
        <a href="#seguimiento" className="nav-banner">
          Ahora podés seguir el progreso de tu proyecto en tiempo real desde
          tu panel de cliente <span className="chev">›</span>
        </a>
        <nav className="nav">
          <a href="#" className="nav-logo">
            <img src="/logo-horizontal.webp" alt="DevCore" />
          </a>
          <div className="nav-links">
            <div className="nav-item">
              <a href="#servicios" className="nav-link">
                Servicios <span className="nav-caret">▾</span>
              </a>
              <div className="nav-dropdown">
                <div className="nav-dd-col">
                  <span className="nav-dd-heading">Qué hacemos</span>
                  <a href="#servicios" className="nav-dd-item">
                    <span className="nav-dd-title">Analizar</span>
                    <span className="nav-dd-desc">
                      Relevamos procesos y necesidades
                    </span>
                  </a>
                  <a href="#servicios" className="nav-dd-item">
                    <span className="nav-dd-title">Diseñar</span>
                    <span className="nav-dd-desc">
                      Pantallas y flujo de trabajo
                    </span>
                  </a>
                  <a href="#servicios" className="nav-dd-item">
                    <span className="nav-dd-title">Desarrollar</span>
                    <span className="nav-dd-desc">
                      Sistemas y paneles a medida
                    </span>
                  </a>
                </div>
                <div className="nav-dd-col">
                  <span className="nav-dd-heading">Cómo lo hacemos</span>
                  <a href="#servicios" className="nav-dd-item">
                    <span className="nav-dd-title">Integrar</span>
                    <span className="nav-dd-desc">
                      Pagos, APIs y servicios externos
                    </span>
                  </a>
                  <a href="#servicios" className="nav-dd-item">
                    <span className="nav-dd-title">Publicar</span>
                    <span className="nav-dd-desc">
                      Puesta en marcha en internet
                    </span>
                  </a>
                  <a href="#servicios" className="nav-dd-item">
                    <span className="nav-dd-title">Mantener</span>
                    <span className="nav-dd-desc">
                      Mejoras y soporte continuo
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="nav-item">
              <a href="#industrias" className="nav-link">
                Soluciones <span className="nav-caret">▾</span>
              </a>
              <div className="nav-dropdown">
                <div className="nav-dd-col">
                  <span className="nav-dd-heading">Para tu negocio</span>
                  <a href="#industrias" className="nav-dd-item">
                    <span className="nav-dd-title">Sistemas de gestión</span>
                    <span className="nav-dd-desc">
                      Panel, usuarios y reportes
                    </span>
                  </a>
                  <a href="#industrias" className="nav-dd-item">
                    <span className="nav-dd-title">Stock y ventas</span>
                    <span className="nav-dd-desc">
                      Productos, movimientos y ventas
                    </span>
                  </a>
                  <a href="#industrias" className="nav-dd-item">
                    <span className="nav-dd-title">Farmacias</span>
                    <span className="nav-dd-desc">Gestión y administración</span>
                  </a>
                </div>
                <div className="nav-dd-col">
                  <span className="nav-dd-heading">Más soluciones</span>
                  <a href="#industrias" className="nav-dd-item">
                    <span className="nav-dd-title">Comercios y gastronomía</span>
                    <span className="nav-dd-desc">
                      Pedidos, ventas y paneles
                    </span>
                  </a>
                  <a href="#industrias" className="nav-dd-item">
                    <span className="nav-dd-title">Sitios web</span>
                    <span className="nav-dd-desc">
                      Landing pages institucionales
                    </span>
                  </a>
                  <a href="#industrias" className="nav-dd-item">
                    <span className="nav-dd-title">Integraciones</span>
                    <span className="nav-dd-desc">
                      Pagos, APIs y automatización
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="nav-item">
              <a href="#planes" className="nav-link">
                Recursos <span className="nav-caret">▾</span>
              </a>
              <div className="nav-dropdown">
                <div className="nav-dd-col">
                  <span className="nav-dd-heading">Empresa</span>
                  <a href="#planes" className="nav-dd-item">
                    <span className="nav-dd-title">Cómo trabajamos</span>
                    <span className="nav-dd-desc">
                      Nuestro proceso paso a paso
                    </span>
                  </a>
                  <a href="#seguimiento" className="nav-dd-item">
                    <span className="nav-dd-title">Seguimiento de proyectos</span>
                    <span className="nav-dd-desc">
                      Transparencia en cada etapa
                    </span>
                  </a>
                </div>
                <div className="nav-dd-col">
                  <span className="nav-dd-heading">Ayuda</span>
                  <a href="#faq" className="nav-dd-item">
                    <span className="nav-dd-title">Preguntas frecuentes</span>
                    <span className="nav-dd-desc">Resolvemos tus dudas</span>
                  </a>
                  <a
                    href="mailto:devcore97@gmail.com"
                    className="nav-dd-item"
                  >
                    <span className="nav-dd-title">Contacto</span>
                    <span className="nav-dd-desc">Escribinos directamente</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="nav-cta">
            <Link href="/login" className="btn btn-primary">
              Iniciar sesión
            </Link>
            <Link href="/registro" className="btn btn-ghost">
              Registrarse
            </Link>
          </div>
          <button className="nav-toggle" aria-label="Menú">
            ☰
          </button>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">Desarrollo de software a medida</span>
              <h1>
                Construimos el <span className="accent">software</span> que
                tu negocio realmente necesita
              </h1>
              <p className="sub">
                En DevCore desarrollamos soluciones digitales para comercios
                y empresas: sistemas de gestión, stock, ventas,
                administración, sitios web, integraciones y automatizaciones.
              </p>
              <div className="hero-cta">
                <a
                  href="mailto:devcore97@gmail.com"
                  className="btn btn-primary"
                >
                  Solicitar una propuesta
                </a>
                <a href="#servicios" className="btn btn-ghost">
                  Ver qué hacemos
                </a>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <b>AR + PY</b>
                  <span>Proyectos y clientes</span>
                </div>
                <div className="hero-stat">
                  <b>A medida</b>
                  <span>Soluciones según cada negocio</span>
                </div>
                <div className="hero-stat">
                  <b>Directo</b>
                  <span>Contacto con el equipo</span>
                </div>
              </div>
            </div>
            <div className="hero-visual reveal">
              <svg
                className="cube-float"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="cubeGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8FE23A" />
                    <stop offset="100%" stopColor="#17B8A6" />
                  </linearGradient>
                </defs>
                <polygon
                  points="50,8 88,28 50,48 12,28"
                  fill="url(#cubeGrad)"
                  opacity="0.95"
                />
                <polygon
                  points="12,28 50,48 50,92 12,72"
                  fill="url(#cubeGrad)"
                  opacity="0.65"
                />
                <polygon
                  points="88,28 50,48 50,92 88,72"
                  fill="url(#cubeGrad)"
                  opacity="0.8"
                />
              </svg>
              <div className="term">
                <div className="term-bar">
                  <div className="term-dot"></div>
                  <div className="term-dot"></div>
                  <div className="term-dot"></div>
                  <span className="label">devcore — build.sh</span>
                </div>
                <div className="term-body" id="termBody"></div>
              </div>
            </div>
          </div>
        </section>

        {/* STACK BELT */}
        <div className="stack-belt">
          <div className="wrap">
            <span className="stack-label">Tecnologías y herramientas</span>
            <div className="stack-items">
              <span>React · Next.js · Nest.js</span>
              <span>TypeScript · JavaScript · Node.js</span>
              <span>Prisma · PostgreSQL</span>
              <span>MySQL · MariaDB</span>
              <span>Tailwind CSS</span>
              <span>NextAuth</span>
              <span>Vercel</span>
              <span>Docker</span>
              <span>Git · GitHub</span>
              <span>APIs</span>
              <span>Mercado Pago</span>
              <span>Automatizaciones</span>
            </div>
          </div>
        </div>

        {/* SERVICIOS */}
        <section className="section" id="servicios">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Servicios</span>
              <h2>Software pensado para resolver problemas reales</h2>
              <p className="lead">
                Primero entendemos cómo trabaja tu negocio y después
                desarrollamos una solución acorde a lo que necesitás.
              </p>
            </div>
            <div className="pillars reveal">
              <div className="pillar">
                <span className="pillar-num">01</span>
                <h3>Analizar</h3>
                <p>
                  Relevamos procesos, necesidades y tareas repetitivas para
                  detectar dónde el software puede aportar valor.
                </p>
              </div>
              <div className="pillar">
                <span className="pillar-num">02</span>
                <h3>Diseñar</h3>
                <p>
                  Definimos pantallas, módulos y flujo de trabajo antes de
                  avanzar con el desarrollo.
                </p>
              </div>
              <div className="pillar">
                <span className="pillar-num">03</span>
                <h3>Desarrollar</h3>
                <p>
                  Construimos sistemas web, paneles administrativos y
                  herramientas de gestión adaptadas a cada negocio.
                </p>
              </div>
              <div className="pillar">
                <span className="pillar-num">04</span>
                <h3>Integrar</h3>
                <p>
                  Conectamos pagos, formularios, bases de datos y servicios
                  externos cuando el proyecto lo requiere.
                </p>
              </div>
              <div className="pillar">
                <span className="pillar-num">05</span>
                <h3>Publicar</h3>
                <p>
                  Configuramos el proyecto para que pueda utilizarse desde
                  internet y acompañamos la puesta en marcha.
                </p>
              </div>
              <div className="pillar">
                <span className="pillar-num">06</span>
                <h3>Mantener</h3>
                <p>
                  Realizamos mejoras, correcciones y nuevas funciones según
                  la evolución del sistema y del negocio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUCIONES */}
        <section className="section" id="industrias">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Soluciones</span>
              <h2>Qué podemos desarrollar para tu negocio</h2>
              <p className="lead">
                No vendemos un sistema genérico: definimos el alcance según
                tu operación, tus tiempos y tus prioridades.
              </p>
            </div>
            <div className="chips reveal">
              <span className="chip active">Sistemas de gestión</span>
              <span className="chip">Stock y ventas</span>
              <span className="chip">Farmacias</span>
              <span className="chip">Comercios</span>
              <span className="chip">Sitios web</span>
              <span className="chip">Pagos e integraciones</span>
              <span className="chip">Automatizaciones</span>
            </div>

            <div className="industry-grid reveal">
              <div className="industry-card">
                <h3>Sistemas de gestión</h3>
                <p className="desc">
                  Herramientas para ordenar la operación diaria y
                  centralizar información en un solo lugar.
                </p>
                <ul>
                  <li>Panel de administración</li>
                  <li>Usuarios y permisos</li>
                  <li>Reportes y consultas</li>
                </ul>
              </div>
              <div className="industry-card">
                <h3>Stock y ventas</h3>
                <p className="desc">
                  Sistemas para registrar productos, controlar movimientos y
                  tener mayor visibilidad del negocio.
                </p>
                <ul>
                  <li>Productos y categorías</li>
                  <li>Control de stock</li>
                  <li>Registro de ventas</li>
                </ul>
              </div>
              <div className="industry-card">
                <h3>Soluciones para farmacias</h3>
                <p className="desc">
                  Desarrollo de herramientas de gestión orientadas a la
                  operatoria de farmacias y comercios del rubro.
                </p>
                <ul>
                  <li>Gestión de productos</li>
                  <li>Stock y ventas</li>
                  <li>Administración y reportes</li>
                </ul>
              </div>
              <div className="industry-card">
                <h3>Comercios y gastronomía</h3>
                <p className="desc">
                  Soluciones para negocios que necesitan digitalizar ventas,
                  pedidos, administración o atención.
                </p>
                <ul>
                  <li>Gestión interna</li>
                  <li>Pedidos y ventas</li>
                  <li>Paneles personalizados</li>
                </ul>
              </div>
              <div className="industry-card">
                <h3>Sitios web</h3>
                <p className="desc">
                  Páginas institucionales y landing pages para presentar
                  servicios, productos y canales de contacto.
                </p>
                <ul>
                  <li>Diseño responsive</li>
                  <li>Formulario de contacto</li>
                  <li>Publicación y dominio</li>
                </ul>
              </div>
              <div className="industry-card">
                <h3>Integraciones y automatización</h3>
                <p className="desc">
                  Conectamos herramientas y reducimos tareas manuales cuando
                  existe una oportunidad clara de automatizar.
                </p>
                <ul>
                  <li>Pasarelas de pago</li>
                  <li>APIs y servicios externos</li>
                  <li>Automatización de procesos</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCIA ACTUAL */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Nuestra etapa actual</span>
              <h2>Resultados reales, sin inflar números</h2>
              <p className="lead">
                DevCore está creciendo con proyectos concretos y una
                propuesta simple: trabajar cerca del cliente y construir
                herramientas que le sirvan de verdad.
              </p>
            </div>
            <div className="steps reveal">
              <div className="step">
                <div className="step-num">AR</div>
                <h4>Formosa, Argentina</h4>
                <p>
                  Desarrollamos soluciones para comercios y proyectos de
                  sistemas de gestión, incluyendo el rubro farmacia.
                </p>
              </div>
              <div className="step">
                <div className="step-num">PY</div>
                <h4>Paraguay</h4>
                <p>
                  También trabajamos con clientes y proyectos fuera de
                  Argentina, ampliando nuestro alcance regional.
                </p>
              </div>
              <div className="step">
                <div className="step-num">01</div>
                <h4>Desarrollo personalizado</h4>
                <p>
                  Cada propuesta se arma a partir de la necesidad del
                  negocio, sin vender funcionalidades innecesarias.
                </p>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <h4>Acompañamiento directo</h4>
                <p>
                  El cliente habla directamente con el equipo que analiza,
                  desarrolla y mantiene su solución.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PANEL DE SEGUIMIENTO */}
        <section className="section" id="seguimiento">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Transparencia</span>
              <h2>Así seguís tu proyecto</h2>
              <p className="lead">
                Acceso directo al tablero de trabajo: qué se está
                construyendo, qué está en revisión y qué ya está en
                producción. Sin reportes armados a último momento.
              </p>
            </div>
            <div className="mockcard reveal">
              <div className="mock-top">
                <span className="t">devcore / proyecto-retail-negocio</span>
                <span className="t">Sprint 4 de 6</span>
              </div>
              <div className="mock-body">
                <div className="mock-side">
                  <div className="item active">Backlog</div>
                  <div className="item">En curso</div>
                  <div className="item">En revisión</div>
                  <div className="item">Entregado</div>
                  <div className="item" style={{ marginTop: 16, color: "#5E7071" }}>
                    Documentación
                  </div>
                  <div className="item" style={{ color: "#5E7071" }}>
                    Ambientes
                  </div>
                </div>
                <div className="mock-main">
                  <div className="mock-row">
                    <div>
                      <div className="name">Checkout con Mercado Pago</div>
                      <div className="bar">
                        <i style={{ width: "100%" }}></i>
                      </div>
                    </div>
                    <span className="badge done">Entregado</span>
                  </div>
                  <div className="mock-row">
                    <div>
                      <div className="name">Panel de stock multi-sucursal</div>
                      <div className="bar">
                        <i style={{ width: "70%" }}></i>
                      </div>
                    </div>
                    <span className="badge progress">En curso</span>
                  </div>
                  <div className="mock-row">
                    <div>
                      <div className="name">
                        App de repartidor — tracking en vivo
                      </div>
                      <div className="bar">
                        <i style={{ width: "40%" }}></i>
                      </div>
                    </div>
                    <span className="badge review">En revisión</span>
                  </div>
                  <div className="mock-row">
                    <div>
                      <div className="name">
                        Reportes y exportación contable
                      </div>
                      <div className="bar">
                        <i style={{ width: "12%" }}></i>
                      </div>
                    </div>
                    <span className="badge progress">En curso</span>
                  </div>
                </div>
              </div>
            </div>
            <p style={{ marginTop: 18, textAlign: "center" }}>
              <Link href="/login" className="nav-login">
                Este ejemplo es ilustrativo — si ya sos cliente, entrá a tu panel real acá
              </Link>
            </p>
          </div>
        </section>

        {/* COMO TRABAJAMOS */}
        <section className="section" id="planes">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Proceso</span>
              <h2>Cómo trabajamos</h2>
              <p className="lead">
                Un proceso simple para entender qué necesitás, definir el
                alcance y avanzar por etapas.
              </p>
            </div>
            <div className="steps reveal">
              <div className="step">
                <div className="step-num">01</div>
                <h4>Reunión inicial</h4>
                <p>
                  Nos contás cómo trabaja tu negocio, cuál es el problema y
                  qué resultado querés conseguir.
                </p>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <h4>Propuesta</h4>
                <p>
                  Definimos funcionalidades, alcance, tiempos estimados y
                  presupuesto según el proyecto.
                </p>
              </div>
              <div className="step">
                <div className="step-num">03</div>
                <h4>Desarrollo</h4>
                <p>
                  Avanzamos por etapas y mostramos el progreso para validar
                  que la solución responda a la necesidad real.
                </p>
              </div>
              <div className="step">
                <div className="step-num">04</div>
                <h4>Entrega y soporte</h4>
                <p>
                  Implementamos la solución y podemos continuar con
                  mantenimiento, mejoras y nuevas funciones.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 64 }}>
              <div className="plan-grid reveal">
                <div className="plan-card">
                  <h3>Sitio web</h3>
                  <p className="ideal">
                    Ideal para presentar un negocio, servicio o producto.
                  </p>
                  <div className="price">A cotizar</div>
                  <ul className="plan-feats">
                    <li>Diseño adaptable a celulares</li>
                    <li>Secciones según necesidad</li>
                    <li>Formulario o contacto</li>
                    <li>Publicación incluida según alcance</li>
                  </ul>
                  <a
                    href="mailto:devcore97@gmail.com"
                    className="btn btn-ghost btn-block"
                  >
                    Consultar
                  </a>
                </div>

                <div className="plan-card featured">
                  <span className="plan-tag">Más solicitado</span>
                  <h3>Sistema de gestión</h3>
                  <p className="ideal">
                    Ideal para digitalizar stock, ventas y administración.
                  </p>
                  <div className="price">A cotizar</div>
                  <ul className="plan-feats">
                    <li>Base de datos</li>
                    <li>Panel administrativo</li>
                    <li>Módulos según el negocio</li>
                    <li>Capacitación y puesta en marcha</li>
                  </ul>
                  <a
                    href="mailto:devcore97@gmail.com"
                    className="btn btn-primary btn-block"
                  >
                    Pedir propuesta
                  </a>
                </div>

                <div className="plan-card">
                  <h3>Software a medida</h3>
                  <p className="ideal">
                    Ideal cuando un sistema estándar no alcanza.
                  </p>
                  <div className="price">Según alcance</div>
                  <ul className="plan-feats">
                    <li>Análisis de requerimientos</li>
                    <li>Desarrollo por etapas</li>
                    <li>Integraciones necesarias</li>
                    <li>Mantenimiento opcional</li>
                  </ul>
                  <a
                    href="mailto:devcore97@gmail.com"
                    className="btn btn-ghost btn-block"
                  >
                    Contanos tu idea
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MODALIDAD */}
        <section className="section">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Modalidad</span>
              <h2>Una forma de trabajo adaptable</h2>
              <p className="lead">
                El esquema se define según el tamaño del proyecto y la
                necesidad del cliente.
              </p>
            </div>
            <div className="mod-grid reveal">
              <div className="mod-card reco">
                <h3>Proyecto por alcance</h3>
                <p>
                  Definimos qué se va a construir y presupuestamos el
                  trabajo antes de comenzar.
                </p>
                <div className="when">
                  Ideal para: sitios, sistemas y módulos definidos
                </div>
              </div>
              <div className="mod-card">
                <h3>Desarrollo por etapas</h3>
                <p>
                  Priorizamos funciones y hacemos crecer el sistema de forma
                  progresiva.
                </p>
                <div className="when">
                  Ideal para: proyectos que evolucionan con el negocio
                </div>
              </div>
              <div className="mod-card">
                <h3>Mantenimiento</h3>
                <p>
                  Continuamos con correcciones, mejoras y nuevas funciones
                  después de la entrega.
                </p>
                <div className="when">
                  Ideal para: sistemas que necesitan continuidad
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">Preguntas frecuentes</span>
              <h2>FAQ</h2>
            </div>
            <div className="faq-list reveal">
              <div className="faq-item open">
                <button className="faq-q">
                  <span>¿DevCore hace sistemas desde cero?</span>
                  <span className="plus">+</span>
                </button>
                <div className="faq-a">
                  <p>
                    Sí. Podemos desarrollar una solución nueva a partir de
                    los procesos y necesidades de tu negocio, y también
                    mejorar proyectos existentes cuando el alcance lo
                    permite.
                  </p>
                </div>
              </div>

              <div className="faq-item">
                <button className="faq-q">
                  <span>¿Cómo se define el precio?</span>
                  <span className="plus">+</span>
                </button>
                <div className="faq-a">
                  <p>
                    Primero relevamos lo que necesitás. Después armamos una
                    propuesta según funcionalidades, complejidad, tiempos e
                    integraciones. Preferimos cotizar cada proyecto de forma
                    realista en lugar de publicar precios que después no
                    coinciden con el trabajo.
                  </p>
                </div>
              </div>

              <div className="faq-item">
                <button className="faq-q">
                  <span>¿Trabajan solo en Formosa?</span>
                  <span className="plus">+</span>
                </button>
                <div className="faq-a">
                  <p>
                    No. Trabajamos de forma remota y actualmente tenemos
                    alcance en Argentina y Paraguay.
                  </p>
                </div>
              </div>

              <div className="faq-item">
                <button className="faq-q">
                  <span>¿Pueden integrar pagos o servicios externos?</span>
                  <span className="plus">+</span>
                </button>
                <div className="faq-a">
                  <p>
                    Sí, cuando el proyecto lo requiere podemos integrar
                    pasarelas de pago, APIs y otros servicios compatibles
                    con la solución.
                  </p>
                </div>
              </div>

              <div className="faq-item">
                <button className="faq-q">
                  <span>¿Qué pasa después de la entrega?</span>
                  <span className="plus">+</span>
                </button>
                <div className="faq-a">
                  <p>
                    Podemos continuar con soporte, mantenimiento,
                    correcciones y nuevas funcionalidades según lo que el
                    negocio vaya necesitando.
                  </p>
                </div>
              </div>

              <div className="faq-item">
                <button className="faq-q">
                  <span>¿Qué tecnologías utilizan?</span>
                  <span className="plus">+</span>
                </button>
                <div className="faq-a">
                  <p>
                    Trabajamos con React, Next.js y Nest.js en el frontend y
                    backend, bases de datos como PostgreSQL y MySQL/MariaDB,
                    Prisma como ORM, autenticación con NextAuth, Git y
                    GitHub para el control de versiones, y publicamos los
                    proyectos en Vercel, además de integraciones y servicios
                    externos según cada proyecto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band reveal">
              <span className="eyebrow">Hablemos</span>
              <h2>¿Querés digitalizar o automatizar una parte de tu negocio?</h2>
              <p>
                Contanos qué necesitás y te proponemos una solución acorde
                al alcance real del proyecto.
              </p>
              <a
                href="mailto:devcore97@gmail.com"
                className="btn btn-primary"
              >
                Contactar a DevCore
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div>
              <div className="foot-logo">
                <img src="/logo-horizontal.webp" alt="DevCore" />
              </div>
              <p className="foot-tag">
                Software a medida para negocios que quieren ordenar,
                digitalizar y mejorar sus procesos.
              </p>
            </div>
            <div className="foot-cols">
              <div className="foot-col">
                <h5>DevCore</h5>
                <a href="#servicios">Servicios</a>
                <a href="#industrias">Soluciones</a>
                <a href="#planes">Cómo trabajamos</a>
                <Link href="/login">Iniciar sesión</Link>
              </div>
              <div className="foot-col">
                <h5>Contacto</h5>
                <a href="mailto:devcore97@gmail.com">devcore97@gmail.com</a>
                <a href="#faq">Preguntas frecuentes</a>
              </div>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 DevCore</span>
            <img className="icon" src="/icon.webp" alt="" />
          </div>
        </div>
      </footer>

      <Script src="/landing.js" strategy="afterInteractive" />
    </>
  );
}