/* ===== Shared script: header/footer, menu, lightbox, form validation, year ===== */
(function () {
  "use strict";

  /* ---- EDIT THESE DETAILS ONCE; they appear on every page ---- */
  var SITE = {
    name: "Master Tutorial Computer Viji School Of Commerce",
    phone: "+91 98765 43210",
    email: "info@mastertutorial.example",
    address: "123 Main Road, Your City, State - 000000"
  };
  var PAGES = [
    ["index.html", "Home", "home"],
    ["gallery.html", "Gallery", "gallery"],
    ["staff.html", "Staff Members", "staff"],
    ["contact.html", "Contact", "contact"]
  ];
  var current = document.body.getAttribute("data-page");

  /* ---- Common header ---- */
  var links = PAGES.map(function (p) {
    var active = p[2] === current;
    return '<li><a href="' + p[0] + '"' + (active ? ' class="active" aria-current="page"' : "") + ">" + p[1] + "</a></li>";
  }).join("");
  var header = document.getElementById("site-header");
  if (header) {
    header.outerHTML =
      '<header class="site-header"><div class="container nav-wrap">' +
      '<a class="brand" href="index.html"><img src="images/logo.svg" alt="Institution logo"><span>' + SITE.name + "</span></a>" +
      '<button class="hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>' +
      '<nav aria-label="Main"><ul class="nav-links" id="nav">' + links + "</ul></nav></div></header>";
  }

  /* ---- Common footer ---- */
  var footer = document.getElementById("site-footer");
  if (footer) {
    var quick = PAGES.map(function (p) { return '<li><a href="' + p[0] + '">' + p[1] + "</a></li>"; }).join("");
    footer.outerHTML =
      '<footer class="site-footer"><div class="container"><div class="footer-grid">' +
      "<div><h3>" + SITE.name + "</h3><p>Computer training and commerce education that prepares students for college, careers and business.</p></div>" +
      "<div><h3>Quick Links</h3><ul>" + quick + "</ul></div>" +
      "<div><h3>Contact</h3><ul><li>" + SITE.address + '</li><li><a href="tel:' + SITE.phone.replace(/\s/g, "") + '">' + SITE.phone + '</a></li><li><a href="mailto:' + SITE.email + '">' + SITE.email + "</a></li></ul>" +
      '<div class="social"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">in</a><a href="#" aria-label="YouTube">yt</a></div></div>' +
      '</div><p class="copyright">&copy; <span id="year"></span> ' + SITE.name + ". All rights reserved.</p></div></footer>";
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  /* ---- Hamburger menu ---- */
  var burger = document.querySelector(".hamburger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---- Gallery lightbox ---- */
  var thumbs = Array.prototype.slice.call(document.querySelectorAll(".gallery .thumb"));
  if (thumbs.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML = '<button class="lb-btn lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous image">&#8249;</button>' +
      '<img alt=""><p></p>' +
      '<button class="lb-btn lb-next" aria-label="Next image">&#8250;</button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img"), lbCap = lb.querySelector("p"), idx = 0, opener = null;

    function show(i) {
      idx = (i + thumbs.length) % thumbs.length;
      var img = thumbs[idx].querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = thumbs[idx].closest("figure").querySelector("figcaption").textContent;
    }
    function open(i) { opener = thumbs[i]; show(i); lb.classList.add("open"); lb.querySelector(".lb-close").focus(); }
    function close() { lb.classList.remove("open"); if (opener) opener.focus(); }

    thumbs.forEach(function (t, i) { t.addEventListener("click", function () { open(i); }); });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---- Contact form validation (front-end only) ---- */
  var form = document.getElementById("contact-form");
  if (form) {
    var rules = {
      name: function (v) { return v.trim().length >= 2 ? "" : "Enter your full name."; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address."; },
      phone: function (v) { return /^[+\d][\d\s-]{8,14}$/.test(v.trim()) ? "" : "Enter a valid phone number (9-15 digits)."; },
      message: function (v) { return v.trim().length >= 10 ? "" : "Message must be at least 10 characters."; }
    };
    var msg = document.getElementById("form-msg");

    function check(name) {
      var input = form.elements[name], field = input.parentElement;
      var err = rules[name](input.value);
      field.classList.toggle("invalid", !!err);
      field.querySelector(".error").textContent = err;
      input.setAttribute("aria-invalid", !!err);
      return !err;
    }
    Object.keys(rules).forEach(function (n) {
      form.elements[n].addEventListener("blur", function () { check(n); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = Object.keys(rules).map(check).every(Boolean);
      msg.className = "form-msg " + (ok ? "ok" : "fail");
      msg.textContent = ok
        ? "Thank you! Your message was validated. (Demo only: connect a backend or form service to deliver it.)"
        : "Please fix the highlighted fields and try again.";
      if (ok) form.reset();
    });
  }
})();
