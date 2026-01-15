document.addEventListener("DOMContentLoaded", () => {
  // Determine base path for partials (handles subdirectories like /services/)
  const basePath = getBasePath();

  // Load mobile components first, then header with callback
  includePart("mobile-menu-toggle", basePath + "partials/mobile-menu-toggle.html", () => {
    includePart("mobile-menu", basePath + "partials/mobile-menu.html", () => {
      includePart("header", basePath + "partials/header.html", initHeader);
    });
  });
  includePart("emergency-banner", basePath + "partials/emergency-banner.html");
  includePart("footer", basePath + "partials/footer.html");
});

function getBasePath() {
  const path = window.location.pathname;
  // Count directory depth (how many folders deep we are)
  const segments = path.split('/').filter(s => s && !s.includes('.html'));
  if (segments.length === 0) return '';
  // For each directory level, add ../
  return '../'.repeat(segments.length);
}

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
  // Mobile menu elements
  const header = document.getElementById("header");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileMenuMain = document.getElementById("mobileMenuMain");
  const mobileMenuServices = document.getElementById("mobileMenuServices");
  const openServicesBtn = document.getElementById("openServicesMenu");

  // Check if elements exist
  if (!mobileMenuToggle || !mobileMenu) {
    console.warn("Mobile menu elements not found");
    return;
  }

  // State tracking
  let isServicesOpen = false;

  // Toggle button click handler
  mobileMenuToggle.addEventListener("click", function () {
    if (isServicesOpen) {
      // If services submenu is open, go back to main menu
      showMainMenu();
    } else if (mobileMenu.classList.contains("active")) {
      // If main menu is open, close it
      closeMobileMenu();
    } else {
      // Open menu
      openMobileMenu();
    }
  });

  // Open mobile menu
  function openMobileMenu() {
    mobileMenuToggle.classList.add("active");
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";
    showMainMenu();
  }

  // Close mobile menu
  function closeMobileMenu() {
    mobileMenuToggle.classList.remove("active");
    mobileMenuToggle.classList.remove("services-mode");
    mobileMenu.classList.remove("active");
    mobileMenu.classList.remove("services-open");
    document.body.style.overflow = "";
    isServicesOpen = false;
    // Reset panels
    if (mobileMenuMain) mobileMenuMain.classList.remove("hidden");
    if (mobileMenuServices) mobileMenuServices.classList.remove("active");
  }

  // Show main menu panel
  function showMainMenu() {
    isServicesOpen = false;
    mobileMenuToggle.classList.remove("services-mode");
    mobileMenu.classList.remove("services-open");
    if (mobileMenuMain) mobileMenuMain.classList.remove("hidden");
    if (mobileMenuServices) mobileMenuServices.classList.remove("active");
  }

  // Show services submenu panel
  function showServicesMenu() {
    isServicesOpen = true;
    mobileMenuToggle.classList.add("services-mode");
    mobileMenu.classList.add("services-open");
    if (mobileMenuMain) mobileMenuMain.classList.add("hidden");
    if (mobileMenuServices) mobileMenuServices.classList.add("active");
  }

  // Open services submenu
  if (openServicesBtn) {
    openServicesBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showServicesMenu();
    });
  }

  // Close mobile menu when clicking on overlay
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", closeMobileMenu);
  }

  // Close mobile menu when clicking on a navigation link (not the services button)
  const mobileMenuLinks = mobileMenu.querySelectorAll("a:not(.has-submenu)");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
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
      if (isServicesOpen) {
        showMainMenu();
      } else {
        closeMobileMenu();
      }
    }
  });

  // Set home link based on environment
  // For file:// protocol, we need relative paths; otherwise use absolute /
  const isFileProtocol = location.protocol === "file:";

  if (isFileProtocol) {
    const basePath = getBasePath();
    document.querySelectorAll(".home-link").forEach((link) => {
      link.setAttribute("href", basePath + "index.html");
    });
    // Also fix other absolute links for file:// protocol
    document.querySelectorAll('a[href^="/"]').forEach((link) => {
      const href = link.getAttribute("href");
      if (href === "/") {
        link.setAttribute("href", basePath + "index.html");
      } else {
        link.setAttribute("href", basePath + href.substring(1));
      }
    });
  }
}
