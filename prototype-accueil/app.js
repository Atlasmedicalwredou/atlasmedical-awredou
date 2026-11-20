/* ATLAS MÉDICAL — interactions de la maquette autonome */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const progression = 78;
  const number = document.querySelector("[data-am-progress-number]");
  const label = document.querySelector("[data-am-progress-label]");
  const ring = document.querySelector(".am-ring-fill");
  const circumference = 2 * Math.PI * 49;

  if (number) number.textContent = String(progression);
  if (label) label.textContent = progression >= 75 ? "Excellent ! 🏆" : progression >= 50 ? "Bien" : "À améliorer";

  if (ring) {
    ring.style.strokeDasharray = String(circumference);
    ring.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      ring.style.strokeDashoffset = String(circumference * (1 - progression / 100));
    }));
  }

  const navItems = document.querySelectorAll(".am-nav-item");
  navItems.forEach(item => item.addEventListener("click", () => {
    navItems.forEach(other => {
      other.classList.remove("is-active");
      other.removeAttribute("aria-current");
    });
    item.classList.add("is-active");
    item.setAttribute("aria-current", "page");
  }));

  document.querySelectorAll(".am-shortcut").forEach(item => {
    item.addEventListener("pointerdown", () => item.style.transform = "scale(.97)");
    ["pointerup", "pointercancel", "pointerleave"].forEach(eventName => {
      item.addEventListener(eventName, () => item.style.transform = "");
    });
  });
});
