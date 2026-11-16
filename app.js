
/* =====================================================
   ATLAS MÉDICAL BY @WREDOU
   Fonctionnement principal de l'application
   Version 2.0
===================================================== */

/* -----------------------------------------------------
   1. CONNEXION À LA BIBLIOTHÈQUE CARDIOVASCULAIRE
----------------------------------------------------- */

const $ = selector => document.querySelector(selector);

const cardioData = window.ATLAS_CARDIO_DATA;

if (!cardioData || !Array.isArray(cardioData.modules)) {
  console.error("La bibliothèque cardiovasculaire est introuvable.");
}

const modulePresentation = {
  anatomie: {
    desc: "Cœur, vaisseaux et circulation",
    tone: "#e0f5f1"
  },
  syndromes: {
    desc: "Tableaux cliniques et associations",
    tone: "#e9eef9"
  },
  semiologie: {
    desc: "Signes, examens et manœuvres",
    tone: "#fff1df"
  },
  bilans: {
    desc: "Biologie et explorations",
    tone: "#f0eafa"
  },
  ecg: {
    desc: "Méthode de lecture des tracés",
    tone: "#fce9ec"
  },
  urgences: {
    desc: "Repères et conduite initiale",
    tone: "#fff4d9"
  },
  classifications: {
    desc: "Scores et points essentiels",
    tone: "#e8f1fa"
  },
  entrainement: {
    desc: "S'entraîner et s'autoévaluer",
    tone: "#e9f5e8"
  }
};

const modules = (cardioData?.modules || []).map(module => ({
  ...module,
  desc: module.description || modulePresentation[module.id]?.desc || "",
  tone: modulePresentation[module.id]?.tone || "#e0f5f1",
  detail: module.description || "",
  topics: (module.chapters || []).map(chapter => chapter.title)
}));

let saved = new Set();
let viewedChapters = new Set();
let currentPage = "home";
let deferredPrompt = null;
let currentModule = null;

/* -----------------------------------------------------
   2. STOCKAGE LOCAL
----------------------------------------------------- */

function loadLocalData() {
  try {
    const favorites = JSON.parse(
      localStorage.getItem("atlas-favorites") || "[]"
    );

    if (Array.isArray(favorites)) {
      saved = new Set(
        favorites.filter(id =>
          modules.some(module => module.id === id)
        )
      );
    }

    const viewed = JSON.parse(
      localStorage.getItem("atlas-viewed-chapters") || "[]"
    );

    if (Array.isArray(viewed)) {
      viewedChapters = new Set(
        viewed.filter(id => typeof id === "string")
      );
    }
  } catch (error) {
    saved = new Set();
    viewedChapters = new Set();
  }
}

function saveFavorites(nextSaved) {
  try {
    localStorage.setItem(
      "atlas-favorites",
      JSON.stringify([...nextSaved])
    );
    return true;
  } catch (error) {
    toast("Impossible d'enregistrer les favoris.");
    return false;
  }
}

function saveViewedChapters() {
  try {
    localStorage.setItem(
      "atlas-viewed-chapters",
      JSON.stringify([...viewedChapters])
    );
  } catch (error) {
    toast("Impossible d'enregistrer la progression.");
  }
}

loadLocalData();

/* -----------------------------------------------------
   3. NOTIFICATIONS
----------------------------------------------------- */

function toast(message) {
  const element = $("#toast");

  if (!element) return;

  element.textContent = message;
  element.classList.add("show");

  setTimeout(() => {
    element.classList.remove("show");
  }, 2100);
}

/* -----------------------------------------------------
   4. PROGRESSION
----------------------------------------------------- */

function getTotalChapters() {
  return modules.reduce(
    (total, module) => total + (module.chapters || []).length,
    0
  );
}

function updateProgress() {
  const total = getTotalChapters();
  const completed = viewedChapters.size;

  const percentage = total
    ? Math.min(100, Math.round((completed / total) * 100))
    : 0;

  const number = $("#progressNumber");
  const ring = $("#progressRing");
  const text = $("#progressText");

  if (number) number.textContent = percentage;

  if (ring) {
    ring.style.background =
      `conic-gradient(#16a995 ${percentage}%, #e8eef2 ${percentage}%)`;
  }

  if (text) {
    text.textContent =
      `${completed} chapitre(s) consulté(s) sur ${total}. ` +
      "Ta progression est conservée sur cet appareil.";
  }
}

