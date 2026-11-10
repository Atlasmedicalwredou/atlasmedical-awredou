
/* ==========================================
   ATLAS MÉDICAL — CALCULATRICES
   Calculs effectués localement sur l'appareil
========================================== */

(function () {
  const calculators = [
    {
      id: "imc",
      category: "Médecine générale",
      title: "Indice de masse corporelle (IMC)",
      description: "Évaluation du rapport poids / taille",
      fields: [
        { id: "weight", label: "Poids", unit: "kg", type: "number", min: 1 },
        { id: "height", label: "Taille", unit: "cm", type: "number", min: 1 }
      ],
      formula: "IMC = poids (kg) / taille² (m)",
      calculate: v => {
        const height = v.height / 100;
        const result = v.weight / (height * height);
        let interpretation = "Valeur à interpréter selon l'âge et le contexte clinique.";
        if (result < 18.5) interpretation = "Insuffisance pondérale chez l'adulte.";
        else if (result < 25) interpretation = "Corpulence dite normale chez l'adulte.";
        else if (result < 30) interpretation = "Surpoids chez l'adulte.";
        else interpretation = "Obésité chez l'adulte.";
        return { result: result.toFixed(1), unit: "kg/m²", interpretation };
      },
      note: "Interprétation adulte uniquement. Ne convient pas à l'interprétation pédiatrique ou à la grossesse."
    },
    {
      id: "surface",
      category: "Médecine générale",
      title: "Surface corporelle",
      description: "Formule de Mosteller",
      fields: [
        { id: "weight", label: "Poids", unit: "kg", type: "number", min: 1 },
        { id: "height", label: "Taille", unit: "cm", type: "number", min: 1 }
      ],
      formula: "SC = √[(taille × poids) / 3600]",
      calculate: v => ({
        result: Math.sqrt((v.height * v.weight) / 3600).toFixed(2),
        unit: "m²",
        interpretation: "Surface corporelle estimée selon la formule de Mosteller."
      }),
      note: "Une estimation de surface corporelle ne suffit pas à déterminer une dose médicamenteuse."
    },
    {
      id: "cockcroft",
      category: "Néphrologie",
      title: "Clairance de la créatinine",
      description: "Formule de Cockcroft-Gault",
      fields: [
        { id: "age", label: "Âge", unit: "ans", type: "number", min: 1 },
        { id: "weight", label: "Poids", unit: "kg", type: "number", min: 1 },
        { id: "creatinine", label: "Créatinine", unit: "mg/dL", type: "number", min: 0.01 },
        { id: "sex", label: "Sexe", type: "select", options: ["Homme", "Femme"] }
      ],
      formula: "Homme : [(140 − âge) × poids] / (72 × créatinine). Femme : résultat × 0,85.",
      calculate: v => {
        let result = ((140 - v.age) * v.weight) / (72 * v.creatinine);
        if (v.sex === "Femme") result *= 0.85;
        return {
          result: result.toFixed(1),
          unit: "mL/min",
          interpretation: "Estimation de la clairance de la créatinine."
        };
      },
      note: "La formule nécessite une créatinine en mg/dL. Attention aux situations où la créatinine n'est pas à l'état stable, aux extrêmes de poids et aux limites liées à la masse musculaire."
    },
    {
      id: "anion",
      category: "Biologie",
      title: "Trou anionique",
      description: "Évaluation de l'équilibre acido-basique",
      fields: [
        { id: "sodium", label: "Natrémie", unit: "mmol/L", type: "number", min: 1 },
        { id: "chloride", label: "Chlorémie", unit: "mmol/L", type: "number", min: 1 },
        { id: "bicarbonate", label: "Bicarbonates", unit: "mmol/L", type: "number", min: 0 }
      ],
      formula: "TA = Na⁺ − (Cl⁻ + HCO₃⁻)",
      calculate: v => {
        const result = v.sodium - v.chloride - v.bicarbonate;
        return {
          result: result.toFixed(1),
          unit: "mmol/L",
          interpretation: "À interpréter selon la méthode du laboratoire et l'albuminémie."
        };
      },
      note: "La valeur de référence dépend du laboratoire. Le trou anionique doit notamment être interprété en tenant compte de l'albumine."
    },
    {
      id: "nacorrige",
      category: "Biologie",
      title: "Natrémie corrigée",
      description: "Correction en cas d'hyperglycémie",
      fields: [
        { id: "sodium", label: "Natrémie mesurée", unit: "mmol/L", type: "number", min: 1 },
        { id: "glucose", label: "Glycémie", unit: "mg/dL", type: "number", min: 1 }
      ],
      formula: "Na corrigé = Na mesuré + 1,6 × [(glycémie − 100) / 100]",
      calculate: v => {
        const correction = Math.max(0, (v.glucose - 100) / 100);
        const result = v.sodium + 1.6 * correction;
        return {
          result: result.toFixed(1),
          unit: "mmol/L",
          interpretation: "Estimation de la natrémie corrigée de l'hyperglycémie."
        };
      },
      note: "Coefficient de correction simplifié. D'autres coefficients peuvent être utilisés selon le niveau d'hyperglycémie et le contexte."
    },
    {
      id: "qtc",
      category: "Cardiologie",
      title: "QT corrigé (QTc)",
      description: "Formule de Bazett",
      fields: [
        { id: "qt", label: "Intervalle QT", unit: "ms", type: "number", min: 1 },
        { id: "rr", label: "Intervalle RR", unit: "ms", type: "number", min: 1 }
      ],
      formula: "QTc = QT / √RR (en secondes)",
      calculate: v => {
        const qtSeconds = v.qt / 1000;
        const rrSeconds = v.rr / 1000;
        const result = qtSeconds / Math.sqrt(rrSeconds);
        return {
          result: (result * 1000).toFixed(0),
          unit: "ms",
          interpretation: "Valeur à confronter au sexe, à la fréquence cardiaque et au contexte clinique."
        };
      },
      note: "La formule de Bazett peut surestimer ou sous-estimer le QTc selon la fréquence cardiaque. Vérifier le tracé ECG et les recommandations."
    },
    {
      id: "terme",
      category: "Gynécologie-obstétrique",
      
{
  title: "Âge gestationnel",
  description: "Estimation à partir des dernières règles",
  fields: [
    {
      id: "lastPeriod",
      label: "Date des dernières règles",
      type: "date"
    },
    {
      id: "calculationDate",
      label: "Date de calcul",
      type: "date"
    }
  ],
  formula: "Âge gestationnel = différence entre la date de calcul et le premier jour des dernières règles.",
  calculate: v => {
    const start = new Date(v.lastPeriod + "T12:00:00");
    const today = new Date(v.calculationDate + "T12:00:00");

    const days = Math.floor(
      (today - start) / 86400000
    );

    if (days < 0) {
      throw new Error("La date de calcul doit être postérieure à la DDR.");
    }

    const weeks = Math.floor(days / 7);

    return {
      result: weeks + " + " + (days % 7),
      unit: "SA",
      interpretation:
        "Âge gestationnel estimé à partir de la DDR."
    };
  },
  note: "La datation échographique précoce peut être plus fiable. Vérifier la date et la régularité des cycles."
},

      id: "termeprevu",
      category: "Gynécologie-obstétrique",
      title: "Date prévue d'accouchement",
      description: "Règle de Naegele",
      fields: [
        { id: "lastPeriod", label: "Premier jour des dernières règles", type: "date" }
      ],
      formula: "Date prévue = dernières règles + 280 jours.",
      calculate: v => {
        const date = new Date(v.lastPeriod + "T12:00:00");
        date.setDate(date.getDate() + 280);
        return {
          result: date.toLocaleDateString("fr-FR"),
          unit: "",
          interpretation: "Date théorique estimée de l'accouchement."
        };
      },
      note: "Estimation conventionnelle pour un cycle de 28 jours. À adapter selon le contexte et la datation échographique."
    }
  ];

  const categories = [
    "Toutes",
    "Médecine générale",
    "Cardiologie",
    "Néphrologie",
    "Biologie",
    "Pédiatrie",
    "Gynécologie-obstétrique",
    "Urgences",
    "Pneumologie",
    "Neurologie",
    "Nutrition"
  ];

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function render(grid) {
    grid.replaceChildren();

    let selectedCategory = "Toutes";

    const wrapper = createElement("div");
    wrapper.style.cssText = "grid-column:1/-1;display:grid;gap:16px;";

    const intro = createElement("p", "small-note",
      "Des outils pédagogiques de calcul clinique. Vérifie toujours les unités, les résultats et le contexte du patient."
    );

    const filters = createElement("div");
    filters.style.cssText = "display:flex;gap:8px;overflow-x:auto;padding:4px 0;";

    const list = createElement("div");
    list.style.cssText = "display:grid;gap:12px;";

    function renderList() {
      list.replaceChildren();

      const visible = calculators.filter(item =>
        selectedCategory === "Toutes" ||
        item.category === selectedCategory
      );

      visible.forEach(item => {
        const card = createElement("button", "module-card");
        card.style.cssText = "text-align:left;width:100%;";

        card.append(
          createElement("strong", "", item.title),
          createElement("small", "", item.category + " · " + item.description)
        );

        card.addEventListener("click", () => renderCalculator(item));
        list.appendChild(card);
      });

      if (!visible.length) {
        list.appendChild(createElement("p", "small-note",
          "Aucune calculatrice disponible dans cette catégorie pour le moment."
        ));
      }
    }

    categories.forEach(category => {
      const button = createElement("button", "secondary-btn", category);
      button.style.cssText = "white-space:nowrap;flex-shrink:0;";

      button.addEventListener("click", () => {
        selectedCategory = category;
        filters.querySelectorAll("button").forEach(b => {
          b.style.background = b.textContent === category
            ? "var(--turquoise-light)"
            : "white";
        });
        renderList();
      });

      filters.appendChild(button);
    });

    function renderCalculator(item) {
      list.replaceChildren();

      const card = createElement("div");
      card.style.cssText =
        "background:white;border:1px solid var(--line);border-radius:16px;padding:18px;display:grid;gap:14px;";

      const back = createElement("button", "secondary-btn", "← Retour aux calculatrices");
      back.addEventListener("click", renderList);

      card.append(
        back,
        createElement("h3", "", item.title),
        createElement("p", "small-note", item.description)
      );

      const form = createElement("form");
      form.style.cssText = "display:grid;gap:12px;";

      const inputs = {};

      item.fields.forEach(field => {
        const group = createElement("label");
        group.style.cssText = "display:grid;gap:6px;font-size:13px;font-weight:600;";
        group.appendChild(createElement("span", "", field.label));

        let input;

        if (field.type === "select") {
          input = createElement("select");
          field.options.forEach(option => {
            const optionElement = createElement("option", "", option);
            optionElement.value = option;
            input.appendChild(optionElement);
          });
        } else {
          input = createElement("input");
          input.type = field.type || "number";
          input.step = "any";
          input.min = field.min || "";
          input.style.cssText =
            "width:100%;padding:12px;border:1px solid var(--line);border-radius:10px;font:inherit;";
        }

        if (field.type === "select") {
          input.style.cssText =
            "width:100%;padding:12px;border:1px solid var(--line);border-radius:10px;font:inherit;";
        }

        if (field.type === "date") {
          input.style.cssText =
            "width:100%;padding:12px;border:1px solid var(--line);border-radius:10px;font:inherit;";
        }

        inputs[field.id] = input;
        group.appendChild(input);

        if (field.unit) {
          group.appendChild(createElement("small", "small-note", field.unit));
        }

        form.appendChild(group);
      });

      const calculateButton = createElement("button", "primary-btn", "Calculer");
      calculateButton.type = "submit";
      form.appendChild(calculateButton);

      const resultBox = createElement("div");
      resultBox.style.cssText =
        "display:none;background:#e0f7f5;border:1px solid #ccece7;border-radius:12px;padding:14px;";

      form.addEventListener("submit", event => {
        event.preventDefault();

        const values = {};

        for (const field of item.fields) {
          const raw = inputs[field.id].value;

          if (!raw) {
            toast("Veuillez renseigner tous les champs.");
            return;
          }

          if (field.type !== "select" && field.type !== "date") {
            const number = Number(raw);

            if (!Number.isFinite(number) || number < 0 || (field.min && number < field.min)) {
              toast("Veuillez vérifier les valeurs saisies.");
              return;
            }

            values[field.id] = number;
          } else {
            values[field.id] = raw;
          }
        }

        try {
          const result = item.calculate(values);

          if (
            !result ||
            result.result === undefined ||
            (typeof result.result === "number" && !Number.isFinite(result.result))
          ) {
            toast("Calcul impossible. Vérifiez les données.");
            return;
          }

          resultBox.replaceChildren(
            createElement("strong", "", "Résultat : " + result.result + " " + result.unit),
            createElement("p", "", result.interpretation)
          );

          resultBox.style.display = "grid";
          resultBox.style.gap = "8px";
        } catch (error) {
          toast("Une erreur est survenue pendant le calcul.");
        }
      });

      card.append(
        form,
        resultBox,
        createElement("p", "small-note", "Formule : " + item.formula),
        createElement("p", "small-note", "Précautions : " + item.note)
      );

      list.replaceChildren(card);
    }

    wrapper.append(intro, filters, list);
    grid.appendChild(wrapper);
    renderList();
  }

  window.ATLAS_CALCULATORS = { render };
})();
