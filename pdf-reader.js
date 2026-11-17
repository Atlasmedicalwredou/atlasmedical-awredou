
/* =========================================
   ATLAS MÉDICAL — LECTEUR PDF INTÉGRÉ
   Moteur PDF.js — version 1.0
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
          reject(new Error("Le moteur PDF.js n'a pas été chargé."));
          return;
        }

        window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
        resolve(window.pdfjsLib);
      };

      script.onerror = () => {
        loadingPromise = null;
        reject(new Error("Impossible de charger le moteur PDF.js."));
      };

      document.head.appendChild(script);
    });

    return loadingPromise;
  }

  function createViewer() {
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
    ← Retour à la bibliothèque
  </button>
  <div class="pdf-title" id="atlas-pdf-title">
    Atlas Médical — Document
  </div>
</div>

        <button type="button" id="atlas-pdf-close">
          ✕ Fermer
        </button>
      </div>

      <div class="pdf-toolbar">
        <button type="button" id="atlas-pdf-prev">◀</button>
        <span class="pdf-page-info" id="atlas-pdf-info">
          Page 1 / 1
        </span>
        <button type="button" id="atlas-pdf-next">▶</button>
        <button type="button" id="atlas-pdf-minus">−</button>
        <button type="button" id="atlas-pdf-plus">+</button>
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

    document.addEventListener("keydown", keyboardNavigation);
  }

  function showMessage(message) {
    const element = viewer.querySelector("#atlas-pdf-message");
    element.textContent = message;
    element.hidden = false;
    canvas.hidden = true;
  }

  async function renderPage() {
    if (!pdfDocument) return;

    if (renderTask) {
      renderTask.cancel();
      renderTask = null;
    }

    const page = await pdfDocument.getPage(currentPage);
    const content = viewer.querySelector("#atlas-pdf-content");

    const originalViewport = page.getViewport({ scale: 1 });
    const availableWidth = Math.max(200, content.clientWidth - 28);
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

    viewer.querySelector("#atlas-pdf-prev").disabled =
      currentPage <= 1;

    viewer.querySelector("#atlas-pdf-next").disabled =
      currentPage >= pdfDocument.numPages;

    renderTask = page.render({
      canvasContext: context,
      viewport: viewport
    });

    try {
      await renderTask.promise;
    } catch (error) {
      if (error.name !== "RenderingCancelledException") {
        showMessage("Erreur pendant l'affichage de cette page.");
      }
    }

    renderTask = null;
  }

  async function goToPage(number) {
    if (!pdfDocument) return;

    currentPage = Math.max(
      1,
      Math.min(number, pdfDocument.numPages)
    );

    try {
      await renderPage();
      viewer.querySelector("#atlas-pdf-content").scrollTop = 0;
    } catch (error) {
      showMessage("Impossible d'afficher cette page.");
    }
  }

  function changeZoom(amount) {
    zoom = Math.max(0.6, Math.min(2.5, zoom + amount));
    renderPage();
  }

  function keyboardNavigation(event) {
    if (!viewer) return;

    if (event.key === "Escape") close();
    if (event.key === "ArrowRight") goToPage(currentPage + 1);
    if (event.key === "ArrowLeft") goToPage(currentPage - 1);
  }

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

    document.removeEventListener("keydown", keyboardNavigation);
    document.body.style.overflow = "";
  }

  async function open(url, title) {
    createViewer();

    document.body.style.overflow = "hidden";
    viewer.querySelector("#atlas-pdf-title").textContent =
      title || "Atlas Médical — Document";

    currentPage = 1;
    zoom = 1;
    showMessage("Chargement du document...");

    if (pdfDocument) {
      await pdfDocument.destroy();
      pdfDocument = null;
    }

    try {
      const pdfjs = await loadPDFJS();
      const absoluteURL = new URL(url, document.baseURI).href;

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

  window.AtlasPDFReader = { open, close };

})();