/* -----------------------------------------------------
   5. AFFICHAGE DES MODULES
----------------------------------------------------- */

function renderModules(list = modules) {
  const grid = $("#moduleGrid");
  if (!grid) return;

  grid.replaceChildren();

  const count = $("#moduleCount");
  if (count) {
    count.textContent =
      String(list.length).padStart(2, "0") + " modules";
  }

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent =
      "Aucun module trouvé. Essaie un autre mot-clé.";

    grid.appendChild(empty);
    return;
  }

  list.forEach(module => {
    const button = document.createElement("button");
    button.className = "module-card";

    const icon = document.createElement("span");
    icon.className = "module-icon";
    icon.style.backgroundColor = module.tone;
    icon.textContent = module.icon || "✚";

    const title = document.createElement("strong");
    title.textContent = module.title;

    const description = document.createElement("small");
    description.textContent = module.desc;

    const chapterCount = document.createElement("small");
    chapterCount.textContent =
      `${(module.chapters || []).length} chapitre(s)`;

    button.append(icon, title, description, chapterCount);

    button.addEventListener("click", () => {
      openModule(module);
    });

    grid.appendChild(button);
  });
}

/* -----------------------------------------------------
   6. GESTION DES FAVORIS
----------------------------------------------------- */

function createFavoriteButton(module) {
  const button = document.createElement("button");
  button.className = "primary-btn";

  function updateLabel() {
    button.textContent = saved.has(module.id)
      ? "★ Retirer des favoris"
      : "☆ Ajouter aux favoris";
  }

  updateLabel();

  button.addEventListener("click", () => {
    const nextSaved = new Set(saved);

    if (nextSaved.has(module.id)) {
      nextSaved.delete(module.id);
    } else {
      nextSaved.add(module.id);
    }

    if (!saveFavorites(nextSaved)) return;

    saved = nextSaved;
    updateLabel();

    toast(
      saved.has(module.id)
        ? "Ajouté aux favoris"
        : "Retiré des favoris"
    );
  });

  return button;
}

/* -----------------------------------------------------
   7. OUVERTURE D'UN MODULE
----------------------------------------------------- */

function openModule(module) {
  currentModule = module;

  $("#dialogTag").textContent = "ATLAS CARDIOVASCULAIRE";

  const content = $("#dialogContent");
  content.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = module.title;

  const description = document.createElement("p");
  description.textContent = module.detail;

  const chapterHeading = document.createElement("h3");
  chapterHeading.textContent = "Chapitres disponibles";

  const list = document.createElement("div");
  list.className = "content-list";

  (module.chapters || []).forEach((chapter, index) => {
    const button = document.createElement("button");
    button.className = "secondary-btn";
    button.style.cssText =
      "display:block;width:100%;text-align:left;margin:8px 0;";

    const isViewed = viewedChapters.has(
      `${module.id}:${chapter.id}`
    );

    button.textContent =
      `${isViewed ? "✓ " : ""}${index + 1}. ${chapter.title}`;

    button.addEventListener("click", () => {
      openChapter(module, chapter);
    });

    list.appendChild(button);
  });

  const favoriteButton = createFavoriteButton(module);

  const note = document.createElement("p");
  note.className = "small-note";
  note.textContent =
    "Contenu pédagogique à compléter et à valider à partir des recommandations et références scientifiques.";

  content.append(
    title,
    description,
    chapterHeading,
    list,
    favoriteButton,
    note
  );

  $("#moduleDialog").showModal();
}

/* -----------------------------------------------------
   8. OUVERTURE D'UN CHAPITRE
----------------------------------------------------- */

