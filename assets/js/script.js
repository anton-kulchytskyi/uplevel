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
  .querySelectorAll(".hero-content, .hero-image, .feature-card")
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
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector(".why-choose-us");
  const speed = scrolled * 5;
  parallax.style.transform = `translateY(${speed}px)`;
});

const valueCards = document.querySelectorAll(".about-value-card");
valueCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
});
