/* QUESTIONS + LOGIC (separado) */
/* Edítalas en el objeto `forms` si quieres cambiar texto o respuestas. */
/* Respuestas usan index: 0 = A, 1 = B, 2 = C */

const forms = {
  mate: {
    title: "Matemáticas",
    questions: [
      { q: "¿Cuánto es 5 + 3?", options: ["6", "8", "10"], answer: 1 },
      { q: "¿Cuál es la mitad de 10?", options: ["2", "5", "7"], answer: 1 },
      { q: "¿Cuánto es 4 × 2?", options: ["6", "8", "10"], answer: 1 },
      { q: "¿Qué número sigue a 14?", options: ["15", "16", "18"], answer: 0 },
      { q: "¿Cuál es 9 − 3?", options: ["6", "5", "7"], answer: 0 }
    ]
  },
  fisica: {
    title: "Física",
    questions: [
      { q: "¿Qué mide la masa?", options: ["Volumen", "Cantidad de materia", "Peso"], answer: 1 },
      { q: "¿Qué instrumento mide el tiempo?", options: ["Balanza", "Cronómetro", "Termómetro"], answer: 1 },
      { q: "Si un objeto no cambia su velocidad, ¿está en?", options: ["Movimiento uniforme", "Aceleración", "Reposo absoluto"], answer: 0 },
      { q: "¿La gravedad atrae o repele?", options: ["Atrae", "Repele", "No actúa"], answer: 0 },
      { q: "¿Qué unidad se usa para distancia?", options: ["Segundos", "Metros", "Grados"], answer: 1 }
    ]
  },
  quimica: {
    title: "Química",
    questions: [
      { q: "¿En qué estado está el agua a 100°C (a nivel del mar)?", options: ["Sólido", "Líquido", "Gas"], answer: 2 },
      { q: "¿Qué es una mezcla?", options: ["Agua pura", "Aire", "Oro puro"], answer: 1 },
      { q: "¿Partícula básica de un elemento?", options: ["Molécula", "Átomo", "Tejido"], answer: 1 },
      { q: "¿El hielo es qué estado?", options: ["Sólido", "Líquido", "Gas"], answer: 0 },
      { q: "¿El agua es una sustancia?", options: ["Sí", "No", "Solo en frío"], answer: 0 }
    ]
  },
  lenguaje: {
    title: "Lenguaje",
    questions: [
      { q: "Sinónimo de 'rápido'?", options: ["Lento", "Veloz", "Pesado"], answer: 1 },
      { q: "Sujeto en 'María corre rápido'?", options: ["Corre", "María", "Rápido"], answer: 1 },
      { q: "Plural de 'libro'?", options: ["Libros", "Libra", "Libroes"], answer: 0 },
      { q: "Letra que inicia 'Sol'?", options: ["S", "L", "O"], answer: 0 },
      { q: "¿'él/ella' se refiere a...?", options: ["un lugar", "una persona", "un objeto"], answer: 1 }
    ]
  }
};

/* -------------------- state & persistence -------------------- */
const PIN_CORRECTO = "1234";
let currentSubject = null;
const completedKey = "cv_completed_v2";
const completed = new Set(JSON.parse(localStorage.getItem(completedKey) || "[]"));

/* DOM refs */
const pinScreen = document.getElementById("pin-screen");
const menu = document.getElementById("menu");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const questionsArea = document.getElementById("questions-area");
const modalFeedback = document.getElementById("modal-feedback");

/* init: hook buttons and disable completed */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pin-btn").addEventListener("click", validarPIN);
  document.getElementById("close-modal").addEventListener("click", closeModal);
  document.getElementById("btn-cancel").addEventListener("click", closeModal);

  document.querySelectorAll(".card-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.sub;
      openSubject(key);
    });
  });

  // disable completed stored subjects
  for (const subj of completed) {
    const b = document.getElementById(`btn-${subj}`);
    if (b) b.disabled = true;
  }
});

