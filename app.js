
/* ==========================================
   ATLAS MÉDICAL BY @WREDOU
   Navigation — Organisation générale
   Version 5.0
   Réparation de l'affichage et des fenêtres
========================================== */

"use strict";

/* ==========================================
   MODULES CARDIOVASCULAIRES
========================================== */

const modules = [
  {
    id: "anatomie",
    title: "Anatomie cardiovasculaire",
    desc: "Cœur, vaisseaux et circulation",
    icon: "♥",
    tone: "#e0f5f1",
    topics: [
      "Organisation générale du système cardiovasculaire",
      "Anatomie externe du cœur",
      "Cavités et valves cardiaques",
      "Vascularisation coronaire",
      "Circulation systémique et pulmonaire"
    ],
    detail: "Découvre l’organisation du cœur et des vaisseaux, les rapports anatomiques et les bases de la circulation."
  },
  {
    id: "syndromes",
    title: "Syndromes et triades",
    desc: "Tableaux cliniques et associations",
    icon: "✚",
    tone: "#e9eef9",
    topics: [
      "Syndrome coronarien aigu",
      "Insuffisance cardiaque",
      "Syndrome d’insuffisance artérielle périphérique",
      "Péricardite aiguë",
      "Thrombose veineuse profonde"
    ],
    detail: "Des fiches structurées pour reconnaître les tableaux cliniques, leurs signes et leurs diagnostics différentiels."
  },
  {
    id: "semiologie",
    title: "Sémiologie cardiovasculaire",
    desc: "Signes, examens et manœuvres",
    icon: "⌁",
    tone: "#fff1df",
    topics: [
      "Interrogatoire cardiovasculaire",
      "Inspection et palpation",
      "Auscultation cardiaque",
      "Mesure de la pression artérielle",
      "Recherche des signes d’insuffisance cardiaque"
    ],
    detail: "Révise la démarche d’examen clinique et la signification des principaux signes cardiovasculaires."
  },
  {
    id: "bilans",
    title: "Bilans cardiovasculaires",
    desc: "Biologie et explorations",
    icon: "▤",
    tone: "#f0eafa",
    topics: [
      "NFS et bilan biologique initial",
      "Troponines : indications et limites",
      "BNP et NT-proBNP",
      "Ionogramme, fonction rénale",
      "Échocardiographie : indications"
    ],
    detail: "Comprends les examens complémentaires, leurs indications et les précautions d’interprétation."
  },
  {
    id: "ecg",
    title: "Interprétation ECG",
    desc: "Méthode de lecture des tracés",
    icon: "⌁",
    tone: "#fce9ec",
    topics: [
      "Vérifier calibration et qualité du tracé",
      "Fréquence et rythme",
      "Axe électrique",
      "Intervalles PR, QRS et QT",
      "Analyse du segment ST et de l’onde T"
    ],
    detail: "Une méthode systématique de lecture ECG, avec des exemples commentés à ajouter et valider."
  },
  {
    id: "urgences",
    title: "Urgences cardiovasculaires",
    desc: "Repères et conduite initiale",
    icon: "⚡",
    tone: "#fff4d9",
    topics: [
      "Évaluation initiale ABCDE",
      "Douleur thoracique aiguë",
      "Arrêt cardiaque : principes de réanimation",
      "Œdème aigu pulmonaire",
      "Choc : reconnaissance initiale"
    ],
    detail: "Des repères pédagogiques à confronter systématiquement aux protocoles locaux et recommandations en vigueur."
  },
  {
    id: "classifications",
    title: "Classifications et mémos",
    desc: "Scores et points essentiels",
    icon: "◎",
    tone: "#e8f1fa",
    topics: [
      "NYHA : classe fonctionnelle",
      "Classification de Killip",
      "Stades de l’insuffisance cardiaque",
      "Facteurs de risque cardiovasculaire",
      "Mémos de révision"
    ],
    detail: "Retrouve les classifications, scores et moyens mnémotechniques utiles aux révisions."
  },
  {
    id: "entrainement",
    title: "QCM et cas cliniques",
    desc: "S’entraîner et s’autoévaluer",
    icon: "☑",
    tone: "#e9f5e8",
    topics: [
      "QCM de connaissances fondamentales",
      "Cas cliniques progressifs",
      "Correction expliquée",
      "Révision des erreurs"
    ],
    detail: "Entraîne-toi avec des questions et des cas cliniques."
  }
];

