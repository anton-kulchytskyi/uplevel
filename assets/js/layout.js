document.addEventListener("DOMContentLoaded", () => {
  includePart("header", "partials/header.html", initHeader);
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
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay");
  const header = document.getElementById("header");

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

  // Initialize Chamber of Commerce Widget
  loadChamberWidget();
}

function loadChamberWidget() {
  // Check if widget container exists
  const widgetContainer = document.getElementById(
    "mni-membership-639038444562952735"
  );
  if (!widgetContainer) {
    console.log("Chamber widget container not found");
    return;
  }

  // Load Chamber script if not already loaded
  if (typeof MNI === "undefined") {
    const script = document.createElement("script");
    script.src =
      "https://saskatoonchamber.chambermaster.com/Content/Script/Member.js";
    script.type = "text/javascript";
    script.onload = function () {
      console.log("Chamber script loaded");
      // Wait a bit for MNI object to be fully initialized
      setTimeout(() => {
        initChamberWidget();
      }, 100);
    };
    script.onerror = function () {
      console.error("Failed to load Chamber script");
    };
    document.head.appendChild(script);
  } else {
    initChamberWidget();
  }
}

function initChamberWidget() {
  if (typeof MNI !== "undefined" && MNI.Widgets && MNI.Widgets.Member) {
    try {
      console.log("Initializing Chamber widget...");
      new MNI.Widgets.Member("mni-membership-639038444562952735", {
        member: 8663,
        styleTemplate:
          "#@id{text-align:center;position:relative}#@id .mn-widget-member-name{font-weight:700}#@id .mn-widget-member-logo{max-width:100%}",
      }).create();
      console.log("Chamber widget initialized");
    } catch (error) {
      console.error("Chamber widget initialization error:", error);
    }
  } else {
    console.log(
      "MNI object not ready:",
      typeof MNI,
      MNI?.Widgets,
      MNI?.Widgets?.Member
    );
  }
}