function openChapter(module, chapter) {
  const content = $("#dialogContent");
  content.replaceChildren();

  currentModule = module;

  const backButton = document.createElement("button");
  backButton.className = "secondary-btn";
  backButton.textContent = "← Retour aux chapitres";

  backButton.addEventListener("click", () => {
    openModule(module);
  });

  const title = document.createElement("h2");
  title.textContent = chapter.title;

  content.append(backButton, title);

  if (Array.isArray(chapter.sections)) {
    chapter.sections.forEach(section => {
      const sectionBox = document.createElement("section");
      sectionBox.style.cssText =
        "margin:18px 0;padding-bottom:12px;border-bottom:1px solid var(--line);";

      const heading = document.createElement("h3");
      heading.textContent = section.heading;

      const paragraph = document.createElement("p");
      paragraph.style.cssText =
        "font-size:14px;line-height:1.8;color:var(--muted);";
      paragraph.textContent = section.content;

      sectionBox.append(heading, paragraph);
      content.appendChild(sectionBox);
    });
  }

  const chapterKey = `${module.id}:${chapter.id}`;

  if (!viewedChapters.has(chapterKey)) {
    viewedChapters.add(chapterKey);
    saveViewedChapters();
    updateProgress();
  }

  const completed = document.createElement("p");
  completed.className = "small-note";
  completed.textContent =
    "✓ Chapitre consulté. Ta progression a été enregistrée sur cet appareil.";

  content.appendChild(completed);
}

/* -----------------------------------------------------
   9. PRÉPARATION DES PAGES
----------------------------------------------------- */

function preparePage(title, subtitle, count) {
  $(".hero").style.display = "none";
  $(".study-card").style.display = "none";
  $(".search-box").style.display = "none";

  $(".section-head h2").textContent = title;
  $(".section-head .eyebrow").textContent = subtitle;

  $("#moduleCount").textContent = count;
  $("#moduleGrid").style.display = "grid";
}

function showPlaceholder(title, description) {
  const grid = $("#moduleGrid");
  grid.replaceChildren();

  const card = document.createElement("div");
  card.style.cssText =
    "grid-column:1/-1;background:white;border:1px solid var(--line);border-radius:16px;padding:20px;";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.style.cssText =
    "font-size:13px;color:var(--muted);line-height:1.7;";
  paragraph.textContent = description;

  card.append(heading, paragraph);
  grid.appendChild(card);
}

/* -----------------------------------------------------
   10. PAGE PLUS
----------------------------------------------------- */

function renderMore() {
  preparePage("Plus", "OUTILS ET ESPACE PERSONNEL", "4 rubriques");

  const grid = $("#moduleGrid");
  grid.replaceChildren();

  const items = [
    {
      icon: "◎",
      title: "Scores médicaux",
      description: "Scores et classifications par spécialité",
      page: "scores"
    },
    {
      icon: "☑",
      title: "QCM et cas cliniques",
      description: "Teste tes connaissances",
      page: "quiz"
    },
    {
      icon: "★",
      title: "Mes favoris",
      description: "Retrouve tes contenus enregistrés",
      page: "saved"
    },
    {
      icon: "◉",
      title: "Mon profil",
      description: "Paramètres et informations de l'application",
      page: "profile"
    }
  ];

  items.forEach(item => {
    const button = document.createElement("button");
    button.className = "module-card";

    const icon = document.createElement("span");
    icon.className = "module-icon";
    icon.style.backgroundColor = "#e0f5f1";
    icon.textContent = item.icon;

    const title = document.createElement("strong");
    title.textContent = item.title;

    const description = document.createElement("small");
    description.textContent = item.description;

    button.append(icon, title, description);

    button.addEventListener("click", () => {
      setPage(item.page);
    });

    grid.appendChild(button);
  });
}

/* -----------------------------------------------------
   11. CALCULATRICES ET ACTUALITÉS
----------------------------------------------------- */

