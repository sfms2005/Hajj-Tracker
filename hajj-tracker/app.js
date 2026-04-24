(function () {
  if (window.__hajjAppInitialized) return;
  window.__hajjAppInitialized = true;
  const STORAGE_KEYS = {
    selectedStep: "hajj-selected-step",
    favoriteDuas: "hajj-favorite-duas"
  };

  const startDate = new Date("2026-05-25");
  const endDate = new Date("2026-05-30");

  const stepInfo = {
    "step-1": {
      label: "ما قبل اليوم الثامن",
      short: "مرحلة التهيئة والنية الصادقة قبل بدء المناسك.",
      tasks: ["الاستعداد للحج بنية وإخلاص", "تجهيز الأغراض الأساسية", "التأكد من حمل الأدوية"]
    },
    "step-2": {
      label: "اليوم الثامن",
      short: "يوم التروية وبداية الحركة العملية للمناسك.",
      tasks: ["الإحرام من الميقات", "التوجه إلى منى", "الإكثار من التلبية والذكر"]
    },
    "step-3": {
      label: "يوم عرفة",
      short: "أعظم أيام الحج، يوم الوقوف والدعاء.",
      tasks: ["الوقوف بعرفة حتى الغروب", "الإكثار من الدعاء والاستغفار", "الانتقال إلى مزدلفة بهدوء"]
    },
    "step-4": {
      label: "اليوم العاشر",
      short: "يوم النحر وأعماله الأساسية.",
      tasks: ["رمي جمرة العقبة", "ذبح الهدي والحلق أو التقصير", "طواف الإفاضة والسعي"]
    },
    "step-5": {
      label: "أيام التشريق",
      short: "أيام الرمي والذكر والاستمرار في الطاعة.",
      tasks: ["رمي الجمرات بالترتيب", "المحافظة على الصلوات والذكر", "تنظيم الوقت والراحة"]
    },
    "step-6": {
      label: "طواف الوداع",
      short: "ختام الرحلة بشكر الله والرجوع مطمئنًا.",
      tasks: ["الاستعداد للمغادرة", "أداء طواف الوداع", "الدعاء بخاتمة مباركة"]
    }
  };

  const motivationMap = {
    "step-1": "ابدأ النية اليوم، فالبداية الصادقة تصنع رحلة مباركة.",
    "step-2": "يوم التروية خطوة ثبات... سر بهدوء وطمأنينة.",
    "step-3": "هذا يوم الدعاء العظيم، اجعل قلبك حاضرًا.",
    "step-4": "أنجزت الكثير، واليوم يوم البركة والفرح.",
    "step-5": "ثباتك في أيام التشريق علامة توفيق.",
    "step-6": "الحمد لله على تمام الرحلة، تقبل الله حجك."
  };

  const duas = [
    "اللهم تقبل مني إنك أنت السميع العليم.",
    "اللهم اغفر لي وارحمني واهدني وعافني وارزقني.",
    "اللهم ارزقني حجًا مبرورًا وسعيًا مشكورًا وذنبًا مغفورًا.",
    "اللهم اجعلني من عبادك المقبولين في الدنيا والآخرة."
  ];

  function normalizeDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getCurrentHajjState() {
    const today = normalizeDate(new Date());
    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);

    if (today < start) {
      const diffDays = Math.floor((start - today) / (1000 * 60 * 60 * 24));
      const progress = clamp(Math.round(10 - (diffDays / 30) * 9), 1, 10);
      return { step: "step-1", title: "ما قبل اليوم الثامن", progress };
    }

    if (today >= start && today <= end) {
      const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
      const map = [
        { title: "اليوم الثامن", step: "step-2", progress: 20 },
        { title: "اليوم التاسع", step: "step-3", progress: 40 },
        { title: "اليوم العاشر", step: "step-4", progress: 60 },
        { title: "أول أيام التشريق", step: "step-5", progress: 75 },
        { title: "ثاني أيام التشريق", step: "step-5", progress: 90 },
        { title: "ثالث أيام التشريق", step: "step-5", progress: 100 }
      ];
      return map[diffDays] || map[0];
    }

    return { step: "step-6", title: "ختام الرحلة", progress: 100 };
  }

  function setupShell() {
    const overlay = document.getElementById("nav-overlay");
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menu-btn");
    if (!overlay || !sidebar || !menuBtn) return;

    function openNav() {
      sidebar.classList.add("is-open");
      overlay.classList.add("is-visible");
      document.body.classList.add("nav-open");
    }

    function closeNav() {
      sidebar.classList.remove("is-open");
      overlay.classList.remove("is-visible");
      document.body.classList.remove("nav-open");
    }

    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (sidebar.classList.contains("is-open")) closeNav();
      else openNav();
    });
    overlay.addEventListener("click", closeNav);
    sidebar.querySelectorAll(".sidebar-link").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  function renderFooter() {
    const footer = document.querySelector(".footer");
    if (footer) footer.textContent = "Made with ♡ by Sara Fawaz | © 2026 All Rights Reserved";
  }

  function renderHome() {
    const state = getCurrentHajjState();
    const titleEl = document.getElementById("dynamic-title");
    const progressText = document.getElementById("progress-text");
    const progressFill = document.getElementById("progress-fill");
    const progressTrack = document.getElementById("progress-track");
    const motivationEl = document.getElementById("motivation");

    if (titleEl) titleEl.textContent = state.title;
    if (progressText) progressText.textContent = state.progress + "%";
    if (progressFill) progressFill.style.width = state.progress + "%";
    if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(state.progress));
    if (motivationEl) motivationEl.textContent = motivationMap[state.step] || motivationMap["step-1"];

    document.querySelectorAll(".step").forEach(function (stepEl) {
      stepEl.classList.toggle("active", stepEl.id === state.step);
      stepEl.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.setItem(STORAGE_KEYS.selectedStep, stepEl.id);
        window.location.href = "day.html";
      });
    });

    const label = document.getElementById("here-label");
    const activeStep = document.getElementById(state.step);
    if (label && activeStep) {
      activeStep.appendChild(label);
    }
  }

  function renderDay() {
    const currentState = getCurrentHajjState();
    const selectedStep = localStorage.getItem(STORAGE_KEYS.selectedStep) || currentState.step;
    const info = stepInfo[selectedStep] || stepInfo["step-1"];

    const dayTitle = document.getElementById("selected-day-title");
    const dayDescription = document.getElementById("day-description");
    const dayNotice = document.getElementById("day-notice");
    const checklist = document.getElementById("checklist");
    const duasMini = document.getElementById("duas-mini-list");

    if (dayTitle) dayTitle.textContent = info.label;
    if (dayDescription) dayDescription.textContent = info.short;

    if (dayNotice) {
      if (selectedStep !== currentState.step) {
        dayNotice.textContent = "ليست مرحلتك الحالية";
        dayNotice.classList.remove("hidden");
      } else {
        dayNotice.classList.add("hidden");
      }
    }

    if (checklist) {
      const storageKey = "hajj-checklist-" + selectedStep;
      let saved = [];
      try {
        saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      } catch (e) {
        saved = [];
      }

      checklist.innerHTML = "";
      info.tasks.forEach(function (task, idx) {
        const li = document.createElement("li");
        const label = document.createElement("label");
        label.className = "checklist-label";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = saved[idx] === true;
        input.addEventListener("change", function () {
          const state = [];
          checklist.querySelectorAll("input[type='checkbox']").forEach(function (cb) {
            state.push(cb.checked);
          });
          localStorage.setItem(storageKey, JSON.stringify(state));
        });

        const text = document.createElement("span");
        text.textContent = task;

        label.appendChild(input);
        label.appendChild(text);
        li.appendChild(label);
        checklist.appendChild(li);
      });
    }

    if (duasMini) {
      duasMini.innerHTML = "";
      duas.slice(0, 3).forEach(function (duaText) {
        const card = document.createElement("div");
        card.className = "dua-card";
        const p = document.createElement("p");
        p.className = "dua-text";
        p.textContent = duaText;
        card.appendChild(p);
        duasMini.appendChild(card);
      });
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return Promise.resolve();
  }

  function renderDua() {
    const list = document.getElementById("dua-list");
    if (!list) return;

    let favorites = [];
    try {
      favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.favoriteDuas) || "[]");
    } catch (e) {
      favorites = [];
    }

    const favSet = new Set(favorites);
    list.innerHTML = "";

    duas.forEach(function (duaText, idx) {
      const id = "dua-" + idx;
      const card = document.createElement("article");
      card.className = "dua-card";

      const p = document.createElement("p");
      p.className = "dua-text";
      p.textContent = duaText;

      const actions = document.createElement("div");
      actions.className = "inline-actions";

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "small-btn";
      copyBtn.textContent = "نسخ";
      copyBtn.addEventListener("click", function () {
        copyText(duaText).then(function () {
          copyBtn.textContent = "تم النسخ";
          setTimeout(function () {
            copyBtn.textContent = "نسخ";
          }, 1200);
        });
      });

      const favBtn = document.createElement("button");
      favBtn.type = "button";
      favBtn.className = "small-btn";
      favBtn.textContent = "مفضلة";
      if (favSet.has(id)) favBtn.classList.add("active");
      favBtn.addEventListener("click", function () {
        if (favSet.has(id)) favSet.delete(id);
        else favSet.add(id);
        favBtn.classList.toggle("active", favSet.has(id));
        localStorage.setItem(STORAGE_KEYS.favoriteDuas, JSON.stringify(Array.from(favSet)));
      });

      actions.appendChild(copyBtn);
      actions.appendChild(favBtn);
      card.appendChild(p);
      card.appendChild(actions);
      list.appendChild(card);
    });
  }

  function renderHealth() {
    const form = document.getElementById("health-form");
    const status = document.getElementById("health-status");
    if (!form || !status) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "تم إرسال الطلب بنجاح، سيتم المتابعة معك فورًا.";
      form.reset();
    });
  }

  function init() {
    setupShell();
    renderFooter();
    const page = document.body.getAttribute("data-page");
    if (page === "home") renderHome();
    if (page === "day") renderDay();
    if (page === "dua") renderDua();
    if (page === "health") renderHealth();
  }

  window.HajjApp = { getCurrentHajjState };
  document.addEventListener("DOMContentLoaded", init);
})();
