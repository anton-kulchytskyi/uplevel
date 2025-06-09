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

// Add transition delay for value cards
const valueCards = document.querySelectorAll(".about-value-card");
valueCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
});

// Phone number formatting function
function formatPhoneNumber(phoneNumber) {
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6,
      10
    )}`;
  }
}

// Apply phone formatting on input
document.getElementById("phone").addEventListener("input", function (e) {
  const formatted = formatPhoneNumber(e.target.value);
  e.target.value = formatted;
});

// Form submission handler
const handleSubmit = (event) => {
  event.preventDefault();

  const myForm = event.target;
  const formData = new FormData(myForm);

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
    .then(() => {
      // Show success modal
      document.getElementById("successModal").classList.add("show");
    })
    .catch((error) => {
      alert("Something went wrong. Please try again.");
      console.error("Error:", error);
    });
};

// Close modal and clear form
function closeModal() {
  document.getElementById("successModal").classList.remove("show");
  // Clear form after modal closes
  setTimeout(() => {
    document.getElementById("contactForm").reset();
  }, 300);
}

// Event listeners
document.querySelector("form").addEventListener("submit", handleSubmit);
document.getElementById("closeModal").addEventListener("click", closeModal);

// Close modal on overlay click
document.getElementById("successModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Close modal on Escape key
document.addEventListener("keydown", function (e) {
  if (
    e.key === "Escape" &&
    document.getElementById("successModal").classList.contains("show")
  ) {
    closeModal();
  }
});