function renderExternalSection(type) {
  const isCalculator = type === "calculators";

  preparePage(
    isCalculator ? "Calculatrices médicales" : "Actualités médicales",
    isCalculator ? "OUTILS DE CALCUL CLINIQUE" : "ACTUALITÉS AU SÉNÉGAL",
    isCalculator ? "Calculs" : "Actualités"
  );

  const grid = $("#moduleGrid");
  grid.replaceChildren();

  const externalModule = isCalculator
    ? window.ATLAS_CALCULATORS
    : window.ATLAS_NEWS;

  if (
    externalModule &&
    typeof externalModule.render === "function"
  ) {
    try {
      externalModule.render(grid, { toast });
      return;
    } catch (error) {
      console.error("Erreur de chargement du module :", error);
    }
  }

  showPlaceholder(
    isCalculator
      ? "Calculatrices en préparation"
      : "Actualités médicales en préparation",
    isCalculator
      ? "Les calculatrices seront progressivement intégrées. Les calculs seront effectués localement sur ton appareil."
      : "Cette rubrique accueillera les actualités médicales du Sénégal provenant de sources institutionnelles et scientifiques fiables. Une connexion internet sera nécessaire pour actualiser les informations."
  );
}

/* -----------------------------------------------------
   12. SCORES MÉDICAUX
----------------------------------------------------- */

function renderScores() {
  preparePage(
    "Scores médicaux",
    "OUTILS D'ÉVALUATION CLINIQUE",
    "Bibliothèque"
  );

  const grid = $("#moduleGrid");
  grid.replaceChildren();

  if (
    window.ATLAS_SCORES &&
    typeof window.ATLAS_SCORES.render === "function"
  ) {
    try {
      window.ATLAS_SCORES.render(grid, { toast });
      return;
    } catch (error) {
      console.error("Erreur de chargement des scores :", error);
    }
  }

  showPlaceholder(
    "Scores médicaux indisponibles",
    "Vérifie que le fichier scores.js est bien enregistré et chargé dans index.html."
  );
}

/* -----------------------------------------------------
   13. QCM
----------------------------------------------------- */

function renderQuiz() {
  preparePage(
    "Entraînement",
    "TESTE TES CONNAISSANCES",
    "QCM"
  );

  $("#moduleGrid").innerHTML = `
    <div class="quiz-card"
      style="grid-column:1/-1;border:1px solid var(--line);padding:18px;border-radius:16px">
      <p class="eyebrow">QUESTION D’EXEMPLE</p>
      <h3 style="font:700 17px Manrope">
        Quel est le pacemaker physiologique principal du cœur ?
      </h3>
      <div id="quizOptions"></div>
      <p id="quizFeedback" aria-live="polite"
        style="font-size:12px;color:var(--muted)"></p>
    </div>
  `;

  const options = [
    "Le nœud sinusal",
    "Le nœud auriculo-ventriculaire",
    "Le faisceau de His",
    "Le réseau de Purkinje"
  ];

  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = option;

    button.addEventListener("click", () => {
      document.querySelectorAll(".quiz-option").forEach(element => {
        element.disabled = true;
      });

      button.classList.add(index === 0 ? "correct" : "wrong");

      $("#quizFeedback").textContent =
        index === 0
          ? "Bonne réponse. Le nœud sinusal est le pacemaker physiologique dominant."
          : "Pas tout à fait. La bonne réponse est le nœud sinusal.";
    });

    $("#quizOptions").appendChild(button);
  });
}

/* -----------------------------------------------------
   14. PROFIL LOCAL
----------------------------------------------------- */

function renderProfile() {
  preparePage(
    "Mon espace",
    "ATLAS MÉDICAL BY @WREDOU",
    "Profil local"
  );

  $("#moduleGrid").innerHTML = `
    <div style="grid-column:1/-1;background:#f0f8f7;border:1px solid #dcefeb;border-radius:16px;padding:20px">
      <div style="font-size:26px">◉</div>
      <h3 style="font:800 18px Manrope">Bienvenue dans ton atlas</h3>
      <p style="font-size:12px;color:#718293;line-height:1.6">
        Tu peux commencer sans créer de compte. Tes favoris et ta progression sont conservés sur cet appareil.
      </p>
      <button class="secondary-btn" id="clearData">
        Réinitialiser mes favoris et ma progression
      </button>
    </div>
  `;

  $("#clearData").addEventListener("click", () => {
    if (confirm("Effacer les favoris et la progression enregistrés sur cet appareil ?")) {
      try {
        localStorage.removeItem("atlas-favorites");
        localStorage.removeItem("atlas-viewed-chapters");

        saved.clear();
        viewedChapters.clear();

        updateProgress();
        toast("Données locales réinitialisées");
      } catch (error) {
        toast("Impossible de réinitialiser les données.");
      }
    }
  });
}

