
/* =========================================
   ATLAS MÉDICAL — ESPACE ÉTUDIANT
   Version 1.0 — Interface locale anonyme
========================================= */

(function () {
  "use strict";

  function createCard(icon, title, description, status) {
    const card = document.createElement("article");

    card.style.cssText = `
      background: white;
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 16px;
      min-width: 0;
    `;

    const symbol = document.createElement("div");
    symbol.textContent = icon;
    symbol.style.fontSize = "26px";

    const heading = document.createElement("h3");
    heading.textContent = title;
    heading.style.cssText = "margin:10px 0 5px;font-size:15px;";

    const text = document.createElement("p");
    text.textContent = description;
    text.style.cssText =
      "font-size:12px;color:var(--muted);line-height:1.6;margin:0;";

    const label = document.createElement("small");
    label.textContent = status;
    label.style.cssText =
      "display:block;margin-top:12px;color:var(--muted);";

    card.append(symbol, heading, text, label);

    return card;
  }

  function render(container, options = {}) {
    if (!container) return;

    const notify = options.toast || function () {};

    container.replaceChildren();

    const wrapper = document.createElement("section");
    wrapper.style.cssText =
      "grid-column:1/-1;display:grid;gap:14px;";

    const introduction = document.createElement("div");
    introduction.style.cssText = `
      background:#102b46;
      color:white;
      border-radius:18px;
      padding:22px;
    `;

    const title = document.createElement("h2");
    title.textContent = "Mon espace étudiant";
    title.style.cssText = "margin:0 0 8px;font-size:21px;";

    const description = document.createElement("p");
    description.textContent =
      "Ton espace personnel pour conserver tes cours, tes notes et tes enregistrements sur cet appareil.";
    description.style.cssText =
      "font-size:13px;line-height:1.7;color:#e0f5f1;margin:0;";

    introduction.append(title, description);

    const privacy = document.createElement("div");
    privacy.style.cssText = `
      background:#eaf7f3;
      border:1px solid #ccebe1;
      border-radius:14px;
      padding:14px;
      color:#164b40;
    `;

    const privacyTitle = document.createElement("strong");
    privacyTitle.textContent = "🔒 Espace sans identité réelle";

    const privacyText = document.createElement("p");
    privacyText.textContent =
      "Aucun nom, prénom, téléphone, e-mail ou établissement n'est demandé. Les données personnelles de cet espace sont destinées à rester sur cet appareil.";
    privacyText.style.cssText =
      "font-size:12px;line-height:1.7;margin:8px 0 0;";

    privacy.append(privacyTitle, privacyText);

    const sectionTitle = document.createElement("h3");
    sectionTitle.textContent = "Mes outils";
    sectionTitle.style.margin = "5px 0 0";

    const grid = document.createElement("div");
    grid.style.cssText = `
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:12px;
    `;

    grid.append(
      createCard(
        "📁",
        "Mes documents",
        "Importer et retrouver tes cours PDF.",
        "À construire"
      ),
      createCard(
        "📷",
        "Scanner mes cours",
        "Photographier des pages et les convertir en PDF.",
        "À construire"
      ),
      createCard(
        "📝",
        "Mes notes",
        "Écrire et conserver tes notes personnelles.",
        "À construire"
      ),
      createCard(
        "🎙️",
        "Mon dictaphone",
        "Enregistrer et retrouver tes cours audio.",
        "À construire"
      ),
      createCard(
        "📚",
        "Mes transcriptions",
        "Retrouver le texte issu de tes enregistrements.",
        "À construire"
      ),
      createCard(
        "🛡️",
        "Mes données",
        "Gérer le stockage, l'exportation et la suppression.",
        "À construire"
      )
    );

    const storageBox = document.createElement("div");
    storageBox.style.cssText = `
      background:white;
      border:1px solid var(--line);
      border-radius:16px;
      padding:16px;
    `;

    const storageTitle = document.createElement("strong");
    storageTitle.textContent = "Stockage local";

    const storageText = document.createElement("p");
    storageText.textContent =
      "Vérifie que la base de données locale d'Atlas Médical fonctionne.";
    storageText.style.cssText =
      "font-size:12px;line-height:1.6;color:var(--muted);";

    const testButton = document.createElement("button");
    testButton.className = "primary-btn";
    testButton.type = "button";
    testButton.textContent = "Tester mon stockage local";

    testButton.addEventListener("click", async () => {
      testButton.disabled = true;
      testButton.textContent = "Vérification...";

      try {
        if (!window.AtlasStudentDB) {
          throw new Error("Le module de stockage n'est pas chargé.");
        }

        await window.AtlasStudentDB.open();

        testButton.textContent = "✓ Stockage disponible";
        notify("La base locale Atlas fonctionne !");
      } catch (error) {
        console.error("Atlas Student Space :", error);

        testButton.textContent = "Réessayer le test";
        notify("Impossible d'ouvrir la base locale.");
      } finally {
        testButton.disabled = false;
      }
    });

    storageBox.append(
      storageTitle,
      storageText,
      testButton
    );

    wrapper.append(
      introduction,
      privacy,
      sectionTitle,
      grid,
      storageBox
    );

    container.appendChild(wrapper);
  }

  window.AtlasStudentSpace = {
    render
  };

})();

