/* ============================================================
   LearnJS — app.js
   Page-level logic: toasts, newsletter, notify forms, footer
   year, and shared helpers exposed on window.LearnJS.
   ============================================================ */

(function () {
  "use strict";

  var LearnJS = (window.LearnJS = window.LearnJS || {});

  /* ---------- Toast notifications ---------- */
  function toast(message, type) {
    var region = document.querySelector(".toast-region");
    if (!region) return;

    var el = document.createElement("div");
    el.className = "toast " + (type === "error" ? "error" : "success");
    el.innerHTML =
      '<span class="toast-dot"></span><span>' + message + "</span>";
    region.appendChild(el);

    requestAnimationFrame(function () {
      el.classList.add("show");
    });

    setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () {
        el.remove();
      }, 350);
    }, 3600);
  }
  LearnJS.toast = toast;

  /* ---------- Email helpers ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function isValidEmail(value) {
    return EMAIL_RE.test((value || "").trim());
  }
  LearnJS.isValidEmail = isValidEmail;

  function saveSubscriber(email) {
    try {
      var key = "learnjs-subscribers";
      var list = JSON.parse(localStorage.getItem(key) || "[]");
      if (list.indexOf(email) === -1) {
        list.push(email);
        localStorage.setItem(key, JSON.stringify(list));
      }
    } catch (err) {
      /* storage unavailable — ignore */
    }
  }

  /* ---------- Newsletter (index page) ---------- */
  function initNewsletter() {
    var form = document.querySelector(".nl-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var success = form.parentElement.querySelector(".nl-success");
      var email = input.value;

      if (!isValidEmail(email)) {
        input.classList.add("is-error");
        toast("Please enter a valid email address.", "error");
        setTimeout(function () { input.classList.remove("is-error"); }, 2200);
        return;
      }

      saveSubscriber(email);
      form.style.display = "none";
      if (success) success.classList.add("show");
      toast("Welcome aboard! Check your inbox \u2709\ufe0f");
    });
  }

  /* ---------- "Notify me" forms (coming-soon pages) ---------- */
  function initNotifyForms() {
    document.querySelectorAll(".notify-form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector('input[type="email"]');
        var email = input.value;

        if (!isValidEmail(email)) {
          toast("Please enter a valid email address.", "error");
          input.classList.add("is-error");
          setTimeout(function () { input.classList.remove("is-error"); }, 2200);
          return;
        }

        saveSubscriber(email);
        var btn = form.querySelector(".btn");
        if (btn) btn.textContent = "You're on the list! \u2713";
        input.value = "";
        input.placeholder = "See you soon! ";
        toast("We'll notify you when it launches.");
      });
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    initNewsletter();
    initNotifyForms();
    initYear();
  });
})();
// end of app.js