/* ==========================================
   VARIABLES GÉNÉRALES
========================================== */

const $ = selector => document.querySelector(selector);

let saved = new Set();
let currentPage = "home";
let deferredPrompt = null;

/* ==========================================
   FAVORIS
========================================== */

try {
  const favorites = JSON.parse(
    localStorage.getItem("atlas-favorites") || "[]"
  );

  if (Array.isArray(favorites)) {
    saved = new Set(
      favorites.filter(id =>
        typeof id === "string" &&
        modules.some(module => module.id === id)
      )
    );
  }
} catch (error) {
  saved = new Set();
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

/* ==========================================
   NOTIFICATIONS
========================================== */

function toast(message) {
  const element = $("#toast");

  if (!element) return;

  element.textContent = message;
  element.classList.add("show");

  setTimeout(() => {
    element.classList.remove("show");
  }, 2100);
}

/* ==========================================
   AFFICHAGE ET MASQUAGE
   Compatible avec l'attribut HTML hidden
========================================== */

function showElement(selector, visible) {
  document.querySelectorAll(selector).forEach(element => {
    element.hidden = !visible;
    element.style.display = visible ? "" : "none";
  });
}

/* ==========================================
   STRUCTURE DES PAGES
========================================== */

function showMainSections(options = {}) {
  const isLibrary = !!options.library;
  const isDynamic = !!options.modules && !isLibrary;
  const isHome = !isLibrary && !isDynamic;

  showElement("#homePage", isHome);
  showElement("#dynamicPage", isDynamic);
  showElement("#bibliotheque-pdf", isLibrary);
}

/* ==========================================
   PRÉPARATION DES PAGES
========================================== */

function preparePage(title, subtitle, count) {
  showElement("#homePage", false);
  showElement("#bibliotheque-pdf", false);
  showElement("#dynamicPage", true);

  const heading = $("#pageTitle");

  if (heading) {
    heading.textContent = title;
  }

  const eyebrow = $(".dynamic-page .eyebrow");

  if (eyebrow && subtitle) {
    eyebrow.textContent = subtitle;
  }

  const moduleCount = $("#moduleCount");

  if (moduleCount) {
    moduleCount.textContent = count;
  }
}

function showPlaceholder(title, description) {
  const grid = $("#moduleGrid");

  if (!grid) return;

  grid.replaceChildren();

  const card = document.createElement("div");

  card.className = "module-card";
  card.style.gridColumn = "1 / -1";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = description;

  card.append(heading, paragraph);

  grid.appendChild(card);
}

/* ==========================================
   AFFICHAGE DES MODULES
========================================== */

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
    button.type = "button";

    const icon = document.createElement("span");

    icon.className = "module-icon";
    icon.style.backgroundColor = module.tone;
    icon.textContent = module.icon;

    const title = document.createElement("strong");
    title.textContent = module.title;

    const description = document.createElement("small");
    description.textContent = module.desc;

    button.append(icon, title, description);

    button.addEventListener("click", () => {
      openModule(module);
    });

    grid.appendChild(button);
  });
}

/* ==========================================
   OUVERTURE D'UN MODULE
========================================== */

