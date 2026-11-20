/* =========================================================
   ATLAS MÉDICAL — INTERACTIONS DE LA MAQUETTE AUTONOME
   Aucun accès aux données de l'application existante.
========================================================= */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Valeur de démonstration : à relier plus tard aux données réelles.
  const progression = 78;
  const numero = document.querySelector("[data-am-progress-number]");
  const libelle = document.querySelector("[data-am-progress-label]");
  const anneau = document.querySelector(".am-ring-value");
  const cercle = 2 * Math.PI * 49;

  let mention = "À améliorer";
  if (progression >= 75) mention = "Excellent ! 🏆";
  else if (progression >= 50) mention = "Bien";

  if (numero) numero.textContent = String(progression);
  if (libelle) libelle.textContent = mention;

  if (anneau) {
    anneau.style.strokeDasharray = String(cercle);
    anneau.style.strokeDashoffset = String(cercle);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        anneau.style.strokeDashoffset = String(cercle * (1 - progression / 100));
      });
    });
  }

  // Un seul onglet de navigation est visuellement actif à la fois.
  const navItems = document.querySelectorAll(".am-nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((other) => {
        other.classList.remove("is-active");
        other.removeAttribute("aria-current");
      });
      item.classList.add("is-active");
      item.setAttribute("aria-current", "page");
    });
  });

  // Petit retour tactile visuel sur les raccourcis.
  document.querySelectorAll(".am-shortcut").forEach((shortcut) => {
    shortcut.addEventListener("pointerdown", () => {
      shortcut.style.transform = "scale(.97)";
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
      shortcut.addEventListener(eventName, () => {
        shortcut.style.transform = "";
      });
    });
  });
});