/* -----------------------------------------------------
   15. NAVIGATION PRINCIPALE
----------------------------------------------------- */

function setPage(page) {
  currentPage = page;

  const activeTab =
    ["quiz", "saved", "profile", "scores"].includes(page)
      ? "more"
      : page;

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === activeTab
    );
  });

  if (page === "home" || page === "atlas") {
    $(".hero").style.display =
      page === "home" ? "block" : "none";

    $(".study-card").style.display =
      page === "home" ? "flex" : "none";

    $(".search-box").style.display = "flex";

    $(".section-head h2").textContent =
      page === "atlas" ? "Atlas cardiovasculaire" : "Les modules";

    $(".section-head .eyebrow").textContent =
      page === "atlas"
        ? "PARCOURS CARDIOVASCULAIRE"
        : "COMMENCER À EXPLORER";

    $("#searchInput").placeholder =
      page === "atlas"
        ? "Rechercher dans l’atlas…"
        : "Rechercher un cours, un syndrome, un ECG…";

    $("#searchInput").value = "";

    renderModules();
  }

  else if (page === "calculators" || page === "news") {
    renderExternalSection(page);
  }

  else if (page === "scores") {
    renderScores();
  }

  else if (page === "more") {
    renderMore();
  }

  else if (page === "saved") {
    preparePage(
      "Mes favoris",
      "CONTENUS ENREGISTRÉS",
      "Favoris"
    );

    renderModules(
      modules.filter(module => saved.has(module.id))
    );
  }

  else if (page === "quiz") {
    renderQuiz();
  }

  else if (page === "profile") {
    renderProfile();
  }
}

/* -----------------------------------------------------
   16. RECHERCHE DANS LES MODULES ET CHAPITRES
----------------------------------------------------- */

$("#searchInput").addEventListener("input", event => {
  if (currentPage !== "home" && currentPage !== "atlas") {
    return;
  }

  const query = event.target.value.toLocaleLowerCase("fr");

  const filtered = modules.filter(module => {
    const chapterText = (module.chapters || [])
      .map(chapter => {
        const sections = (chapter.sections || [])
          .map(section =>
            `${section.heading} ${section.content}`
          )
          .join(" ");

        return `${chapter.title} ${sections}`;
      })
      .join(" ");

    const searchableText = [
      module.title,
      module.desc,
      module.detail,
      chapterText
    ].join(" ").toLocaleLowerCase("fr");

    return searchableText.includes(query);
  });

  renderModules(filtered);
});

/* -----------------------------------------------------
   17. ÉVÉNEMENTS DE NAVIGATION
----------------------------------------------------- */

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    setPage(button.dataset.page);
  });
});

/* -----------------------------------------------------
   18. FERMETURE DES FENÊTRES
----------------------------------------------------- */

$("#closeDialog").addEventListener("click", () => {
  $("#moduleDialog").close();
});

$("#moduleDialog").addEventListener("click", event => {
  if (event.target === $("#moduleDialog")) {
    $("#moduleDialog").close();
  }
});

/* -----------------------------------------------------
   19. INSTALLATION DE L'APPLICATION
----------------------------------------------------- */

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredPrompt = event;
  $("#installBtn").hidden = false;
});

$("#installBtn").addEventListener("click", async () => {
  if (!deferredPrompt) {
    toast("Sur iPhone : Safari → Partager → Sur l’écran d’accueil.");
    return;
  }

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;

  deferredPrompt = null;
  $("#installBtn").hidden = true;
});

/* -----------------------------------------------------
   20. SERVICE WORKER
----------------------------------------------------- */

if (
  "serviceWorker" in navigator &&
  location.protocol.startsWith("http")
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch(() => {
        toast("Installation hors ligne indisponible pour le moment.");
      });
  });
}

/* -----------------------------------------------------
   21. INITIALISATION
----------------------------------------------------- */

updateProgress();
setPage("home");

console.log("Atlas Médical : application initialisée.");
console.log("Modules cardiovasculaires :", modules.length);