function openModule(module) {
  const dialog = $("#moduleDialog");

  const content =
    $("#moduleDialogBody") ||
    $("#dialogContent");

  const tag = $("#dialogTag");

  if (!content || !dialog) return;

  if (tag) {
    tag.textContent = "ATLAS CARDIOVASCULAIRE";
  }

  content.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = module.title;

  const description = document.createElement("p");
  description.textContent = module.detail;

  const list = document.createElement("ul");
  list.className = "content-list";

  module.topics.forEach(topic => {
    const item = document.createElement("li");
    item.textContent = topic;
    list.appendChild(item);
  });

  const favoriteButton = document.createElement("button");

  favoriteButton.className = "primary-btn";
  favoriteButton.type = "button";

  function updateFavoriteButton() {
    favoriteButton.textContent = saved.has(module.id)
      ? "★ Retirer des favoris"
      : "☆ Ajouter aux favoris";
  }

  updateFavoriteButton();

  favoriteButton.addEventListener("click", () => {
    const nextSaved = new Set(saved);

    if (nextSaved.has(module.id)) {
      nextSaved.delete(module.id);
    } else {
      nextSaved.add(module.id);
    }

    if (!saveFavorites(nextSaved)) return;

    saved = nextSaved;

    updateFavoriteButton();

    toast(
      saved.has(module.id)
        ? "Ajouté aux favoris"
        : "Retiré des favoris"
    );
  });

  const note = document.createElement("p");

  note.className = "small-note";
  note.textContent =
    "Version prototype : les fiches détaillées devront être rédigées, sourcées et validées avant diffusion.";

  content.append(
    title,
    description,
    list,
    favoriteButton,
    note
  );

  /* Le conteneur HTML actuel est un div, pas un dialog natif. */

  dialog.hidden = false;
  dialog.style.display = "";
  dialog.setAttribute("open", "");
  dialog.setAttribute("aria-hidden", "false");
  dialog.classList.add("open");
}

/* ==========================================
   FERMETURE DU MODULE
========================================== */

function closeModuleDialog() {
  const dialog = $("#moduleDialog");

  if (!dialog) return;

  dialog.classList.remove("open");
  dialog.removeAttribute("open");
  dialog.setAttribute("aria-hidden", "true");
  dialog.hidden = true;
  dialog.style.display = "none";
}

$("#closeModuleDialog")?.addEventListener(
  "click",
  closeModuleDialog
);

$("#closeDialog")?.addEventListener(
  "click",
  closeModuleDialog
);

$("#moduleDialog")?.addEventListener("click", event => {
  if (event.target === $("#moduleDialog")) {
    closeModuleDialog();
  }
});

/* ==========================================
   OUTILS MÉDICAUX
========================================== */

function renderTools() {
  showMainSections({ modules: true });

  preparePage(
    "Outils médicaux",
    "CALCULER · ÉVALUER · S'INFORMER",
    "03 rubriques"
  );

  const grid = $("#moduleGrid");

  if (!grid) return;

  grid.replaceChildren();

  const tools = [
    {
      icon: "∑",
      title: "Calculatrices médicales",
      description: "Calculatrices et outils cliniques",
      page: "calculators"
    },
    {
      icon: "◎",
      title: "Scores médicaux",
      description: "Scores et classifications",
      page: "scores"
    },
    {
      icon: "▣",
      title: "Actualités médicales",
      description: "Informations et nouveautés",
      page: "news"
    }
  ];

  tools.forEach(item => {
    const button = document.createElement("button");

    button.className = "module-card";
    button.type = "button";

    const icon = document.createElement("span");

    icon.className = "module-icon";
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

/* ==========================================
   CALCULATRICES ET ACTUALITÉS
========================================== */

function renderExternalSection(type) {
  const isCalculator = type === "calculators";

  showMainSections({ modules: true });

  preparePage(
    isCalculator
      ? "Calculatrices médicales"
      : "Actualités médicales",
    isCalculator
      ? "OUTILS DE CALCUL CLINIQUE"
      : "INFORMATIONS MÉDICALES",
    isCalculator ? "Calculs" : "Actualités"
  );

  const grid = $("#moduleGrid");

  if (!grid) return;

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
      console.error("Erreur de chargement :", error);
    }
  }

  showPlaceholder(
    isCalculator
      ? "Calculatrices en préparation"
      : "Actualités médicales en préparation",
    isCalculator
      ? "Les calculatrices seront progressivement intégrées."
      : "Cette rubrique accueillera les actualités médicales provenant de sources fiables."
  );
}

/* ==========================================
   SCORES MÉDICAUX
========================================== */

function renderScores() {
  showMainSections({ modules: true });

  preparePage(
    "Scores médicaux",
    "OUTILS D'ÉVALUATION CLINIQUE",
    "Bibliothèque"
  );

  const grid = $("#moduleGrid");

  if (!grid) return;

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
    "Vérifie que le fichier scores.js est bien chargé."
  );
}

/* ==========================================
   QUIZ
========================================== */

