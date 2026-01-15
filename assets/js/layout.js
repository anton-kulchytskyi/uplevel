document.addEventListener("DOMContentLoaded", () => {
  // Determine base path for partials (handles subdirectories like /services/)
  const basePath = getBasePath();

  // Load mobile components first, then header with callback
  includePart(
    "mobile-menu-toggle",
    basePath + "partials/mobile-menu-toggle.html",
    () => {
      includePart("mobile-menu", basePath + "partials/mobile-menu.html", () => {
        includePart("header", basePath + "partials/header.html", initHeader);
      });
    }
  );
  includePart("emergency-banner", basePath + "partials/emergency-banner.html");
  includePart("footer", basePath + "partials/footer.html");

  // Load breadcrumbs if container exists
  const breadcrumbsContainer = document.getElementById("breadcrumbs");
  if (breadcrumbsContainer) {
    includePart("breadcrumbs", basePath + "partials/breadcrumbs.html", generateBreadcrumbs);
  }
});

function getBasePath() {
  const path = window.location.pathname;
  // Count directory depth (how many folders deep we are)
  const segments = path.split("/").filter((s) => s && !s.includes(".html"));
  if (segments.length === 0) return "";
  // For each directory level, add ../
  return "../".repeat(segments.length);
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

// Generate breadcrumbs based on URL path
function generateBreadcrumbs() {
  const breadcrumbsList = document.getElementById("breadcrumbsList");
  if (!breadcrumbsList) return;

  const path = window.location.pathname;
  const isFileProtocol = location.protocol === "file:";
  const basePath = getBasePath();

  // Page name mappings (support both with and without .html)
  const pageNames = {
    "about": "About Us",
    "about.html": "About Us",
    "services": "Services",
    "services.html": "Services",
    "contact": "Contact",
    "contact.html": "Contact",
    "emergency-restoration": "Emergency Restoration",
    "emergency-restoration.html": "Emergency Restoration",
    "water-damage-restoration": "Water Damage Restoration",
    "water-damage-restoration.html": "Water Damage Restoration",
    "fire-smoke-damage-restoration": "Fire & Smoke Damage",
    "fire-smoke-damage-restoration.html": "Fire & Smoke Damage",
    "mold-remediation": "Mold Remediation",
    "mold-remediation.html": "Mold Remediation",
    "contents-pack-out-services": "Contents & Pack-Out",
    "contents-pack-out-services.html": "Contents & Pack-Out",
    "reconstruction-after-loss": "Reconstruction",
    "reconstruction-after-loss.html": "Reconstruction"
  };

  // Build breadcrumbs array
  const breadcrumbs = [];

  // Always start with Home
  const homeUrl = isFileProtocol ? basePath + "index.html" : "/";
  breadcrumbs.push({ label: "Home", url: homeUrl });

  // Parse path segments (remove empty, index, index.html)
  const segments = path
    .split("/")
    .filter((s) => s && s !== "index.html" && s !== "index")
    .map((s) => s.replace(".html", "")); // normalize by removing .html

  // Check if we're in a subdirectory (like /services/)
  const isInServicesDir = segments.includes("services");

  if (isInServicesDir && segments.length > 1) {
    // Add Services link (only if we're on a service subpage)
    const servicesUrl = isFileProtocol ? basePath + "services.html" : "/services.html";
    breadcrumbs.push({ label: "Services", url: servicesUrl });
  }

  // Get current page (last segment)
  const currentPage = segments[segments.length - 1];
  if (currentPage && currentPage !== "index") {
    // Try to find name in mappings, fallback to formatting
    const pageName = pageNames[currentPage] || formatPageName(currentPage);
    breadcrumbs.push({ label: pageName, url: null }); // null = current page, no link
  }

  // Render breadcrumbs
  breadcrumbsList.innerHTML = breadcrumbs
    .map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1;
      const separator = !isLast ? '<span class="breadcrumbs-separator">›</span>' : "";

      if (crumb.url && !isLast) {
        return `<li class="breadcrumbs-item"><a href="${crumb.url}">${crumb.label}</a>${separator}</li>`;
      } else {
        return `<li class="breadcrumbs-item current">${crumb.label}</li>`;
      }
    })
    .join("");
}

// Format page name from filename (fallback)
function formatPageName(filename) {
  return filename
    .replace(".html", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
