/**
 * PRITI KUMARI | PORTFOLIO JAVASCRIPT
 * Phase 1: Header behavior, mobile menu toggle, and active navigation
 */

(() => {
  "use strict";

  // Cache DOM element references
  const header = document.getElementById("header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  /* --------------------------------------------------------------------------
     1. STICKY HEADER GLASSMORPHISM ON SCROLL
     -------------------------------------------------------------------------- */
  const handleHeaderScroll = () => {
    if (!header) return;
    const isScrolled = window.scrollY > 20;
    header.classList.toggle("scrolled", isScrolled);
  };

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  // Initial check on load
  handleHeaderScroll();

  /* --------------------------------------------------------------------------
     2. ACCESSIBLE MOBILE MENU TOGGLE
     -------------------------------------------------------------------------- */
  const toggleMobileMenu = (forceState) => {
    if (!navMenu || !navToggle) return;

    const isOpen = typeof forceState === "boolean" 
      ? forceState 
      : !navMenu.classList.contains("open");

    navMenu.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close Navigation Menu" : "Open Navigation Menu"
    );
    document.body.classList.toggle("menu-open", isOpen);
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => toggleMobileMenu());
  }

  // Close mobile menu whenever a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu && navMenu.classList.contains("open")) {
        toggleMobileMenu(false);
      }
    });
  });

  // Close mobile menu when ESC key is pressed
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu && navMenu.classList.contains("open")) {
      toggleMobileMenu(false);
      if (navToggle) navToggle.focus();
    }
  });

  // Auto-close menu if viewport expands beyond mobile breakpoint
  const mobileQuery = window.matchMedia("(min-width: 769px)");
  mobileQuery.addEventListener("change", (e) => {
    if (e.matches && navMenu && navMenu.classList.contains("open")) {
      toggleMobileMenu(false);
    }
  });

  /* --------------------------------------------------------------------------
     3. ACTIVE NAVIGATION LINK HIGHLIGHTING (INTERSECTION OBSERVER)
     --------------------------------------------------------------------------
     Works dynamically: observes any section currently present in the DOM.
     As you add #about, #skills, #projects, etc. in upcoming phases,
     this automatically tracks and highlights them without editing script.js.
  */
  const validSections = navLinks
    .map((link) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        return document.querySelector(targetId);
      }
      return null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && validSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "-35% 0px -50% 0px", // Trigger when section is in middle of viewport
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === currentId;
            link.classList.toggle("active", isActive);
            if (isActive) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        }
      });
    }, observerOptions);

    validSections.forEach((section) => sectionObserver.observe(section));
  }

  /* --------------------------------------------------------------------------
     4. DYNAMIC COPYRIGHT YEAR
     -------------------------------------------------------------------------- */
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
})();