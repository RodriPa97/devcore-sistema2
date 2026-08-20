document.documentElement.classList.add('js');

// Mobile navigation
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
if(nav && navToggle){
  const closeMenu = () => {
    nav.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  };

  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
}

// Terminal typing effect
const lines = [
  {t:"$ devcore init retail-negocio", cls:"prompt"},
  {t:"> Analizando objetivo del negocio...", cls:""},
  {t:"> Diseño UX/UI            [ok]", cls:"ok"},
  {t:"> Backend & API           [ok]", cls:"ok"},
  {t:"> Integración de pagos    [ok]", cls:"ok"},
  {t:"> Deploy a producción     [ok]", cls:"ok"},
  {t:"$ listo — negocio en producción", cls:"prompt"},
];
const termBody = document.getElementById('termBody');
let li = 0, ci = 0;
function typeNext(){
  if(li >= lines.length){
    // restart after pause
    setTimeout(()=>{ termBody.innerHTML=''; li=0; ci=0; typeNext(); }, 2400);
    return;
  }
  const line = lines[li];
  if(ci === 0){
    const div = document.createElement('div');
    div.className = 'term-line' + (line.cls ? ' '+line.cls : '');
    div.innerHTML = '<span class="caretline"></span><span class="term-caret"></span>';
    termBody.appendChild(div);
  }
  const div = termBody.lastElementChild;
  const caretSpan = div.querySelector('.term-caret');
  ci++;
  div.querySelector('.caretline').textContent = line.t.slice(0, ci);
  if(ci >= line.t.length){
    caretSpan.remove();
    li++; ci = 0;
    setTimeout(typeNext, 260);
  } else {
    setTimeout(typeNext, 18 + Math.random()*22);
  }
}
typeNext();

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item=>{
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  const setState = (open) => {
    q.setAttribute('aria-expanded', String(open));
    a.setAttribute('aria-hidden', String(!open));
    a.style.maxHeight = open ? a.scrollHeight + 'px' : null;
  };

  setState(item.classList.contains('open'));
  q.addEventListener('click', ()=>{
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o=>{
      o.classList.remove('open');
      const openQuestion = o.querySelector('.faq-q');
      const answer = o.querySelector('.faq-a');
      openQuestion.setAttribute('aria-expanded', 'false');
      answer.setAttribute('aria-hidden', 'true');
      answer.style.maxHeight = null;
    });
    if(!isOpen){
      item.classList.add('open');
      setState(true);
    }
  });
});

// NOTA: acá antes había un bloque que reescribía a mano el texto y el
// href de los links "Iniciar sesión" / "Registrarse" del header,
// apuntándolos a login.html / registro.html (como en el sitio estático
// viejo). Ahora esos links ya son <Link> de Next.js con la ruta correcta
// (/login y /registro) puestos directamente en app/(site)/page.js, así
// que este script sobra — y de hecho estaba pisando esos links y
// rompiéndolos (los mandaba a "login.html", que no existe en Next.js).
// Se eliminó a propósito. No volver a agregar esta lógica acá.
