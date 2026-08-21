document.documentElement.classList.add("js");

// Terminal typing effect
const termBody = document.getElementById("termBody");
if (termBody) {
  const lines = [
    { t: "$ devcore init retail-negocio", cls: "prompt" },
    { t: "> Analizando objetivo del negocio...", cls: "" },
    { t: "> Diseño UX/UI            [ok]", cls: "ok" },
    { t: "> Backend & API           [ok]", cls: "ok" },
    { t: "> Integración de pagos    [ok]", cls: "ok" },
    { t: "> Deploy a producción     [ok]", cls: "ok" },
    { t: "$ listo — negocio en producción", cls: "prompt" },
  ];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lineIndex = 0;
  let characterIndex = 0;
  let timer;

  function appendLine(line, text = "") {
    const row = document.createElement("div");
    const content = document.createElement("span");
    const caret = document.createElement("span");
    row.className = `term-line${line.cls ? ` ${line.cls}` : ""}`;
    content.className = "caretline";
    content.textContent = text;
    caret.className = "term-caret";
    row.append(content, caret);
    termBody.appendChild(row);
  }

  function renderStatic() {
    window.clearTimeout(timer);
    termBody.replaceChildren();
    lines.forEach((line) => {
      appendLine(line, line.t);
      termBody.lastElementChild?.querySelector(".term-caret")?.remove();
    });
  }

  function scheduleNext(delay) {
    window.clearTimeout(timer);
    if (!document.hidden && !reducedMotion.matches) {
      timer = window.setTimeout(typeNext, delay);
    }
  }

  function typeNext() {
    if (document.hidden || reducedMotion.matches) return;

    if (lineIndex >= lines.length) {
      timer = window.setTimeout(() => {
        if (document.hidden || reducedMotion.matches) return;
        termBody.replaceChildren();
        lineIndex = 0;
        characterIndex = 0;
        typeNext();
      }, 2400);
      return;
    }

    const line = lines[lineIndex];
    if (characterIndex === 0) appendLine(line);

    const row = termBody.lastElementChild;
    const content = row?.querySelector(".caretline");
    if (!row || !content) return;

    characterIndex += 1;
    content.textContent = line.t.slice(0, characterIndex);

    if (characterIndex >= line.t.length) {
      row.querySelector(".term-caret")?.remove();
      lineIndex += 1;
      characterIndex = 0;
      scheduleNext(260);
    } else {
      scheduleNext(18 + Math.random() * 22);
    }
  }

  function handleVisibilityChange() {
    window.clearTimeout(timer);
    if (!document.hidden && !reducedMotion.matches) scheduleNext(0);
  }

  function handleMotionPreference() {
    if (reducedMotion.matches) {
      renderStatic();
    } else {
      termBody.replaceChildren();
      lineIndex = 0;
      characterIndex = 0;
      scheduleNext(0);
    }
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  reducedMotion.addEventListener("change", handleMotionPreference);
  handleMotionPreference();
}

// Reveal on scroll
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("in"));
}
