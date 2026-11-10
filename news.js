
/* ==========================================
   ATLAS MÉDICAL — ACTUALITÉS
   Sources médicales du Sénégal
========================================== */

(function () {
  const sources = [
    {
      name: "Ministère de la Santé et de l'Hygiène publique",
      category: "Institution nationale",
      description: "Communiqués, programmes sanitaires et informations officielles.",
      url: "https://www.sante.gouv.sn/",
      icon: "🏥"
    },
    {
      name: "Institut Pasteur de Dakar",
      category: "Recherche et santé publique",
      description: "Recherche biomédicale, surveillance épidémiologique et actualités scientifiques.",
      url: "https://pasteur.sn/",
      icon: "🔬"
    },
    {
      name: "Organisation mondiale de la Santé — Sénégal",
      category: "Organisation internationale",
      description: "Actualités sanitaires, alertes et recommandations pour le Sénégal.",
      url: "https://www.afro.who.int/countries/senegal",
      icon: "🌍"
    },
    {
      name: "Organisation mondiale de la Santé — Afrique",
      category: "Santé publique",
      description: "Informations régionales et publications de santé publique.",
      url: "https://www.afro.who.int/",
      icon: "📚"
    }
  ];

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
  }

  function render(grid) {
    grid.replaceChildren();

    const wrapper = createElement("div");
    wrapper.style.cssText =
      "grid-column:1/-1;display:grid;gap:16px;";

    const introduction = createElement(
      "p",
      "small-note",
      "Retrouve des informations médicales et sanitaires provenant de sources institutionnelles et scientifiques, avec une priorité accordée au Sénégal."
    );

    const status = createElement("div");
    status.style.cssText =
      "background:#e0f7f5;border:1px solid #ccece7;border-radius:14px;padding:15px;";

    status.append(
      createElement("strong", "", "Veille médicale du Sénégal"),
      createElement(
        "p",
        "small-note",
        "Les sources sont accessibles en ligne. Le flux automatique des dernières publications sera ajouté dans une prochaine version."
      )
    );

    const heading = createElement("h3", "", "Sources à consulter");
    heading.style.cssText = "font-size:16px;margin:8px 0;";

    const list = createElement("div");
    list.style.cssText = "display:grid;gap:12px;";

    sources.forEach(source => {
      const card = createElement("div");
      card.style.cssText =
        "background:white;border:1px solid var(--line);border-radius:16px;padding:16px;display:grid;gap:8px;";

      const top = createElement("div");
      top.style.cssText =
        "display:flex;align-items:center;gap:10px;";

      const icon = createElement("span", "", source.icon);
      icon.style.fontSize = "24px";

      const title = createElement("strong", "", source.name);
      title.style.fontSize = "14px";

      top.append(icon, title);

      const category = createElement(
        "small",
        "small-note",
        source.category
      );

      const description = createElement(
        "p",
        "small-note",
        source.description
      );

      const link = createElement(
        "a",
        "secondary-btn",
        "Consulter la source ↗"
      );

      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.style.cssText =
        "display:inline-block;text-align:center;text-decoration:none;";

      card.append(top, category, description, link);
      list.appendChild(card);
    });

    const note = createElement(
      "p",
      "small-note",
      "Important : les informations publiées par les institutions, les articles scientifiques évalués par les pairs et les communiqués ne sont pas de même nature. Vérifie toujours la source, la date de publication et le contexte avant d'utiliser une information dans ta pratique médicale."
    );

    wrapper.append(
      introduction,
      status,
      heading,
      list,
      note
    );

    grid.appendChild(wrapper);
  }

  window.ATLAS_NEWS = { render };
})();
