
/* ==========================================
   ATLAS MÉDICAL — ESPACE ÉTUDIANT
   Version 1.2 — Importation PDF locale
========================================== */

(function () {
  "use strict";

  function createCard(icon, title, description, status) {
    const card = document.createElement("article");

    card.style.cssText = `
      background:white;
      border:1px solid var(--line);
      border-radius:16px;
      padding:16px;
      min-width:0;
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

    /* =====================================
       INTRODUCTION
    ===================================== */

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

    /* =====================================
       CONFIDENTIALITÉ
    ===================================== */

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
      "Aucun nom, prénom, téléphone, e-mail ou établissement n'est demandé. Les documents sont conservés localement sur cet appareil.";
    privacyText.style.cssText =
      "font-size:12px;line-height:1.7;margin:8px 0 0;";

    privacy.append(privacyTitle, privacyText);

    /* =====================================
       OUTILS ÉTUDIANTS
    ===================================== */

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
        "Disponible"
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

    /* =====================================
       IMPORTATION DES DOCUMENTS PDF
    ===================================== */

    const documentsBox = document.createElement("div");
    documentsBox.style.cssText = `
      background:white;
      border:1px solid var(--line);
      border-radius:16px;
      padding:16px;
    `;

    const documentsTitle = document.createElement("h3");
    documentsTitle.textContent = "📁 Mes documents PDF";
    documentsTitle.style.margin = "0 0 8px";

    const documentsDescription = document.createElement("p");
    documentsDescription.textContent =
      "Sélectionne un cours PDF depuis les fichiers de ton appareil. Il sera enregistré dans ton espace local.";
    documentsDescription.style.cssText =
      "font-size:12px;line-height:1.6;color:var(--muted);";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,application/pdf";
    fileInput.hidden = true;

    const importButton = document.createElement("button");
    importButton.type = "button";
    importButton.className = "primary-btn";
    importButton.textContent = "＋ Importer un PDF";

    const documentsList = document.createElement("div");
    documentsList.style.cssText =
      "display:grid;gap:10px;margin-top:16px;";

    const emptyMessage = document.createElement("p");
    emptyMessage.textContent =
      "Aucun document enregistré pour le moment.";
    emptyMessage.style.cssText =
      "font-size:12px;color:var(--muted);";

    /* =====================================
       ACTUALISATION DES DOCUMENTS
    ===================================== */

    async function refreshDocuments() {
      documentsList.replaceChildren();

      try {
        const documents =
          await window.AtlasStudentDB.documents.getAll();

        if (!documents.length) {
          documentsList.appendChild(emptyMessage);
          return;
        }

        documents.sort((a, b) =>
          (b.createdAt || 0) - (a.createdAt || 0)
        );

        documents.forEach(record => {
          const item = document.createElement("div");

          item.style.cssText = `
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:10px;
            padding:12px;
            border:1px solid var(--line);
            border-radius:12px;
          `;

          const information = document.createElement("div");
          information.style.cssText = "min-width:0;";

          const name = document.createElement("strong");
          name.textContent = "📄 " + record.name;
          name.style.cssText =
            "display:block;font-size:13px;overflow-wrap:anywhere;";

          const date = document.createElement("small");
          date.textContent = record.createdAt
            ? new Date(record.createdAt).toLocaleDateString("fr-FR")
            : "Date inconnue";
          date.style.color = "var(--muted)";

          information.append(name, date);

          const deleteButton = document.createElement("button");
          deleteButton.type = "button";
          deleteButton.textContent = "Supprimer";

          deleteButton.style.cssText = `
            border:1px solid #e5bcbc;
            background:#fff5f5;
            color:#a32d2d;
            border-radius:8px;
            padding:8px;
            font-size:11px;
            flex-shrink:0;
          `;

          deleteButton.addEventListener("click", async () => {
            if (!window.confirm(
              "Supprimer définitivement ce document de cet appareil ?"
            )) return;

            try {
              await window.AtlasStudentDB.documents.delete(record.id);
              notify("Document supprimé.");
              await refreshDocuments();
            } catch (error) {
              console.error(error);
              notify("Impossible de supprimer ce document.");
            }
          });

          item.append(information, deleteButton);
          documentsList.appendChild(item);
        });

      } catch (error) {
        console.error("Lecture des documents :", error);
        notify("Impossible de charger les documents.");
      }
    }

    /* =====================================
       BOUTON D'IMPORTATION
    ===================================== */

    importButton.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files && fileInput.files[0];

      if (!file) return;

      if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        notify("Sélectionne un fichier PDF.");
        fileInput.value = "";
        return;
      }

      importButton.disabled = true;
      importButton.textContent = "Enregistrement...";

      try {
        await window.AtlasStudentDB.open();

        await window.AtlasStudentDB.documents.add({
          name: file.name,
          type: "pdf",
          size: file.size,
          createdAt: Date.now(),
          file: file
        });

        notify("PDF enregistré sur cet appareil !");
        await refreshDocuments();

      } catch (error) {
        console.error("Importation PDF :", error);

        notify(
          "Erreur d'enregistrement : " +
          (error.message || "stockage indisponible")
        );

      } finally {
        importButton.disabled = false;
        importButton.textContent = "＋ Importer un PDF";
        fileInput.value = "";
      }
    });

    documentsBox.append(
      documentsTitle,
      documentsDescription,
      importButton,
      fileInput,
      documentsList
    );

    /* =====================================
       TEST DU STOCKAGE LOCAL
    ===================================== */

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

        notify(
          "Erreur stockage : " +
          (error.message || "Erreur inconnue")
        );

      } finally {
        testButton.disabled = false;
      }
    });

    storageBox.append(
      storageTitle,
      storageText,
      testButton
    );

    /* =====================================
       ASSEMBLAGE DE L'ESPACE
    ===================================== */

    wrapper.append(
      introduction,
      privacy,
      sectionTitle,
      grid,
      documentsBox,
      storageBox
    );

    container.appendChild(wrapper);

    if (window.AtlasStudentDB) {
      refreshDocuments();
    }
  }

  /* =====================================
     EXPORTATION DU MODULE
  ===================================== */

  window.AtlasStudentSpace = {
    render: render
  };

})();