function renderQuiz() {
  showMainSections({ modules: true });

  preparePage(
    "Quiz et entraînement",
    "TESTE TES CONNAISSANCES",
    "QCM"
  );

  const grid = $("#moduleGrid");

  if (!grid) return;

  grid.innerHTML = `
    <div class="quiz-card"
      style="grid-column:1/-1;padding:18px;border-radius:18px">
      <p class="eyebrow">QUESTION D’EXEMPLE</p>
      <h3>
        Quel est le pacemaker physiologique principal du cœur ?
      </h3>
      <div id="quizOptions"></div>
      <p id="quizFeedback" aria-live="polite"></p>
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
    button.type = "button";
    button.textContent = option;

    button.addEventListener("click", () => {
      document.querySelectorAll(".quiz-option").forEach(element => {
        element.disabled = true;
      });

      button.classList.add(
        index === 0 ? "correct" : "wrong"
      );

      const feedback = $("#quizFeedback");

      if (feedback) {
        feedback.textContent =
          index === 0
            ? "Bonne réponse. Le nœud sinusal est le pacemaker physiologique dominant."
            : "Pas tout à fait. La bonne réponse est le nœud sinusal.";
      }
    });

    $("#quizOptions").appendChild(button);
  });
}

/* ==========================================
   RÉVISIONS
========================================== */

function renderRevisions() {
  showMainSections({ modules: true });

  preparePage(
    "Révisions",
    "REPRENDS TES COURS",
    "08 modules"
  );

  renderModules();
}

/* ==========================================
   FAVORIS
========================================== */

function renderFavorites() {
  showMainSections({ modules: true });

  preparePage(
    "Mes favoris",
    "CONTENUS ENREGISTRÉS",
    "Favoris"
  );

  renderModules(
    modules.filter(module => saved.has(module.id))
  );
}

/* ==========================================
   PROFIL
========================================== */

function renderProfile() {
  showMainSections({ modules: true });

  preparePage(
    "Mon profil",
    "ATLAS MÉDICAL BY @WREDOU",
    "Profil local"
  );

  const grid = $("#moduleGrid");

  if (!grid) return;

  grid.innerHTML = `
    <div class="module-card" style="grid-column:1/-1">
      <div class="module-icon">◉</div>
      <h3>Bienvenue dans ton Atlas</h3>
      <p>
        Tu peux utiliser Atlas Médical sans créer de compte.
        Tes favoris sont conservés sur cet appareil.
      </p>
      <button class="secondary-btn" id="clearData" type="button">
        Réinitialiser mes favoris
      </button>
      <p class="small-note">
        Cette action efface uniquement les favoris,
        pas les documents de ton espace étudiant.
      </p>
    </div>
  `;

  $("#clearData")?.addEventListener("click", () => {
    if (
      confirm(
        "Effacer tous les favoris enregistrés sur cet appareil ?"
      )
    ) {
      try {
        localStorage.removeItem("atlas-favorites");

        saved.clear();

        toast("Favoris effacés");
      } catch (error) {
        toast("Impossible d'effacer les favoris.");
      }
    }
  });
}

/* ==========================================
   PARAMÈTRES
========================================== */

function renderSettings() {
  showMainSections({ modules: true });

  preparePage(
    "Paramètres",
    "PERSONNALISE TON ATLAS",
    "Configuration"
  );

  const grid = $("#moduleGrid");

  if (!grid) return;

  grid.replaceChildren();

  const profile = document.createElement("button");

  profile.type = "button";
  profile.className = "module-card";
  profile.style.gridColumn = "1 / -1";

  const icon = document.createElement("span");

  icon.className = "module-icon";
  icon.textContent = "◉";

  const title = document.createElement("strong");
  title.textContent = "Mon profil";

  const description = document.createElement("small");

  description.textContent =
    "Informations et préférences personnelles";

  profile.append(icon, title, description);

  profile.addEventListener("click", () => {
    setPage("profile");
  });

  grid.appendChild(profile);
}

/* ==========================================
   STATISTIQUES
========================================== */

function renderStats() {
  showMainSections({ modules: true });

  preparePage(
    "Statistiques",
    "TON PARCOURS D'APPRENTISSAGE",
    "Bilan"
  );

  const grid = $("#moduleGrid");

  if (!grid) return;

  grid.replaceChildren();

  const favoriteCard = document.createElement("div");

  favoriteCard.className = "module-card";

  const favoriteIcon = document.createElement("span");

  favoriteIcon.className = "module-icon";
  favoriteIcon.textContent = "★";

  const favoriteTitle = document.createElement("strong");
  favoriteTitle.textContent = "Modules favoris";

  const favoriteValue = document.createElement("p");
  favoriteValue.textContent = String(saved.size);

  favoriteCard.append(
    favoriteIcon,
    favoriteTitle,
    favoriteValue
  );

  const totalCard = document.createElement("div");

  totalCard.className = "module-card";

  const totalIcon = document.createElement("span");

  totalIcon.className = "module-icon";
  totalIcon.textContent = "▤";

  const totalTitle = document.createElement("strong");
  totalTitle.textContent = "Modules disponibles";

  const totalValue = document.createElement("p");
  totalValue.textContent = String(modules.length);

  totalCard.append(
    totalIcon,
    totalTitle,
    totalValue
  );

  grid.append(favoriteCard, totalCard);

  const note = document.createElement("p");

  note.className = "small-note";

  note.textContent =
    "Les statistiques détaillées de progression seront ajoutées progressivement.";

  grid.appendChild(note);
}

/* ==========================================
   ESPACE ÉTUDIANT
========================================== */

function renderStudent() {
  showMainSections({ modules: true });

  preparePage(
    "Espace étudiant",
    "TON ESPACE PERSONNEL",
    "Mes outils"
  );

  const grid = $("#moduleGrid");

  if (!grid) return;

  grid.replaceChildren();

  if (
    window.AtlasStudentSpace &&
    typeof window.AtlasStudentSpace.render === "function"
  ) {
    try {
      window.AtlasStudentSpace.render(grid, { toast });
    } catch (error) {
      console.error("Erreur espace étudiant :", error);

      showPlaceholder(
        "Espace étudiant indisponible",
        "Une erreur est survenue lors du chargement de ton espace."
      );
    }
  } else {
    showPlaceholder(
      "Espace étudiant indisponible",
      "Vérifie que student-db.js et student-space.js sont chargés."
    );
  }
}

/* ==========================================
   ATLAS 3D
========================================== */

function renderAtlas3D() {
  showMainSections({ modules: true });

  preparePage(
    "Atlas 3D",
    "EXPLORATION ANATOMIQUE",
    "À venir"
  );

  showPlaceholder(
    "Atlas 3D en préparation",
    "L'exploration anatomique en trois dimensions sera intégrée dans une prochaine étape."
  );
}

/* ==========================================
   BIBLIOTHÈQUE PDF
========================================== */

function renderLibrary() {
  showMainSections({ library: true });

  const heading = $("#bibliotheque-pdf .section-title h2");

  if (heading) {
    heading.textContent = "Bibliothèque PDF";
  }

  showElement("#dynamicPage", false);
  showElement("#homePage", false);
  showElement("#bibliotheque-pdf", true);
}

/* ==========================================
   NAVIGATION INFÉRIEURE
========================================== */

function updateNavigation(page) {
  let activePage = page;

  if (page === "library") {
    activePage = "atlas";
  } else if (
    [
      "courses",
      "calculators",
      "scores",
      "news",
      "quiz",
      "saved",
      "revisions",
      "student",
      "profile",
      "tools",
      "atlas3d"
    ].includes(page)
  ) {
    activePage = "home";
  }

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === activePage
    );
  });
}

/* ==========================================
   NAVIGATION PRINCIPALE
========================================== */

function setPage(page) {
  currentPage = page;

  updateNavigation(page);

  const searchInput = $("#searchInput");

  if (searchInput) {
    searchInput.value = "";
  }

  closeModuleDialog();

  if (page === "home") {
    showMainSections({});

  } else if (page === "courses") {
    showMainSections({ modules: true });

    preparePage(
      "Cours",
      "LES 8 MODULES CARDIOVASCULAIRES",
      "08 modules"
    );

    renderModules();

  } else if (page === "library") {
    renderLibrary();

  } else if (page === "stats") {
    renderStats();

  } else if (page === "more") {
    renderSettings();

  } else if (page === "tools") {
    renderTools();

  } else if (
    page === "calculators" ||
    page === "news"
  ) {
    renderExternalSection(page);

  } else if (page === "scores") {
    renderScores();

  } else if (page === "saved") {
    renderFavorites();

  } else if (page === "revisions") {
    renderRevisions();

  } else if (page === "quiz") {
    renderQuiz();

  } else if (page === "profile") {
    renderProfile();

  } else if (page === "student") {
    renderStudent();

  } else if (page === "atlas3d") {
    renderAtlas3D();

  } else {
    setPage("home");
    return;
  }

  showElement(
    ".search-box",
    page === "courses"
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* ==========================================
   RACCOURCIS DE L'ACCUEIL
========================================== */

function configureQuickAccess() {
  const buttons = document.querySelectorAll("[data-shortcut]");

  buttons.forEach(button => {
    const destination = button.dataset.shortcut;

    const labelElement =
      button.querySelector(".quick-label");

    const visibleLabel = (
      labelElement?.textContent ||
      button.textContent ||
      ""
    ).trim().toLocaleLowerCase("fr");

    button.addEventListener("click", () => {
      if (destination === "search") {
        setPage("courses");

        setTimeout(() => {
          $("#searchInput")?.focus();
        }, 100);

        return;
      }

      if (destination === "atlas") {
        setPage("courses");
        return;
      }

      if (destination === "saved") {
        if (visibleLabel.includes("révision")) {
          setPage("revisions");
        } else {
          setPage("saved");
        }

        return;
      }

      if (destination === "tools") {
        setPage("tools");
        return;
      }

      if (destination === "profile") {
        setPage("profile");
        return;
      }

      if (destination === "student") {
        setPage("student");
        return;
      }

      if (destination) {
        setPage(destination);
      }
    });
  });
}

configureQuickAccess();

/* ==========================================
   ACCÈS AU PROFIL
========================================== */

document.querySelectorAll(
  "[data-profile], .profile-btn, .profile-button"
).forEach(button => {
  button.addEventListener("click", () => {
    setPage("profile");
  });
});

/* ==========================================
   RECHERCHE DES COURS
========================================== */

$("#searchInput")?.addEventListener("input", event => {
  if (currentPage !== "courses") {
    return;
  }

  const query = event.target.value
    .toLocaleLowerCase("fr")
    .trim();

  renderModules(
    modules.filter(module =>
      (
        module.title + " " +
        module.desc + " " +
        module.topics.join(" ")
      )
      .toLocaleLowerCase("fr")
      .includes(query)
    )
  );
});

/* ==========================================
   NAVIGATION INFÉRIEURE
========================================== */

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    const destination = button.dataset.page;

    if (destination === "atlas") {
      setPage("library");
      return;
    }

    setPage(destination || "home");
  });
});

/* Bouton Détails de la progression */

document.querySelectorAll(
  '[data-page]:not(.nav-item)'
).forEach(button => {
  button.addEventListener("click", () => {
    const destination = button.dataset.page;

    if (destination) {
      setPage(destination);
    }
  });
});

/* ==========================================
   OUVERTURE DE LA BIBLIOTHÈQUE PDF
========================================== */

$("#openPdfLibrary")?.addEventListener("click", () => {
  setPage("library");
});

/* ==========================================
   INSTALLATION
========================================== */

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();

  deferredPrompt = event;

  const button = $("#installBtn");

  if (button) {
    button.hidden = false;
  }
});

$("#installBtn")?.addEventListener("click", async () => {
  if (!deferredPrompt) {
    toast(
      "Sur iPhone : Safari → Partager → Sur l’écran d’accueil."
    );

    return;
  }

  deferredPrompt.prompt();

  await deferredPrompt.userChoice;

  deferredPrompt = null;

  const button = $("#installBtn");

  if (button) {
    button.hidden = true;
  }
});

/* ==========================================
   SERVICE WORKER
========================================== */

if (
  "serviceWorker" in navigator &&
  location.protocol.startsWith("http")
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch(error => {
        console.error(
          "Service Worker indisponible :",
          error
        );
      });
  });
}

/* ==========================================
   INITIALISATION
========================================== */

setPage("home");
