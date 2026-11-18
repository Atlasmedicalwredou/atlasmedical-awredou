
/* ==========================================
   ATLAS MÉDICAL — ESPACE ÉTUDIANT
   Version 1.4 — Scanner iOS et PDF local
========================================== */

(function () {
  "use strict";

  const PDF_LIBRARY_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

  let pdfLibraryPromise = null;

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

  function loadPDFLibrary() {
    if (window.jspdf && window.jspdf.jsPDF) {
      return Promise.resolve(window.jspdf.jsPDF);
    }

    if (pdfLibraryPromise) return pdfLibraryPromise;

    pdfLibraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = PDF_LIBRARY_URL;
      script.async = true;

      script.onload = () => {
        if (window.jspdf && window.jspdf.jsPDF) {
          resolve(window.jspdf.jsPDF);
        } else {
          pdfLibraryPromise = null;
          reject(new Error("Bibliothèque PDF indisponible."));
        }
      };

      script.onerror = () => {
        pdfLibraryPromise = null;
        reject(new Error("Impossible de charger la bibliothèque PDF. Vérifie ta connexion."));
      };

      document.head.appendChild(script);
    });

    return pdfLibraryPromise;
  }

  function render(container, options = {}) {
    if (!container) return;

    const notify = options.toast || function () {};
    container.replaceChildren();

    const wrapper = document.createElement("section");
    wrapper.style.cssText =
      "grid-column:1/-1;display:grid;gap:14px;";

    /* INTRODUCTION */

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

    /* CONFIDENTIALITÉ */

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

    /* OUTILS */

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
      createCard("📁", "Mes documents",
        "Importer et retrouver tes cours PDF.", "Disponible"),
      createCard("📷", "Scanner mes cours",
        "Photographier plusieurs pages et les réunir en PDF.",
        "Disponible"),
      createCard("📝", "Mes notes",
        "Écrire et conserver tes notes personnelles.", "À construire"),
      createCard("🎙️", "Mon dictaphone",
        "Enregistrer et retrouver tes cours audio.", "À construire"),
      createCard("📚", "Mes transcriptions",
        "Retrouver le texte issu de tes enregistrements.", "À construire"),
      createCard("🛡️", "Mes données",
        "Gérer le stockage, l'exportation et la suppression.",
        "À construire")
    );

    /* SCANNER */

    const scannerBox = document.createElement("div");
    scannerBox.style.cssText = `
      background:white;
      border:1px solid var(--line);
      border-radius:16px;
      padding:16px;
    `;

    const scannerTitle = document.createElement("h3");
    scannerTitle.textContent = "📷 Scanner mes cours";
    scannerTitle.style.margin = "0 0 8px";

    const scannerDescription = document.createElement("p");
    scannerDescription.textContent =
      "Ajoute les pages de ton cours avec l'appareil photo ou en choisissant des images dans ta photothèque. Tu pourras vérifier leur ordre avant de créer le PDF.";
    scannerDescription.style.cssText =
      "font-size:12px;line-height:1.6;color:var(--muted);";

    /*
      iOS : aucun attribut capture n'est imposé.
      Safari peut proposer ses choix natifs :
      appareil photo, photothèque ou fichiers.
    */
    const cameraInput = document.createElement("input");
    cameraInput.type = "file";
    cameraInput.accept = "image/*";
    cameraInput.multiple = true;
    cameraInput.hidden = true;

    const addPageButton = document.createElement("button");
    addPageButton.type = "button";
    addPageButton.className = "primary-btn";
    addPageButton.textContent =
      "＋ Prendre une photo ou choisir des images";

    const pageCount = document.createElement("p");
    pageCount.textContent = "Aucune page ajoutée.";
    pageCount.style.cssText =
      "font-size:12px;color:var(--muted);margin:12px 0;";

    const previewList = document.createElement("div");
    previewList.style.cssText =
      "display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;";

    const createPDFButton = document.createElement("button");
    createPDFButton.type = "button";
    createPDFButton.className = "primary-btn";
    createPDFButton.textContent = "Créer et enregistrer le PDF";
    createPDFButton.disabled = true;
    createPDFButton.style.marginTop = "14px";

    const clearPagesButton = document.createElement("button");
    clearPagesButton.type = "button";
    clearPagesButton.textContent = "Vider les pages";
    clearPagesButton.style.cssText = `
      margin-top:10px;
      padding:9px 12px;
      border:1px solid var(--line);
      border-radius:9px;
      background:white;
      color:var(--text);
    `;
    clearPagesButton.disabled = true;

    let pages = [];
    let busy = false;

    function updateScanner() {
      pageCount.textContent = pages.length
        ? pages.length + (pages.length > 1
          ? " pages ajoutées."
          : " page ajoutée.")
        : "Aucune page ajoutée.";

      createPDFButton.disabled = !pages.length || busy;
      clearPagesButton.disabled = !pages.length || busy;
      addPageButton.disabled = busy;

      previewList.replaceChildren();

      pages.forEach((page, index) => {
        const card = document.createElement("div");
        card.style.cssText = `
          border:1px solid var(--line);
          border-radius:12px;
          overflow:hidden;
          background:#f8fafc;
        `;

        const image = document.createElement("img");
        image.src = page.url;
        image.alt = "Page " + (index + 1);
        image.style.cssText = `
          width:100%;
          height:145px;
          object-fit:contain;
          background:#eef2f6;
        `;

        const footer = document.createElement("div");
        footer.style.cssText =
          "display:flex;align-items:center;justify-content:space-between;padding:8px;gap:5px;";

        const label = document.createElement("small");
        label.textContent = "Page " + (index + 1);

        const actions = document.createElement("div");
        actions.style.cssText = "display:flex;gap:4px;";

        const upButton = document.createElement("button");
        upButton.type = "button";
        upButton.textContent = "↑";
        upButton.disabled = index === 0 || busy;
        upButton.setAttribute("aria-label", "Monter la page");

        upButton.addEventListener("click", () => {
          if (index === 0 || busy) return;
          [pages[index - 1], pages[index]] =
            [pages[index], pages[index - 1]];
          updateScanner();
        });

        const downButton = document.createElement("button");
        downButton.type = "button";
        downButton.textContent = "↓";
        downButton.disabled = index === pages.length - 1 || busy;
        downButton.setAttribute("aria-label", "Descendre la page");

        downButton.addEventListener("click", () => {
          if (index >= pages.length - 1 || busy) return;
          [pages[index + 1], pages[index]] =
            [pages[index], pages[index + 1]];
          updateScanner();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", "Supprimer la page");
        deleteButton.style.color = "#a32d2d";
        deleteButton.disabled = busy;

        deleteButton.addEventListener("click", () => {
          if (busy) return;
          URL.revokeObjectURL(pages[index].url);
          pages.splice(index, 1);
          updateScanner();
        });

        actions.append(upButton, downButton, deleteButton);
        footer.append(label, actions);
        card.append(image, footer);
        previewList.appendChild(card);
      });
    }

    addPageButton.addEventListener("click", () => {
      cameraInput.click();
    });

    cameraInput.addEventListener("change", () => {
      const files = Array.from(cameraInput.files || []);

      files.forEach(file => {
        if (!file.type.startsWith("image/")) return;

        pages.push({
          file,
          url: URL.createObjectURL(file)
        });
      });

      cameraInput.value = "";
      updateScanner();

      if (files.length) {
        notify(files.length + " fichier(s) ajouté(s).");
      }
    });

    clearPagesButton.addEventListener("click", () => {
      if (busy) return;
      pages.forEach(page => URL.revokeObjectURL(page.url));
      pages = [];
      updateScanner();
    });

    function loadImage(file) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        const url = URL.createObjectURL(file);

        image.onload = () => {
          URL.revokeObjectURL(url);
          resolve(image);
        };

        image.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Une image n'a pas pu être lue."));
        };

        image.src = url;
      });
    }

    createPDFButton.addEventListener("click", async () => {
      if (!pages.length || busy) return;

      busy = true;
      createPDFButton.textContent = "Création du PDF...";
      updateScanner();

      try {
        if (!window.AtlasStudentDB) {
          throw new Error("Le stockage local n'est pas disponible.");
        }

        await window.AtlasStudentDB.open();
        const jsPDF = await loadPDFLibrary();

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: true
        });

        for (let index = 0; index < pages.length; index++) {
          const image = await loadImage(pages[index].file);

          const canvas = document.createElement("canvas");
          const maxDimension = 1800;
          const scale = Math.min(
            1,
            maxDimension / Math.max(image.width, image.height)
          );

          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));

          const context = canvas.getContext("2d");
          if (!context) {
            throw new Error("Impossible de préparer une image.");
          }

          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          const imageData = canvas.toDataURL("image/jpeg", 0.82);

          if (index > 0) pdf.addPage();

          const pageWidth = 210;
          const pageHeight = 297;
          const margin = 8;

          const ratio = Math.min(
            (pageWidth - margin * 2) / canvas.width,
            (pageHeight - margin * 2) / canvas.height
          );

          const width = canvas.width * ratio;
          const height = canvas.height * ratio;

          pdf.addImage(
            imageData,
            "JPEG",
            (pageWidth - width) / 2,
            (pageHeight - height) / 2,
            width,
            height,
            undefined,
            "FAST"
          );

          canvas.width = 1;
          canvas.height = 1;
        }

        const blob = pdf.output("blob");
        const dateName = new Date().toISOString().slice(0, 10);

        await window.AtlasStudentDB.documents.add({
          name: "Cours_scannes_" + dateName + ".pdf",
          type: "pdf",
          size: blob.size,
          createdAt: Date.now(),
          file: blob
        });

        pages.forEach(page => URL.revokeObjectURL(page.url));
        pages = [];
        updateScanner();

        notify("PDF créé et enregistré dans Mes documents !");
        await refreshDocuments();

      } catch (error) {
        console.error("Scanner Atlas :", error);
        notify(error.message || "Impossible de créer le PDF.");

      } finally {
        busy = false;
        createPDFButton.textContent = "Créer et enregistrer le PDF";
        updateScanner();
      }
    });

    scannerBox.append(
      scannerTitle,
      scannerDescription,
      addPageButton,
      cameraInput,
      pageCount,
      previewList,
      createPDFButton,
      clearPagesButton
    );

    /* IMPORTATION DES DOCUMENTS PDF */

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

    /* TEST DU STOCKAGE LOCAL */

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

    storageBox.append(storageTitle, storageText, testButton);

    /* ASSEMBLAGE */

    wrapper.append(
      introduction,
      privacy,
      sectionTitle,
      grid,
      scannerBox,
      documentsBox,
      storageBox
    );

    container.appendChild(wrapper);

    if (window.AtlasStudentDB) {
      refreshDocuments();
    }

    /* LIBÉRATION DES APERÇUS SI LA PAGE EST QUITTÉE */
    const cleanup = () => {
      pages.forEach(page => URL.revokeObjectURL(page.url));
      pages = [];
    };

    window.addEventListener("pagehide", cleanup, { once: true });
  }

  window.AtlasStudentSpace = {
    render: render
  };

})();
