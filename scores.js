
/* ==========================================
   ATLAS MÉDICAL — SCORES CLINIQUES
   Bibliothèque organisée par spécialité
   Version initiale : fiches non activées
========================================== */

(function () {
  "use strict";

  const scores = [
    // URGENCES ET RÉANIMATION
    { id: "glasgow", name: "Score de Glasgow", specialty: "Urgences et réanimation", population: "Adulte et pédiatrie", purpose: "Évaluation du niveau de conscience" },
    { id: "news2", name: "NEWS2", specialty: "Urgences et réanimation", population: "Adulte", purpose: "Détection de la détérioration clinique" },
    { id: "qsofa", name: "qSOFA", specialty: "Urgences et réanimation", population: "Adulte", purpose: "Évaluation du risque en contexte infectieux" },
    { id: "sofa", name: "SOFA", specialty: "Urgences et réanimation", population: "Adulte", purpose: "Évaluation des défaillances d'organes" },
    { id: "apache2", name: "APACHE II", specialty: "Urgences et réanimation", population: "Adulte", purpose: "Évaluation de la gravité en réanimation" },

    // CARDIOLOGIE
    { id: "heart", name: "HEART", specialty: "Cardiologie", population: "Adulte", purpose: "Évaluation du risque cardiovasculaire en douleur thoracique" },
    { id: "grace", name: "GRACE", specialty: "Cardiologie", population: "Adulte", purpose: "Stratification du risque dans les syndromes coronariens aigus" },
    { id: "timi", name: "TIMI", specialty: "Cardiologie", population: "Adulte", purpose: "Évaluation du risque ischémique" },
    { id: "chadsvasc", name: "CHA₂DS₂-VASc", specialty: "Cardiologie", population: "Adulte", purpose: "Évaluation du risque thromboembolique en fibrillation atriale" },
    { id: "hasbled", name: "HAS-BLED", specialty: "Cardiologie", population: "Adulte", purpose: "Évaluation du risque hémorragique" },
    { id: "killip", name: "Classification de Killip", specialty: "Cardiologie", population: "Adulte", purpose: "Évaluation clinique de l'insuffisance cardiaque dans l'infarctus" },
    { id: "nyha", name: "Classification NYHA", specialty: "Cardiologie", population: "Adulte", purpose: "Évaluation fonctionnelle de l'insuffisance cardiaque" },

    // NEUROLOGIE
    { id: "nihss", name: "NIHSS", specialty: "Neurologie", population: "Adulte", purpose: "Quantification du déficit neurologique après AVC" },
    { id: "abcd2", name: "ABCD²", specialty: "Neurologie", population: "Adulte", purpose: "Évaluation du risque après AIT" },
    { id: "rankin", name: "Échelle de Rankin modifiée", specialty: "Neurologie", population: "Adulte", purpose: "Évaluation du handicap fonctionnel" },
    { id: "hunt-hess", name: "Hunt et Hess", specialty: "Neurologie", population: "Adulte", purpose: "Évaluation clinique de l'hémorragie sous-arachnoïdienne" },

    // PÉDIATRIE ET NÉONATOLOGIE
    { id: "apgar", name: "Score d'Apgar", specialty: "Pédiatrie et néonatologie", population: "Nouveau-né", purpose: "Évaluation de l'adaptation à la naissance" },
    { id: "silverman", name: "Silverman-Andersen", specialty: "Pédiatrie et néonatologie", population: "Nouveau-né", purpose: "Évaluation de la détresse respiratoire néonatale" },
    { id: "pews", name: "PEWS", specialty: "Pédiatrie et néonatologie", population: "Enfant", purpose: "Surveillance de la détérioration clinique pédiatrique" },
    { id: "westley", name: "Score de Westley", specialty: "Pédiatrie et néonatologie", population: "Enfant", purpose: "Évaluation de la gravité du croup" },

    // PNEUMOLOGIE
    { id: "curb65", name: "CURB-65", specialty: "Pneumologie", population: "Adulte", purpose: "Évaluation de la gravité d'une pneumonie communautaire" },
    { id: "crb65", name: "CRB-65", specialty: "Pneumologie", population: "Adulte", purpose: "Évaluation clinique de la pneumonie communautaire" },
    { id: "mmrc", name: "Échelle mMRC", specialty: "Pneumologie", population: "Adulte", purpose: "Évaluation de la dyspnée" },
    { id: "bode", name: "Index BODE", specialty: "Pneumologie", population: "Adulte", purpose: "Évaluation pronostique dans la BPCO" },

    // GASTRO-ENTÉROLOGIE
    { id: "child", name: "Child-Pugh", specialty: "Gastro-entérologie", population: "Adulte", purpose: "Évaluation de la fonction hépatique dans la cirrhose" },
    { id: "meld", name: "MELD-Na", specialty: "Gastro-entérologie", population: "Adulte", purpose: "Évaluation pronostique de la maladie hépatique" },
    { id: "glasgow-blatchford", name: "Glasgow-Blatchford", specialty: "Gastro-entérologie", population: "Adulte", purpose: "Évaluation du risque d'hémorragie digestive haute" },
    { id: "rockall", name: "Rockall", specialty: "Gastro-entérologie", population: "Adulte", purpose: "Évaluation du risque après hémorragie digestive haute" },
    { id: "alvarado", name: "Alvarado", specialty: "Gastro-entérologie", population: "Adulte et enfant", purpose: "Aide à l'évaluation d'une suspicion d'appendicite" },

    // NÉPHROLOGIE
    { id: "kdigo-ira", name: "Classification KDIGO de l'IRA", specialty: "Néphrologie", population: "Adulte et pédiatrie", purpose: "Classification de l'insuffisance rénale aiguë" },
    { id: "ckd-epi", name: "CKD-EPI", specialty: "Néphrologie", population: "Adulte", purpose: "Estimation du débit de filtration glomérulaire" },
    { id: "cockcroft", name: "Cockcroft-Gault", specialty: "Néphrologie", population: "Adulte", purpose: "Estimation de la clairance de la créatinine" },

    // GYNÉCOLOGIE-OBSTÉTRIQUE
    { id: "bishop", name: "Score de Bishop", specialty: "Gynécologie-obstétrique", population: "Femme enceinte", purpose: "Évaluation du col avant déclenchement du travail" },
    { id: "malinas", name: "Score de Malinas", specialty: "Gynécologie-obstétrique", population: "Femme enceinte", purpose: "Évaluation du risque d'accouchement imminent" },

    // INFECTIOLOGIE
    { id: "centor", name: "Centor / McIsaac", specialty: "Infectiologie", population: "Adulte et enfant", purpose: "Évaluation d'une angine à streptocoque" },

    // PSYCHIATRIE
    { id: "phq9", name: "PHQ-9", specialty: "Psychiatrie", population: "Adulte", purpose: "Dépistage et évaluation des symptômes dépressifs" },
    { id: "gad7", name: "GAD-7", specialty: "Psychiatrie", population: "Adulte", purpose: "Évaluation des symptômes anxieux" },

    // GÉRIATRIE
    { id: "katz", name: "Index de Katz", specialty: "Gériatrie", population: "Adulte âgé", purpose: "Évaluation de l'autonomie dans les activités quotidiennes" },
    { id: "isar", name: "ISAR", specialty: "Gériatrie", population: "Personne âgée", purpose: "Repérage des patients âgés à risque" },

    // ANESTHÉSIE
    { id: "asa", name: "Classification ASA", specialty: "Anesthésie et chirurgie", population: "Adulte et pédiatrie", purpose: "Classification de l'état physique préopératoire" }
  ];

  const categories = [
    "Toutes",
    "Urgences et réanimation",
    "Cardiologie",
    "Neurologie",
    "Pédiatrie et néonatologie",
    "Pneumologie",
    "Gastro-entérologie",
    "Néphrologie",
    "Gynécologie-obstétrique",
    "Infectiologie",
    "Psychiatrie",
    "Gériatrie",
    "Anesthésie et chirurgie"
  ];

  function createElement(tag, className, content) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (content !== undefined) {
      element.textContent = content;
    }

    return element;
  }

  function render(grid, options = {}) {
    if (!grid) return;

    const toast = options.toast || function () {};
    let selectedCategory = "Toutes";
    let searchTerm = "";

    grid.replaceChildren();

    const container = createElement("div", "scores-library");
    const heading = createElement("div", "scores-heading");

    heading.append(
      createElement("h2", "", "Scores médicaux"),
      createElement("p", "", "Scores et classifications cliniques par spécialité")
    );

    const search = createElement("input", "scores-search");
    search.type = "search";
    search.placeholder = "Rechercher un score ou une spécialité…";
    search.setAttribute("aria-label", "Rechercher un score");

    const filters = createElement("div", "scores-filters");
    const list = createElement("div", "scores-list");

    function renderFilters() {
      filters.replaceChildren();

      categories.forEach(category => {
        const button = createElement("button", "scores-filter", category);
        button.type = "button";

        if (category === selectedCategory) {
          button.classList.add("active");
        }

        button.addEventListener("click", () => {
          selectedCategory = category;
          renderFilters();
          renderList();
        });

        filters.appendChild(button);
      });
    }

    function renderList() {
      list.replaceChildren();

      const filtered = scores.filter(score => {
        const matchesCategory =
          selectedCategory === "Toutes" ||
          score.specialty === selectedCategory;
const searchable = (
  score.name + " " +
  score.specialty + " " +
  score.purpose + " " +
  score.population
)
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.toLowerCase();
        

        return matchesCategory &&
          searchable.includes(searchTerm.toLowerCase());
      });

      list.appendChild(
        createElement(
          "p",
          "scores-count",
          filtered.length + " score(s) trouvé(s)"
        )
      );

      if (filtered.length === 0) {
        list.appendChild(
          createElement("p", "scores-empty", "Aucun score trouvé.")
        );
        return;
      }

      filtered.forEach(score => {
        const card = createElement("article", "score-card");

        const title = createElement("h3", "", score.name);
        const specialty = createElement("p", "score-specialty", score.specialty);
        const purpose = createElement("p", "score-purpose", score.purpose);
        const population = createElement("span", "score-population", score.population);
        const status = createElement("span", "score-status", "Fiche en préparation");

        const info = createElement("div", "score-card-info");

        info.append(
          title,
          specialty,
          purpose,
          population,
          status
        );

        card.appendChild(info);

        
card.addEventListener("click", () => {
  if (score.id !== "glasgow") {
    toast(
      "Ce score sera activé après vérification de ses critères et références."
    );
    return;
  }

  const existing = card.querySelector(".score-details");

  if (existing) {
    existing.remove();
    return;
  }

  const details = createElement("div", "score-details");

  details.addEventListener("click", event => {
    event.stopPropagation();
  });

  const heading = createElement(
    "h4",
    "",
    "Calcul du score de Glasgow (GCS)"
  );

  const description = createElement(
    "p",
    "",
    "Sélectionnez la meilleure réponse observée pour chaque composante."
  );

  function createScoreSelect(labelText, choices) {
    const wrapper = createElement("div", "gcs-field");

    const label = createElement("label", "", labelText);
    const select = createElement("select", "gcs-select");

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choisir une réponse";
    select.appendChild(placeholder);

    choices.forEach(choice => {
      const option = document.createElement("option");
      option.value = choice[0];
      option.textContent = choice[1];
      select.appendChild(option);
    });

    wrapper.append(label, select);

    return { wrapper, select };
  }

  const eyes = createScoreSelect("E — Ouverture des yeux", [
    ["4", "4 — Spontanée"],
    ["3", "3 — À la demande verbale"],
    ["2", "2 — À la stimulation douloureuse"],
    ["1", "1 — Aucune"]
  ]);

  const verbal = createScoreSelect("V — Réponse verbale", [
    ["5", "5 — Orientée"],
    ["4", "4 — Confuse"],
    ["3", "3 — Mots inappropriés"],
    ["2", "2 — Sons incompréhensibles"],
    ["1", "1 — Aucune"]
  ]);

  const motor = createScoreSelect("M — Réponse motrice", [
    ["6", "6 — Obéit aux ordres"],
    ["5", "5 — Localise la douleur"],
    ["4", "4 — Évitement / retrait"],
    ["3", "3 — Flexion anormale"],
    ["2", "2 — Extension anormale"],
    ["1", "1 — Aucune"]
  ]);

  const result = createElement(
    "div",
    "gcs-result",
    "Sélectionnez les trois composantes pour obtenir le résultat."
  );

  function calculate() {
    const values = [
      eyes.select.value,
      verbal.select.value,
      motor.select.value
    ];

    if (values.some(value => value === "")) {
      result.textContent =
        "Veuillez sélectionner les trois composantes.";
      return;
    }

    const total = values.reduce(
      (sum, value) => sum + Number(value),
      0
    );

    let interpretation = "";


if (total === 15) {
  interpretation = "Score maximal : aucune altération détectée par le GCS";
} else if (total >= 13) {
  interpretation = "Altération légère de la conscience";
} else if (total >= 9) {
  interpretation = "Altération modérée de la conscience";
} else {
  interpretation = "Altération sévère de la conscience";
}


    result.textContent =
      "Score total : " + total + "/15 — " + interpretation;
  }

  [eyes, verbal, motor].forEach(field => {
    field.select.addEventListener("change", calculate);
  });

  details.append(
    heading,
    description,
    eyes.wrapper,
    verbal.wrapper,
    motor.wrapper,
    result
  );

  card.appendChild(details);
});


        list.appendChild(card);
      });
    }

    search.addEventListener("input", () => {
  searchTerm = search.value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  renderList();
});

    container.append(
      heading,
      search,
      filters,
      list
    );

    grid.appendChild(container);

    renderFilters();
    renderList();
  }

  window.ATLAS_SCORES = {
    render,
    getScores: () => scores.map(score => ({ ...score })),
    getCategories: () => [...categories]
  };

})();
