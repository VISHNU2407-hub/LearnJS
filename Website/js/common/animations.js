/* ============================================================
   LearnJS — animations.js
   Scroll reveals, counters, typewriter, testimonial slider,
   scroll progress and back-to-top.
   ============================================================ */

(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /* ---------- Scroll reveal ---------- */
  function initReveals() {
    var items = document.querySelectorAll(".reveal, .reveal-scale, .reveal-left, .reveal-right");
    if (!items.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-counter")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;
    var start = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value = Math.round(target * easeOutCubic(progress));
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function initCounters() {
    var counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Typewriter for hero editor ---------- */
  function initTypewriter() {
    var el = document.querySelector("[data-typewriter]");
    if (!el) return;

    var lines;
    try {
      lines = JSON.parse(el.getAttribute("data-lines"));
    } catch (err) {
      return;
    }
    if (!Array.isArray(lines) || !lines.length) return;

    var lineIndex = 0;
    var charIndex = 0;
    var typing = true;
    var paused = false;

    function tick() {
      if (paused) return;
      var line = lines[lineIndex];

      if (typing) {
        charIndex += 1;
        el.textContent = line.slice(0, charIndex);
        if (charIndex >= line.length) {
          typing = false;
          paused = true;
          setTimeout(function () {
            paused = false;
            lineIndex = (lineIndex + 1) % lines.length;
            charIndex = 0;
            typing = true;
            el.textContent = "";
            schedule();
          }, 2600);
          return;
        }
      }
      schedule();
    }

    function schedule() {
      setTimeout(tick, typing ? 55 : 18);
    }

    schedule();
  }

  /* ---------- Testimonial slider ---------- */
  function initSlider() {
    var track = document.querySelector(".t-track");
    if (!track) return;

    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = document.querySelector(".t-dots");
    var prevBtn = document.querySelector(".t-prev");
    var nextBtn = document.querySelector(".t-next");
    var index = 0;
    var timer = null;

    if (slides.length < 2) return;

    // Build dots
    var dots = [];
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "t-dot";
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
        restartTimer();
      });
      if (dotsWrap) dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (dot, d) {
        dot.classList.toggle("active", d === index);
      });
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function restartTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, 5500);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restartTimer(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restartTimer(); });

    // Pause on hover
    var viewport = document.querySelector(".t-viewport");
    if (viewport) {
      viewport.addEventListener("mouseenter", function () {
        if (timer) clearInterval(timer);
      });
      viewport.addEventListener("mouseleave", restartTimer);
    }

    // Basic touch swipe
    var startX = 0;
    track.addEventListener("touchstart", function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", function (e) {
      var delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 45) {
        if (delta < 0) next(); else prev();
        restartTimer();
      }
    }, { passive: true });

    goTo(0);
    restartTimer();
  }

  /* ---------- Scroll progress + back to top ---------- */
  function initScrollChrome() {
    var progress = document.querySelector(".scroll-progress");
    var topBtn = document.querySelector(".back-to-top");
    if (!progress && !topBtn) return;

    function apply(pct) {
      if (progress) progress.style.width = pct + "%";
    }

    function onScroll() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      apply(pct);
      if (topBtn) topBtn.classList.toggle("visible", window.scrollY > 600);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    apply(0); // initial state without waiting for the first scroll event

    if (topBtn) {
      topBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  ready(function () {
    initReveals();
    initCounters();
    initTypewriter();
    initSlider();
    initScrollChrome();
  });
})();
// end of animations.js
