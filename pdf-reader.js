
/* =========================================
   ATLAS MÉDICAL — LECTEUR PDF INTÉGRÉ
   Moteur PDF.js — version 1.3
========================================= */

(function () {
  "use strict";

  const PDFJS_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";

  const WORKER_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  let pdfDocument = null;
  let currentPage = 1;
  let zoom = 1;
  let renderTask = null;
  let viewer = null;
  let canvas = null;
  let loadingPromise = null;
  /* =================================
     FAVORIS ET MARQUE-PAGES
  ================================= */

  let bookmarks = [];
let currentDocumentURL = "";
let currentDocumentTitle = "";
  function loadBookmarks() {
    try {
      bookmarks = JSON.parse(
        localStorage.getItem("atlas-pdf-bookmarks") || "[]"
      );
    } catch (error) {
      bookmarks = [];
    }
  }

  function saveBookmarks() {
    localStorage.setItem(
      "atlas-pdf-bookmarks",
      JSON.stringify(bookmarks)
    );
  }
     /* =================================
     CARNET DE NOTES PERSONNELLES
  ================================= */

  let pageNotes = [];

  function loadPageNotes() {
    try {
      pageNotes = JSON.parse(
        localStorage.getItem("atlas-pdf-page-notes") || "[]"
      );
    } catch (error) {
      pageNotes = [];
    }
  }

  function savePageNotes() {
    localStorage.setItem(
      "atlas-pdf-page-notes",
      JSON.stringify(pageNotes)
    );
  }
  function loadPDFJS() {
    if (window.pdfjsLib) {
      return Promise.resolve(window.pdfjsLib);
    }

    if (loadingPromise) return loadingPromise;

    loadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = PDFJS_URL;

      script.onload = () => {
        if (!window.pdfjsLib) {
          reject(new Error("PDF.js non chargé."));
          return;
        }

        window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
        resolve(window.pdfjsLib);
      };

      script.onerror = () => {
        loadingPromise = null;
        reject(new Error("Impossible de charger PDF.js."));
      };

      document.head.appendChild(script);
    });

    return loadingPromise;
  }

  function createViewer() {
         loadBookmarks();   
     loadPageNotes();
    if (viewer) return;

    const style = document.createElement("style");

    style.textContent = `
      #atlas-pdf-app {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        background: #102b46;
        color: white;
        font-family: Arial, sans-serif;
      }

      #atlas-pdf-app .pdf-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 14px;
        padding-top: max(14px, env(safe-area-inset-top));
        background: #102b46;
      }

      #atlas-pdf-app .pdf-title {
        font-weight: bold;
        font-size: 15px;
        overflow-wrap: anywhere;
      }

      #atlas-pdf-app button {
        border: 0;
        border-radius: 9px;
        padding: 10px 13px;
        background: #e0f5f1;
        color: #102b46;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
      }

      #atlas-pdf-app button:disabled {
        opacity: .4;
      }

      #atlas-pdf-app .pdf-toolbar {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        padding: 10px;
        background: #183c5b;
      }

      #atlas-pdf-app .pdf-page-info {
        font-size: 13px;
        min-width: 85px;
        text-align: center;
      }

      /* BARRE DE PROGRESSION */

      #atlas-pdf-app .pdf-progress {
        padding: 8px 14px;
        background: #183c5b;
      }

      #atlas-pdf-app .pdf-progress-track {
        height: 7px;
        background: #ffffff33;
        border-radius: 999px;
        overflow: hidden;
      }

      #atlas-pdf-app .pdf-progress-fill {
        width: 0%;
        height: 100%;
        background: #2dd4bf;
        border-radius: 999px;
        transition: width .2s ease;
      }

      #atlas-pdf-app .pdf-progress-label {
        margin-top: 5px;
        font-size: 12px;
        text-align: right;
        color: #e0f5f1;
      }

      /* PANNEAU DES MINIATURES */

      #atlas-pdf-app .pdf-thumbnails[hidden] {
        display: none !important;
      }

      #atlas-pdf-app .pdf-thumbnails {
        max-height: 45vh;
        min-height: 0;
        flex-shrink: 0;
        overflow-y: auto;
        padding: 12px;
        background: #183c5b;
        border-bottom: 2px solid #2dd4bf;
      }

      #atlas-pdf-app .pdf-thumbnails-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        color: white;
      }

      #atlas-pdf-app .pdf-thumbnails-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      #atlas-pdf-app .pdf-thumbnail {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 7px;
        background: #ffffff;
        border: 2px solid transparent;
        border-radius: 8px;
        color: #102b46;
        min-width: 0;
      }

      #atlas-pdf-app .pdf-thumbnail.active {
        border-color: #2dd4bf;
      }

      #atlas-pdf-app .pdf-thumbnail canvas {
        width: 100%;
        height: auto;
        box-shadow: none;
      }

      #atlas-pdf-app .pdf-thumbnail span {
        font-size: 12px;
      }

      /* DOCUMENT PDF */

      #atlas-pdf-app .pdf-content {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 14px;
        text-align: center;
        -webkit-overflow-scrolling: touch;
        background: #dce4eb;
      }

      #atlas-pdf-app canvas {
        display: block;
        margin: 0 auto;
        max-width: none;
        background: white;
        box-shadow: 0 2px 12px #0003;
      }

      #atlas-pdf-app .pdf-message {
        padding: 25px 12px;
        color: #102b46;
        font-size: 15px;
      }
    `;

    document.head.appendChild(style);

    viewer = document.createElement("div");
    viewer.id = "atlas-pdf-app";

    viewer.innerHTML = `
      <div class="pdf-header">
        <button type="button" id="atlas-pdf-close">
          ← Back to Library
        </button>

        <div class="pdf-title" id="atlas-pdf-title">
          Atlas Médical — Document
        </div>
      </div>

      <div class="pdf-toolbar">
        <button type="button" id="atlas-pdf-prev">◀</button>

        <span class="pdf-page-info" id="atlas-pdf-info">
          Page 1 / 1
        </span>

        <button type="button" id="atlas-pdf-next">▶</button>
        <button type="button" id="atlas-pdf-minus">−</button>
        <button type="button" id="atlas-pdf-plus">+</button>

        <button type="button" id="atlas-pdf-thumbnails">
          📑 Pages
        </button>
        <button type="button" id="atlas-pdf-bookmark">
  ☆ Favori
</button>
<button type="button" id="atlas-pdf-favorites">
  ⭐ Mes favoris
</button>
<button type="button" id="atlas-pdf-notes">
  📝 Mes notes
</button>
<button type="button" id="atlas-pdf-all-notes">
  📚 Toutes mes notes
</button>
      </div>

      <div class="pdf-progress">
        <div class="pdf-progress-track">
          <div
            class="pdf-progress-fill"
            id="atlas-pdf-progress-fill">
          </div>
        </div>

        <div
          class="pdf-progress-label"
          id="atlas-pdf-progress-label">
          Lecture : 0 %
        </div>
      </div>

      <div
        class="pdf-thumbnails"
        id="atlas-pdf-thumbnails-panel"
        hidden>

        <div class="pdf-thumbnails-header">
          <strong>Pages du document</strong>

          <button
            type="button"
            id="atlas-pdf-thumbnails-close">
            ✕
          </button>
        </div>

        <div
          class="pdf-thumbnails-list"
          id="atlas-pdf-thumbnails-list">
        </div>
      </div>

      <div class="pdf-content" id="atlas-pdf-content">
        <p class="pdf-message" id="atlas-pdf-message">
          Chargement du document...
        </p>

        <canvas id="atlas-pdf-canvas" hidden></canvas>
      </div>
    `;

    document.body.appendChild(viewer);

    canvas = viewer.querySelector("#atlas-pdf-canvas");

    viewer.querySelector("#atlas-pdf-close")
      .addEventListener("click", close);

    viewer.querySelector("#atlas-pdf-prev")
      .addEventListener("click", () => goToPage(currentPage - 1));

    viewer.querySelector("#atlas-pdf-next")
      .addEventListener("click", () => goToPage(currentPage + 1));

    viewer.querySelector("#atlas-pdf-minus")
      .addEventListener("click", () => changeZoom(-0.2));

    viewer.querySelector("#atlas-pdf-plus")
      .addEventListener("click", () => changeZoom(0.2));

    viewer.querySelector("#atlas-pdf-thumbnails")
      .addEventListener("click", toggleThumbnails);

    viewer.querySelector("#atlas-pdf-thumbnails-close")
      .addEventListener("click", toggleThumbnails);
     viewer.querySelector("#atlas-pdf-bookmark")
  .addEventListener("click", toggleBookmark);
viewer.querySelector("#atlas-pdf-favorites")
  .addEventListener("click", showBookmarks);
     viewer.querySelector("#atlas-pdf-notes")
  .addEventListener("click", showNotes);
     viewer.querySelector("#atlas-pdf-all-notes")
  .addEventListener("click", showAllNotes);
    document.addEventListener("keydown", keyboardNavigation);
  }

  /* OUVRIR ET FERMER LES MINIATURES */
  /* AJOUTER OU RETIRER UN FAVORI */
  /* ACTUALISER L'ÉTAT DU BOUTON FAVORI */

  function updateBookmarkButton() {
    if (!viewer) return;

    const button = viewer.querySelector(
      "#atlas-pdf-bookmark"
    );

    if (!button) return;

    const isSaved = bookmarks.some(item =>
      item.url === currentDocumentURL &&
      item.page === currentPage
    );

    button.textContent = isSaved
      ? "★ Favori"
      : "☆ Favori";
  }
  function toggleBookmark() {
    if (!pdfDocument || !currentDocumentURL) return;

    const existingIndex = bookmarks.findIndex(item =>
      item.url === currentDocumentURL &&
      item.page === currentPage
    );

    if (existingIndex !== -1) {
      bookmarks.splice(existingIndex, 1);
    } else {
      bookmarks.push({
        url: currentDocumentURL,
        title: currentDocumentTitle,
        page: currentPage,
        date: new Date().toISOString()
      });
    }

    saveBookmarks();

    const button = viewer.querySelector(
      "#atlas-pdf-bookmark"
    );

    button.textContent =
      existingIndex !== -1 ? "☆ Favori" : "★ Favori";
  }
     /* AFFICHER LA BIBLIOTHÈQUE DES FAVORIS */

  function showBookmarks() {
    if (!viewer) return;

    const oldPanel = viewer.querySelector(
      "#atlas-pdf-bookmarks-panel"
    );

    if (oldPanel) oldPanel.remove();

    const panel = document.createElement("div");
    panel.id = "atlas-pdf-bookmarks-panel";

    panel.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 10;
      background: #102b46;
      padding: 20px;
      overflow-y: auto;
    `;

    const header = document.createElement("div");

    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    `;

    const title = document.createElement("strong");
    title.textContent = "⭐ Mes pages favorites";

    const closeButton = document.createElement("button");
    closeButton.textContent = "✕";

    closeButton.addEventListener("click", () => {
      panel.remove();
    });

    header.append(title, closeButton);
    panel.appendChild(header);

    if (bookmarks.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Aucun favori enregistré pour le moment.";
      panel.appendChild(empty);
    }

    bookmarks.forEach((item, index) => {
      const entry = document.createElement("div");

      entry.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: 12px;
        margin-bottom: 10px;
        background: #183c5b;
        border-radius: 10px;
      `;

      const info = document.createElement("div");

      const name = document.createElement("strong");
      name.textContent = item.title;

      const page = document.createElement("p");
      page.textContent = `Page ${item.page}`;
      page.style.margin = "6px 0 0";

      info.append(name, page);

      const actions = document.createElement("div");

      const openButton = document.createElement("button");
      openButton.textContent = "Ouvrir";

      openButton.addEventListener("click", async () => {
        panel.remove();
        await open(item.url, item.title);
        await goToPage(item.page);
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "🗑️";

      deleteButton.addEventListener("click", () => {
        bookmarks.splice(index, 1);
        saveBookmarks();
        panel.remove();
        showBookmarks();
      });

      actions.append(openButton, deleteButton);
      entry.append(info, actions);
      panel.appendChild(entry);
    });

    viewer.appendChild(panel);
  }
   
  /* =================================
     AFFICHER LE CARNET DE NOTES
  ================================= */

  function showNotes() {
    if (!viewer || !pdfDocument) return;

    const oldPanel = viewer.querySelector(
      "#atlas-pdf-notes-panel"
    );

    if (oldPanel) oldPanel.remove();

    const panel = document.createElement("div");
    panel.id = "atlas-pdf-notes-panel";

    panel.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 20;
      background: #102b46;
      padding: 20px;
      overflow-y: auto;
      color: white;
    `;

    const header = document.createElement("div");

    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    `;

    const title = document.createElement("strong");
    title.textContent = "📝 Mes notes personnelles";

    const closeButton = document.createElement("button");
    closeButton.textContent = "✕";

    closeButton.addEventListener("click", () => {
      panel.remove();
    });

    header.append(title, closeButton);
    panel.appendChild(header);

    const pageInfo = document.createElement("p");
    pageInfo.textContent =
      `${currentDocumentTitle} — Page ${currentPage}`;

    panel.appendChild(pageInfo);

    const textarea = document.createElement("textarea");

    textarea.placeholder =
      "Écris ici tes remarques, explications et éléments à mémoriser...";

    textarea.style.cssText = `
      width: 100%;
      min-height: 180px;
      box-sizing: border-box;
      padding: 14px;
      border-radius: 10px;
      border: 2px solid #2dd4bf;
      background: white;
      color: #102b46;
      font-size: 16px;
      resize: vertical;
    `;

    const existingNote = pageNotes.find(item =>
      item.url === currentDocumentURL &&
      item.page === currentPage
    );

    textarea.value = existingNote
      ? existingNote.content
      : "";

    panel.appendChild(textarea);

    const saveButton = document.createElement("button");
    saveButton.textContent = "💾 Enregistrer ma note";

    saveButton.style.cssText = `
      display: block;
      width: 100%;
      margin-top: 14px;
      padding: 14px;
      background: #2dd4bf;
      color: #102b46;
    `;

    saveButton.addEventListener("click", () => {
      const content = textarea.value.trim();

      const index = pageNotes.findIndex(item =>
        item.url === currentDocumentURL &&
        item.page === currentPage
      );

      if (!content) {
        if (index !== -1) {
          pageNotes.splice(index, 1);
        }
      } else {
        const note = {
          url: currentDocumentURL,
          title: currentDocumentTitle,
          page: currentPage,
          content: content,
          date: new Date().toISOString()
        };

        if (index !== -1) {
          pageNotes[index] = note;
        } else {
          pageNotes.push(note);
        }
      }

      savePageNotes();

      saveButton.textContent = "✓ Note enregistrée !";

      setTimeout(() => {
        if (saveButton.isConnected) {
          saveButton.textContent = "💾 Enregistrer ma note";
        }
      }, 2000);
    });

    panel.appendChild(saveButton);

    viewer.appendChild(panel);
  }

  /* =================================
     BIBLIOTHÈQUE DE TOUTES LES NOTES
  ================================= */

  function showAllNotes() {
    if (!viewer) return;

    const oldPanel = viewer.querySelector(
      "#atlas-pdf-all-notes-panel"
    );

    if (oldPanel) oldPanel.remove();

    const panel = document.createElement("div");
    panel.id = "atlas-pdf-all-notes-panel";

    panel.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 30;
      background: #102b46;
      padding: 20px;
      overflow-y: auto;
      color: white;
    `;

    const header = document.createElement("div");

    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    `;

    const title = document.createElement("strong");
    title.textContent = "📚 Toutes mes notes";

    const closeButton = document.createElement("button");
    closeButton.textContent = "✕";

    closeButton.addEventListener("click", () => {
      panel.remove();
    });

    header.append(title, closeButton);
    panel.appendChild(header);

    if (pageNotes.length === 0) {
      const empty = document.createElement("p");
      empty.textContent =
        "Aucune note enregistrée pour le moment.";
      panel.appendChild(empty);
    }

    const sortedNotes = [...pageNotes].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    sortedNotes.forEach(note => {
      const entry = document.createElement("div");

      entry.style.cssText = `
        padding: 14px;
        margin-bottom: 12px;
        background: #183c5b;
        border-radius: 10px;
      `;

      const documentTitle = document.createElement("strong");
      documentTitle.textContent = note.title;

      const page = document.createElement("p");
      page.textContent = `📖 Page ${note.page}`;

      const content = document.createElement("p");
      content.textContent = note.content;
      content.style.cssText = `
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        color: #e0f5f1;
      `;

      const openButton = document.createElement("button");
      openButton.textContent = "📖 Ouvrir cette page";

      openButton.addEventListener("click", async () => {
        panel.remove();
        await open(note.url, note.title);
        await goToPage(note.page);
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "🗑️ Supprimer";
      deleteButton.style.marginLeft = "8px";

      deleteButton.addEventListener("click", () => {
        const index = pageNotes.findIndex(item =>
          item.url === note.url &&
          item.page === note.page
        );

        if (index !== -1) {
          pageNotes.splice(index, 1);
          savePageNotes();
        }

        panel.remove();
        showAllNotes();
      });

      entry.append(
        documentTitle,
        page,
        content,
        openButton,
        deleteButton
      );

      panel.appendChild(entry);
    });

    viewer.appendChild(panel);
  }

  function toggleThumbnails() {
    if (!viewer) return;

    const panel = viewer.querySelector(
      "#atlas-pdf-thumbnails-panel"
    );

    panel.hidden = !panel.hidden;

    if (!panel.hidden) {
      generateThumbnails();
    }
  }

  /* GÉNÉRER LES MINIATURES */

  async function generateThumbnails() {
    if (!pdfDocument || !viewer) return;

    const list = viewer.querySelector(
      "#atlas-pdf-thumbnails-list"
    );

    if (list.dataset.generated === "true") return;

    list.innerHTML = "Chargement des miniatures...";

    try {
      list.innerHTML = "";

      for (
        let number = 1;
        number <= pdfDocument.numPages;
        number++
      ) {
        if (!viewer || !pdfDocument) return;

        const page = await pdfDocument.getPage(number);

        const thumbnail = document.createElement("button");
        thumbnail.type = "button";
        thumbnail.className = "pdf-thumbnail";

        if (number === currentPage) {
          thumbnail.classList.add("active");
        }

        const preview = document.createElement("canvas");
        const viewport = page.getViewport({ scale: 0.22 });

        preview.width = Math.floor(viewport.width);
        preview.height = Math.floor(viewport.height);

        thumbnail.appendChild(preview);

        const label = document.createElement("span");
        label.textContent = `Page ${number}`;

        thumbnail.appendChild(label);

        /* CLIC SUR UNE MINIATURE */

        thumbnail.addEventListener("click", () => {
          list.querySelectorAll(".pdf-thumbnail").forEach(item => {
            item.classList.remove("active");
          });

          thumbnail.classList.add("active");

          viewer.querySelector(
            "#atlas-pdf-thumbnails-panel"
          ).hidden = true;

          goToPage(number);
        });

        list.appendChild(thumbnail);

        await page.render({
          canvasContext: preview.getContext("2d"),
          viewport: viewport
        }).promise;
      }

      list.dataset.generated = "true";

    } catch (error) {
      console.error("Atlas miniatures :", error);
      list.textContent =
        "Impossible de charger les miniatures.";
    }
  }

  /* MESSAGE DU LECTEUR */

  function showMessage(message) {
    const element = viewer.querySelector("#atlas-pdf-message");

    element.textContent = message;
    element.hidden = false;
    canvas.hidden = true;
  }

  /* AFFICHER UNE PAGE */

  async function renderPage() {
    if (!pdfDocument || !viewer) return;

    if (renderTask) {
      renderTask.cancel();
      renderTask = null;
    }

    const page = await pdfDocument.getPage(currentPage);

    const content = viewer.querySelector("#atlas-pdf-content");

    const originalViewport = page.getViewport({ scale: 1 });

    const availableWidth = Math.max(
      200,
      content.clientWidth - 28
    );

    const fitScale = availableWidth / originalViewport.width;
    const scale = Math.min(fitScale, 1.5) * zoom;

    const viewport = page.getViewport({ scale });

    const context = canvas.getContext("2d");

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    canvas.hidden = false;

    viewer.querySelector("#atlas-pdf-message").hidden = true;

    viewer.querySelector("#atlas-pdf-info").textContent =
      `Page ${currentPage} / ${pdfDocument.numPages}`;

    /* PROGRESSION */

    const progress = Math.round(
      (currentPage / pdfDocument.numPages) * 100
    );

    viewer.querySelector(
      "#atlas-pdf-progress-fill"
    ).style.width = `${progress}%`;

    viewer.querySelector(
      "#atlas-pdf-progress-label"
    ).textContent = `Lecture : ${progress}%`;

    /* SYNCHRONISATION DES MINIATURES */

    const thumbnails = viewer.querySelectorAll(".pdf-thumbnail");

    thumbnails.forEach((thumbnail, index) => {
      thumbnail.classList.toggle(
        "active",
        index + 1 === currentPage
      );
    });
updateBookmarkButton();
    viewer.querySelector("#atlas-pdf-prev").disabled =
      currentPage <= 1;

    viewer.querySelector("#atlas-pdf-next").disabled =
      currentPage >= pdfDocument.numPages;

    const task = page.render({
      canvasContext: context,
      viewport: viewport
    });

    renderTask = task;

    try {
      await task.promise;
    } catch (error) {
      if (error.name !== "RenderingCancelledException") {
        showMessage(
          "Erreur pendant l'affichage de cette page."
        );
      }
    } finally {
      if (renderTask === task) {
        renderTask = null;
      }
    }
  }

  /* NAVIGATION ENTRE LES PAGES */

  async function goToPage(number) {
    if (!pdfDocument) return;

    currentPage = Math.max(
      1,
      Math.min(number, pdfDocument.numPages)
    );

    try {
      await renderPage();

      if (viewer) {
        viewer.querySelector(
          "#atlas-pdf-content"
        ).scrollTop = 0;
      }

    } catch (error) {
      if (viewer) {
        showMessage("Impossible d'afficher cette page.");
      }
    }
  }

  /* ZOOM */

  function changeZoom(amount) {
    zoom = Math.max(
      0.6,
      Math.min(2.5, zoom + amount)
    );

    renderPage();
  }

  /* CLAVIER */

  function keyboardNavigation(event) {
    if (!viewer) return;

    if (event.key === "Escape") close();

    if (event.key === "ArrowRight") {
      goToPage(currentPage + 1);
    }

    if (event.key === "ArrowLeft") {
      goToPage(currentPage - 1);
    }
  }

  /* FERMER LE LECTEUR */

  function close() {
    if (renderTask) {
      renderTask.cancel();
      renderTask = null;
    }

    if (pdfDocument) {
      pdfDocument.destroy();
      pdfDocument = null;
    }

    if (viewer) {
      viewer.remove();
      viewer = null;
      canvas = null;
    }

    document.removeEventListener(
      "keydown",
      keyboardNavigation
    );

    document.body.style.overflow = "";
  }

  /* OUVRIR UN DOCUMENT */

  async function open(url, title) {
    createViewer();
    currentDocumentURL = new URL(url, document.baseURI).href;
    currentDocumentTitle = title || "Atlas Médical — Document";
    document.body.style.overflow = "hidden";

    viewer.querySelector("#atlas-pdf-title").textContent =
      title || "Atlas Médical — Document";

    currentPage = 1;
    zoom = 1;

    /* RÉINITIALISER LES MINIATURES */

    const list = viewer.querySelector(
      "#atlas-pdf-thumbnails-list"
    );

    list.innerHTML = "";
    delete list.dataset.generated;

    viewer.querySelector(
      "#atlas-pdf-thumbnails-panel"
    ).hidden = true;

    showMessage("Chargement du document...");

    if (pdfDocument) {
      await pdfDocument.destroy();
      pdfDocument = null;
    }

    try {
      const pdfjs = await loadPDFJS();

      const absoluteURL = new URL(
        url,
        document.baseURI
      ).href;

      pdfDocument = await pdfjs.getDocument({
        url: absoluteURL
      }).promise;

      await goToPage(1);

    } catch (error) {
      console.error("Atlas PDF:", error);

      showMessage(
        "Impossible d'ouvrir ce document. Vérifie ta connexion Internet."
      );
    }
  }

  window.AtlasPDFReader = {
    open,
    close
  };

})();