/* PIN validation */
function validarPIN() {
  const v = document.getElementById("pin-input").value.trim();
  const err = document.getElementById("pin-error");
  err.textContent = "";
  if (v === PIN_CORRECTO) {
    pinScreen.classList.add("hidden");
    menu.classList.remove("hidden");
  } else {
    err.textContent = "PIN incorrecto — intenta de nuevo";
  }
}

/* open subject modal */
function openSubject(key) {
  if (!forms[key]) return;
  if (completed.has(key)) return;
  currentSubject = key;
  buildModal(key);
  openModal();
}

function buildModal(key) {
  const data = forms[key];
  modalTitle.textContent = data.title;
  modalFeedback.textContent = "";
  questionsArea.innerHTML = "";

  data.questions.forEach((qObj, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "question";
    wrap.dataset.index = idx;

    const qt = document.createElement("p");
    qt.className = "q-title";
    qt.textContent = `${idx + 1}. ${qObj.q}`;
    wrap.appendChild(qt);

    const opts = document.createElement("div");
    opts.className = "options";

    qObj.options.forEach((optText, iOpt) => {
      const lbl = document.createElement("label");
      lbl.className = "option";
      const inp = document.createElement("input");
      inp.type = "radio";
      inp.name = `q${idx}`;
      inp.value = iOpt;
      lbl.appendChild(inp);
      const span = document.createElement("span");
      span.textContent = ` ${String.fromCharCode(65 + iOpt)}. ${optText}`;
      lbl.appendChild(span);
      opts.appendChild(lbl);
    });

    wrap.appendChild(opts);

    const msg = document.createElement("div");
    msg.className = "q-msg hidden";
    wrap.appendChild(msg);

    questionsArea.appendChild(wrap);
  });

  // scroll top of modal
  if (questionsArea.parentElement) questionsArea.parentElement.scrollTop = 0;
}

function openModal() {
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    const first = questionsArea.querySelector("input");
    if (first) first.focus();
  }, 120);
}

function tryCloseModal(e) {
  // click outside modal closes
  closeModal();
}

function closeModal() {
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
  modalFeedback.textContent = "";
  questionsArea.innerHTML = "";
  currentSubject = null;
}

/* submit answers */
function submitSubject(e) {
  e.preventDefault();
  if (!currentSubject) return false;
  const data = forms[currentSubject];
  const qElems = Array.from(questionsArea.querySelectorAll(".question"));
  const wrongIndices = [];

  // reset
  qElems.forEach(q => {
    q.classList.remove("incorrect");
    const msg = q.querySelector(".q-msg");
    msg.textContent = "";
    msg.classList.add("hidden");
  });
  modalFeedback.textContent = "";

  qElems.forEach((q, idx) => {
    const checked = q.querySelector("input:checked");
    const correctIdx = data.questions[idx].answer;
    const msg = q.querySelector(".q-msg");
    if (!checked || Number(checked.value) !== correctIdx) {
      wrongIndices.push(idx + 1);
      q.classList.add("incorrect");
      if (msg) { msg.textContent = "✖ Incorrecta"; msg.classList.remove("hidden"); }
    }
  });

  // disable subject button and persist
  const subjBtn = document.getElementById(`btn-${currentSubject}`);
  if (subjBtn) {
    subjBtn.disabled = true;
    completed.add(currentSubject);
    localStorage.setItem(completedKey, JSON.stringify([...completed]));
  }

  // feedback: show only wrong indices or success
  if (wrongIndices.length === 0) {
    modalFeedback.className = "modal-feedback ok";
    modalFeedback.textContent = "✅ Todas correctas";
  } else {
    modalFeedback.className = "modal-feedback error";
    modalFeedback.textContent = `Preguntas incorrectas: ${wrongIndices.join(", ")}`;
  }

  // leave modals open for review; user closes manually
  return false;
}

/* expose submit to form */
window.submitSubject = submitSubject;
window.tryCloseModal = tryCloseModal;
