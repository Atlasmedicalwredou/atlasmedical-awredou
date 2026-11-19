
/* ==========================================
   ATLAS MÉDICAL BY @WREDOU
   Navigation — Interface Liquid Glass
   Version 2.0
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
  $("#dialogTag").textContent = "ATLAS CARDIOVASCULAIRE";

  const content = $("#dialogContent");
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

  $("#moduleDialog").showModal();
}

/* ==========================================
   STRUCTURE DES PAGES
========================================== */

function showElement(selector, visible) {
  const element = $(selector);
  if (element) {
    element.style.display = visible ? "" : "none";
  }
}

function preparePage(title, subtitle, count) {
  const heading = $(".modules-section .section-head h2");
  const eyebrow = $(".modules-section .section-head .eyebrow");
  const grid = $("#moduleGrid");

  if (heading) heading.textContent = title;
  if (eyebrow) eyebrow.textContent = subtitle;
  if ($("#moduleCount")) $("#moduleCount").textContent = count;
  if (grid) grid.style.display = "grid";
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

function showMainSections(options = {}) {
  showElement(".hero", !!options.hero);
  showElement(".quick-section", !!options.quick);
  showElement(".study-card", !!options.study);
  showElement(".modules-section", !!options.modules);
  showElement("#bibliotheque-pdf", !!options.library);
}

/* ==========================================
   PAGE PLUS
========================================== */

function renderMore() {
  showMainSections({ modules: true });
  preparePage(
    "Plus",
    "TOUS TES OUTILS",
    "8 rubriques"
  );

  const items = [
    {
      icon: "∑",
      title: "Calculatrices médicales",
      description: "Outils de calcul clinique",
      page: "calculators"
    },
    {
      icon: "▣",
      title: "Actualités médicales",
      description: "Informations et actualités",
      page: "news"
    },
    {
      icon: "◎",
      title: "Scores médicaux",
      description: "Scores et classifications",
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
      icon: "♙",
      title: "Mon espace étudiant",
      description: "Cours, PDF, notes et enregistrements",
      page: "student"
    },
    {
      icon: "◉",
      title: "Mon profil",
      description: "Paramètres de ton espace",
      page: "profile"
    },
    {
      icon: "▤",
      title: "Mes notes",
      description: "Retrouve ton espace de travail",
      page: "student"
    }
  ];

  const grid = $("#moduleGrid");
  grid.replaceChildren();

  items.forEach(item => {
    const button = document.createElement("button");
    button.className = "module-card";
    button.type = "button";

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

/* ==========================================
   CALCULATRICES ET ACTUALITÉS
========================================== */

function renderExternalSection(type) {
  const isCalculator = type === "calculators";

  showMainSections({ modules: true });

  preparePage(
    isCalculator ? "Calculatrices médicales" : "Actualités médicales",
    isCalculator ? "OUTILS DE CALCUL CLINIQUE" : "ACTUALITÉS MÉDICALES",
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
   QCM
========================================== */

function renderQuiz() {
  showMainSections({ modules: true });

  preparePage(
    "Entraînement",
    "TESTE TES CONNAISSANCES",
    "QCM"
  );

  const grid = $("#moduleGrid");

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

      button.classList.add(index === 0 ? "correct" : "wrong");

      $("#quizFeedback").textContent =
        index === 0
          ? "Bonne réponse. Le nœud sinusal est le pacemaker physiologique dominant."
          : "Pas tout à fait. La bonne réponse est le nœud sinusal.";
    });

    $("#quizOptions").appendChild(button);
  });
}

/* ==========================================
   PROFIL ET PARAMÈTRES
========================================== */

function renderProfile() {
  showMainSections({ modules: true });

  preparePage(
    "Paramètres",
    "ATLAS MÉDICAL BY @WREDOU",
    "Profil local"
  );

  const grid = $("#moduleGrid");

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
        Attention : cette action efface uniquement les favoris,
        pas les documents de ton espace étudiant.
      </p>
    </div>
  `;

  $("#clearData").addEventListener("click", () => {
    if (confirm("Effacer tous les favoris enregistrés sur cet appareil ?")) {
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
   STATISTIQUES
========================================== */

function renderStats() {
  showMainSections({ study: true, modules: true });

  preparePage(
    "Statistiques",
    "TON PARCOURS D'APPRENTISSAGE",
    "Bilan"
  );

  const grid = $("#moduleGrid");
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
    "Mon espace étudiant",
    "ESPACE PERSONNEL LOCAL",
    "Mes outils"
  );

  const grid = $("#moduleGrid");

  if (
    window.AtlasStudentSpace &&
    typeof window.AtlasStudentSpace.render === "function"
  ) {
    window.AtlasStudentSpace.render(grid, { toast });
  } else {
    showPlaceholder(
      "Espace étudiant indisponible",
      "Vérifie que student-db.js et student-space.js sont chargés."
    );
  }
}

/* ==========================================
   NAVIGATION
========================================== */

function setPage(page) {
  currentPage = page;

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === page ||
      (page === "profile" && button.dataset.page === "more")
    );
  });

  const searchInput = $("#searchInput");
  if (searchInput) searchInput.value = "";

  if (page === "home") {
    showMainSections({
      hero: true,
      quick: true,
      study: true,
      modules: true
    });

    preparePage(
      "Les modules",
      "COMMENCER À EXPLORER",
      "08 modules"
    );

    renderModules();
  }

  else if (page === "atlas") {
    showMainSections({
      modules: true,
      library: true
    });

    preparePage(
      "Atlas cardiovasculaire",
      "PARCOURS ET RESSOURCES",
      "08 modules"
    );

    renderModules();
  }

  else if (page === "stats") {
    renderStats();
  }

  else if (page === "more") {
    renderMore();
  }

  else if (page === "calculators" || page === "news") {
    renderExternalSection(page);
  }

  else if (page === "scores") {
    renderScores();
  }

  else if (page === "saved") {
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

  else if (page === "quiz") {
    renderQuiz();
  }

  else if (page === "profile") {
    renderProfile();
  }

  else if (page === "student") {
    renderStudent();
  }

  else if (page === "atlas3d") {
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

  else {
    setPage("home");
  }

  if (page !== "home" && page !== "atlas") {
    showElement(".search-box", false);
  } else {
    showElement(".search-box", true);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================
   RACCOURCIS DE L'ACCUEIL
========================================== */

document.querySelectorAll("[data-shortcut]").forEach(button => {
  button.addEventListener("click", () => {
    const shortcut = button.dataset.shortcut;

    const destinations = {
      atlas: "atlas",
      quiz: "quiz",
      saved: "saved",
      atlas3d: "atlas3d",
      notes: "student",
      student: "student"
    };

    if (shortcut === "search") {
      setPage("atlas");

      setTimeout(() => {
        $("#searchInput")?.focus();
      }, 100);

      return;
    }

    setPage(destinations[shortcut] || "more");
  });
});

/* ==========================================
   RECHERCHE
========================================== */

$("#searchInput")?.addEventListener("input", event => {
  if (currentPage !== "home" && currentPage !== "atlas") {
    return;
  }

  const query = event.target.value.toLocaleLowerCase("fr");

  renderModules(
    modules.filter(module =>
      (
        module.title + " " +
        module.desc + " " +
        module.topics.join(" ")
      ).toLocaleLowerCase("fr").includes(query)
    )
  );
});

/* ==========================================
   BOUTONS DE NAVIGATION
========================================== */

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    setPage(button.dataset.page);
  });
});

/* ==========================================
   FERMETURE DU MODULE
========================================== */

$("#closeDialog")?.addEventListener("click", () => {
  $("#moduleDialog").close();
});

$("#moduleDialog")?.addEventListener("click", event => {
  if (event.target === $("#moduleDialog")) {
    $("#moduleDialog").close();
  }
});

/* ==========================================
   INSTALLATION
========================================== */

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredPrompt = event;

  const button = $("#installBtn");
  if (button) button.hidden = false;
});

$("#installBtn")?.addEventListener("click", async () => {
  if (!deferredPrompt) {
    toast("Sur iPhone : Safari → Partager → Sur l’écran d’accueil.");
    return;
  }

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;

  deferredPrompt = null;
  $("#installBtn").hidden = true;
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
      .catch(() => {
        toast("Installation hors ligne indisponible pour le moment.");
      });
  });
}

/* ==========================================
   INITIALISATION
========================================== */

setPage("home");
