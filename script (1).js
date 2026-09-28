/* ==========================================================================
   TechAsItIs — script.js
   Vanilla JavaScript, no dependencies.
   1. Footer year
   2. Header shadow on scroll
   3. Mobile navigation
   4. Active section highlight in nav
   5. Hero "look underneath" toggle
   ========================================================================== */

(function () {
  "use strict";

  /* 1. Footer year ---------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 2. Header shadow on scroll ---------------------------------------------- */
  var header = document.querySelector(".site-header");
  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* 3. Mobile navigation ---------------------------------------------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var mobileQuery = window.matchMedia("(max-width: 860px)");

  function setNav(open) {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after choosing a link
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });

    // Close with Escape and return focus to the button
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        navToggle.focus();
      }
    });

    // Reset when resizing up to desktop
    mobileQuery.addEventListener("change", function (e) {
      if (!e.matches) setNav(false);
    });

    // While the mobile menu is closed, keep its links out of the tab order
    function syncNavFocus() {
      var hidden = mobileQuery.matches && navToggle.getAttribute("aria-expanded") !== "true";
      if (hidden) { nav.setAttribute("inert", ""); } else { nav.removeAttribute("inert"); }
    }
    syncNavFocus();
    new MutationObserver(syncNavFocus).observe(navToggle, { attributes: true, attributeFilter: ["aria-expanded"] });
    mobileQuery.addEventListener("change", syncNavFocus);
  }

  /* 4. Active section highlight in nav -------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav__list a"));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var match = link.getAttribute("href") === "#" + entry.target.id;
          if (match) { link.setAttribute("aria-current", "true"); } else { link.removeAttribute("aria-current"); }
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (section) { observer.observe(section); });
  }
})();
