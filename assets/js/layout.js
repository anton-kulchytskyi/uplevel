document.addEventListener("DOMContentLoaded", () => {
  // Load mobile components first, then header with callback
  includePart("mobile-menu-toggle", "partials/mobile-menu-toggle.html", () => {
    includePart("mobile-menu", "partials/mobile-menu.html", () => {
      includePart("header", "partials/header.html", initHeader);
    });
  });
  includePart("emergency-banner", "partials/emergency-banner.html");
  includePart("footer", "partials/footer.html");
});

function includePart(id, file, callback) {
  fetch(file)
    .then((res) => res.text())
    .then((data) => {
      const el = document.getElementById(id);
      el.innerHTML = data;
      el.classList.add("loaded");
      if (typeof callback === "function") callback();
    })
    .catch((err) => console.error("Error loading:", file, err));
}

function initHeader() {
  // Mobile menu toggle
  const header = document.getElementById("header");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");

  // Check if elements exist
  if (!mobileMenuToggle || !mobileMenu) {
    console.warn("Mobile menu elements not found");
    return;
  }

  // Toggle mobile menu
  mobileMenuToggle.addEventListener("click", function () {
    mobileMenuToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "";
  });

  // Close mobile menu when clicking on overlay
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", function () {
      mobileMenuToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Close mobile menu when clicking on a link
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenuToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Header scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Close mobile menu on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      mobileMenuToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Set home link based on environment
  const isLocalhost =
    location.hostname === "127.0.0.1" ||
    location.hostname === "localhost" ||
    location.protocol === "file:";

  const homeUrl = isLocalhost
    ? "index.html"
    : "https://uplevel-restoration.netlify.app/"; // Update this URL to your production site

  document.querySelectorAll(".home-link").forEach((link) => {
    link.setAttribute("href", homeUrl);
  });
}
