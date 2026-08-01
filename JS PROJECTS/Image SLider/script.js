/* =============================================
   Image Slider - JavaScript
   Features: Navigation, Dots, Counter, Auto-Advance
   ============================================= */

// --- Sample Data ---
const slides = [
  {
    image: "https://picsum.photos/seed/mountain/800/450",
    title: "Mountain Retreat",
    description: "A serene mountain landscape captured at golden hour, showcasing nature's breathtaking beauty."
  },
  {
    image: "https://picsum.photos/seed/ocean/800/450",
    title: "Ocean Horizon",
    description: "Endless waves meeting the sky — a peaceful escape into the vastness of the deep blue."
  },
  {
    image: "https://picsum.photos/seed/forest/800/450",
    title: "Forest Path",
    description: "Sunlight filtering through ancient trees along a quiet woodland trail."
  },
  {
    image: "https://picsum.photos/seed/architecture/800/450",
    title: "Urban Geometry",
    description: "Modern architecture rising against the skyline, where form meets function."
  },
  {
    image: "https://picsum.photos/seed/aurora/800/450",
    title: "Northern Lights",
    description: "Dancing curtains of green and purple illuminating the Arctic night sky."
  }
];

// --- DOM References ---
const imageEl      = document.getElementById("image");
const titleEl      = document.getElementById("title");
const descEl       = document.getElementById("description");
const counterEl    = document.getElementById("counter");
const prevBtn      = document.getElementById("prevBtn");
const nextBtn      = document.getElementById("nextBtn");
const dots         = document.querySelectorAll("#dots .slider__dot");
const sliderEl     = document.querySelector(".slider");

// --- State ---
let currentIndex   = 0;
let autoAdvanceId  = null;
const AUTO_INTERVAL = 4000; // ms

// --- Update Slide ---
function updateSlide(index) {
  const slide = slides[index];

  // Fade image
  imageEl.style.opacity = "0";

  setTimeout(() => {
    imageEl.src = slide.image;
    imageEl.alt = slide.title;
    imageEl.style.opacity = "1";
  }, 200);

  titleEl.textContent = slide.title;
  descEl.textContent  = slide.description;
  counterEl.textContent = `${index + 1} / ${slides.length}`;

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle("slider__dot--active", i === index);
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
  });

  currentIndex = index;
}

// --- Navigation ---
function goToSlide(index) {
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  updateSlide(index);
  resetAutoAdvance();
}

function nextSlide() {
  goToSlide(currentIndex + 1);
}

function prevSlide() {
  goToSlide(currentIndex - 1);
}

// --- Auto-Advance ---
function startAutoAdvance() {
  stopAutoAdvance();
  autoAdvanceId = setInterval(nextSlide, AUTO_INTERVAL);
}

function stopAutoAdvance() {
  if (autoAdvanceId) {
    clearInterval(autoAdvanceId);
    autoAdvanceId = null;
  }
}

function resetAutoAdvance() {
  startAutoAdvance();
}

// --- Event Listeners ---
prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = parseInt(dot.dataset.index, 10);
    goToSlide(index);
  });
});

// Pause auto-advance on hover / touch
sliderEl.addEventListener("mouseenter", stopAutoAdvance);
sliderEl.addEventListener("mouseleave", startAutoAdvance);
sliderEl.addEventListener("touchstart", stopAutoAdvance, { passive: true });
sliderEl.addEventListener("touchend", startAutoAdvance);

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft")  prevSlide();
  if (e.key === "ArrowRight") nextSlide();
});

// --- Initialize ---
updateSlide(0);
startAutoAdvance();
