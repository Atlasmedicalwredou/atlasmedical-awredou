
/* ==========================================
   ATLAS MÉDICAL BY @WREDOU
   Navigation et fonctionnement principal
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
    detail: "Entraîne-toi avec des questions et des cas cliniques. Les contenus finaux seront relus et référencés."
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

  $("#moduleCount").textContent =
    String(list.length).padStart(2, "0") + " modules";

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
   GESTION DE L'AFFICHAGE
========================================== */

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

/* ==========================================
   PAGE PLUS
========================================== */

function renderMore() {
  preparePage("Plus", "OUTILS ET ESPACE PERSONNEL", "3 rubriques");

  const grid = $("#moduleGrid");
  grid.replaceChildren();

  const items = [
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

/* ==========================================
   CALCULATRICES ET ACTUALITÉS
========================================== */

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

/* ==========================================
   QCM
========================================== */

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

/* ==========================================
   PROFIL LOCAL
========================================== */

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
        Tu peux commencer sans créer de compte. Tes favoris sont conservés sur cet appareil. La synchronisation entre appareils et l’espace Premium seront ajoutés dans une prochaine version.
      </p>
      <button class="secondary-btn" id="clearData">
        Réinitialiser mes favoris
      </button>
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
   NAVIGATION PRINCIPALE
========================================== */

function setPage(page) {
  currentPage = page;

  const activeTab =
    ["quiz", "saved", "profile"].includes(page)
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

/* ==========================================
   RECHERCHE
========================================== */

$("#searchInput").addEventListener("input", event => {
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
   ÉVÉNEMENTS DE NAVIGATION
========================================== */

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    setPage(button.dataset.page);
  });
});

/* ==========================================
   FERMETURE DU MODULE
========================================== */

$("#closeDialog").addEventListener("click", () => {
  $("#moduleDialog").close();
});

$("#moduleDialog").addEventListener("click", event => {
  if (event.target === $("#moduleDialog")) {
    $("#moduleDialog").close();
  }
});

/* ==========================================
   INSTALLATION DE L'APPLICATION
========================================== */

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
