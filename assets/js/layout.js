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

  const isLocalhost =
    location.hostname === "127.0.0.1" ||
    location.hostname === "localhost" ||
    location.protocol === "file:";

  const homeUrl = isLocalhost
    ? "index.html"
    : "https://uplevel-restoration.netlify.app/";

  document.querySelectorAll(".home-link").forEach((link) => {
    link.setAttribute("href", homeUrl);
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document
  .querySelectorAll(
    ".hero-content, .hero-image, .feature-card, .about-hero-section, .about-content-card, .about-value-card, .about-cta-section"
  )
  .forEach((el) => {
    observer.observe(el);
  });

// Observe feature cards for animation
// document.querySelectorAll(".feature-card").forEach((card) => {
//   observer.observe(card);
// });

// Додаткові ефекти при кліку
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("click", function () {
    this.style.transform = "translateY(-10px) scale(1.05)";
    setTimeout(() => {
      this.style.transform = "";
    }, 200);
  });
});

// Паралакс ефект при скролі
// window.addEventListener("scroll", () => {
//   const scrolled = window.pageYOffset;
//   const parallax = document.querySelector(".why-choose-us");
//   const speed = scrolled * 0.5;
//   parallax.style.transform = `translateY(${speed}px)`;
// });

const valueCards = document.querySelectorAll(".about-value-card");
valueCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
});
