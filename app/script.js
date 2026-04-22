import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js";

(function () {
  gsap.registerPlugin(ScrollTrigger);

  const THEME_STORAGE_KEY = "int216d-theme";
  let currentTheme = "dark";

  function applyTheme(theme) {
    currentTheme = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);

    const toggleButton = document.getElementById("theme-toggle-btn");
    if (toggleButton) {
      toggleButton.textContent = currentTheme === "dark" ? "Dark" : "Light";
      toggleButton.setAttribute(
        "aria-label",
        currentTheme === "dark" ? "Current mode dark. Switch to light mode" : "Current mode light. Switch to dark mode"
      );
      toggleButton.setAttribute("title", currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    applyTheme(savedTheme === "light" ? "light" : "dark");
  }

  function getThemeColors() {
    if (currentTheme === "light") {
      return {
        navTop: "rgba(255, 248, 236, 0.78)",
        navScrolled: "rgba(255, 244, 224, 0.94)",
        heroClear: 0xfff3df,
        beamStrokeOuter: "rgba(184,138,68,",
        beamStrokeInner: "rgba(122,104,86,",
        beamShadowInner: "rgba(184,138,68,0.75)",
        beamMote: "rgba(184,138,68,",
        iridescentBase: "#e7d5b6",
        outlineBorder: "rgba(122, 104, 86, 0.35)",
      };
    }

    return {
      navTop: "rgba(15, 15, 15, 0.6)",
      navScrolled: "rgba(15, 15, 15, 0.85)",
      heroClear: 0x000000,
      beamStrokeOuter: "rgba(18,179,166,",
      beamStrokeInner: "rgba(255,255,255,",
      beamShadowInner: "rgba(255,255,255,0.8)",
      beamMote: "rgba(255,255,255,",
      iridescentBase: "#0a0a0a",
      outlineBorder: "rgba(255, 255, 255, 0.2)",
    };
  }

  function emitFrontendEvent(action, payload) {
    window.dispatchEvent(
      new CustomEvent("int216d:action", {
        detail: { action: action, payload: payload || {} },
      })
    );
  }

  function createBackendBridge() {
    const api = {
      onAction: function (handler) {
        if (typeof handler !== "function") return function () {};
        const listener = function (event) {
          handler(event.detail);
        };
        window.addEventListener("int216d:action", listener);
        return function () {
          window.removeEventListener("int216d:action", listener);
        };
      },
      emitAction: function (action, payload) {
        emitFrontendEvent(action, payload);
      },
    };

    window.INT216D = Object.assign({}, window.INT216D || {}, api);
  }

  const services = [
    {
      title: "The Concierge Detail",
      subtitle: "Interior Deep Clean",
      description:
        "Full interior restoration. Leather conditioning, steam sanitization, and meticulous vacuuming of every surface.",
      price: "From R350",
      image: "/public/images/service-interior.jpg",
      features: ["Leather conditioning", "Steam sanitization", "Carpet deep clean", "Odor elimination"],
    },
    {
      title: "The Ceramic Shield",
      subtitle: "Exterior Protection",
      description:
        "Paint correction and ceramic coating application. Hydrophobic protection that lasts for years, not weeks.",
      price: "From R1,200",
      image: "/public/images/service-exterior.jpg",
      features: ["Paint correction", "Ceramic coating", "Hydrophobic finish", "UV protection"],
    },
  ];

  const methods = [
    { name: "Touchless", desc: "Water pressure only" },
    { name: "Hand Wash", desc: "Most popular" },
    { name: "Steam", desc: "Deep interior clean" },
    { name: "Foam Cannon", desc: "Foam then hand finish" },
    { name: "Waterless", desc: "Spray and buff" },
  ];

  const gridImages = [
    "/public/images/grid-1.jpg",
    "/public/images/grid-2.jpg",
    "/public/images/grid-3.jpg",
    "/public/images/grid-4.jpg",
    "/public/images/grid-7.jpg",
    "/public/images/grid-5.jpg",
    "/public/images/grid-6.jpg",
    "/public/images/grid-8.jpg",
    "/public/images/grid-9.jpg",
    "/public/images/grid-10.jpg",
  ];

  const packages = [
    { name: "Rinse & Shine", mode: "Bay only", price: "From R80", desc: "Exterior rinse, basic dry" },
    {
      name: "Full Exterior",
      mode: "Bay & Mobile",
      price: "From R150",
      desc: "Full exterior, tyre shine, window clean",
    },
    {
      name: "Interior Refresh",
      mode: "Bay & Mobile",
      price: "From R180",
      desc: "Vacuum, dash wipe, interior windows",
    },
    {
      name: "Full Valet",
      mode: "Bay & Mobile",
      price: "From R350",
      desc: "Exterior + Interior + boot + engine light",
    },
    {
      name: "VIP Detail",
      mode: "Mobile (VIP)",
      price: "From R650",
      desc: "Full valet + clay bar + wax + leather care",
    },
    { name: "Ceramic Coat", mode: "Bay Premium", price: "From R1,200", desc: "Full detail + ceramic coating" },
  ];

  const addons = [
    { name: "Tyre Dressing", price: "+R40", desc: "Shiny tyres that complete the look" },
    { name: "Engine Bay Clean", price: "+R120", desc: "Clean engine area, like new" },
    { name: "Pet Hair Removal", price: "+R80", desc: "Remove pet hair from seats" },
    { name: "Paint Sealant", price: "+R250", desc: "Protect paint for 6 months" },
    { name: "Air Freshener", price: "+R25", desc: "Premium scent inside" },
    { name: "Headlight Restore", price: "+R180", desc: "Polish dull headlights" },
  ];

  const membershipFeatures = [
    "Unlimited premium washes",
    "Priority booking slots",
    "Free add-ons (tyre dressing, air freshener)",
    "VIP bay access",
    "10% off ceramic coatings",
    "Dedicated account manager",
  ];

  const tiers = [
    { tier: "Bronze", price: "R99/mo", discount: "5%" },
    { tier: "Silver", price: "R199/mo", discount: "10%" },
    { tier: "Gold", price: "R349/mo", discount: "15%" },
    { tier: "Platinum", price: "R549/mo", discount: "20%" },
    { tier: "VIP", price: "R999/mo", discount: "25%" },
  ];

  const bookingSteps = [
    { step: "01", label: "Register", desc: "Create your account" },
    { step: "02", label: "Choose Service", desc: "Pick your package" },
    { step: "03", label: "Select Slot", desc: "Book date & time" },
    { step: "04", label: "Confirm", desc: "Pay & relax" },
  ];

  const footerLinks = {
    socials: ["Instagram", "Facebook", "Twitter"],
    services: [
      { label: "Services", href: "#services" },
      { label: "The Fleet", href: "#experience" },
      { label: "Membership", href: "#membership" },
      { label: "Pricing", href: "#addons" },
      { label: "Book Now", href: "#booking" },
    ],
    legal: ["Privacy Policy", "Terms of Service", "Mandate Agreement"],
  };

  function fillServices() {
    const servicesEl = document.getElementById("services-cards");
    const methodsEl = document.getElementById("method-grid");
    if (!servicesEl || !methodsEl) return;

    servicesEl.innerHTML = services
      .map(
        (service) => `
          <article class="service-card">
            <div class="service-media">
              <img src="${service.image}" alt="${service.title}" />
              <div class="service-overlay"></div>
              <div class="service-copy">
                <p class="sub-eyebrow">${service.subtitle}</p>
                <h3>${service.title}</h3>
                <p class="service-desc">${service.description}</p>
                <div class="feature-row">
                  ${service.features.map((feature) => `<span class="feature-pill">${feature}</span>`).join("")}
                </div>
                <p class="price">${service.price}</p>
              </div>
            </div>
          </article>
      `
      )
      .join("");

    methodsEl.innerHTML = methods
      .map(
        (method) => `
          <article class="method-card">
            <p class="method-name">${method.name}</p>
            <p class="method-desc">${method.desc}</p>
          </article>
      `
      )
      .join("");
  }

  function fillExperience() {
    const gridEl = document.getElementById("experience-grid");
    const bay = document.getElementById("exp-col-bay");
    const mobile = document.getElementById("exp-col-mobile");
    if (!gridEl || !bay || !mobile) return;

    gridEl.innerHTML = gridImages
      .map(
        (src, index) => `
          <div class="grid-image ${index === 5 ? "grid-image--center" : ""}">
            <div class="grid-image-inner" style="background-image: url('${src}')"></div>
          </div>
      `
      )
      .join("");

    bay.innerHTML = `
      <p class="sub-eyebrow">On-Site Service</p>
      <h3 class="exp-title">The Bay Experience</h3>
      <p class="exp-desc">Drive to our premium facility and experience automotive care at its finest. Our state-of-the-art bays feature climate-controlled environments, advanced water reclamation systems, and dedicated detailers for each vehicle.</p>
      <div class="exp-meta"><span class="exp-meta-label">Average Wait</span><span class="exp-meta-value">45 minutes</span></div>
      <div class="exp-meta"><span class="exp-meta-label">Bays Available</span><span class="exp-meta-value">12 premium stations</span></div>
      <div class="exp-meta"><span class="exp-meta-label">Location</span><span class="exp-meta-value">Johannesburg, Sandton</span></div>
    `;

    mobile.innerHTML = `
      <p class="sub-eyebrow">We Come To You</p>
      <h3 class="exp-title">Mobile Fleet</h3>
      <p class="exp-desc">Can't make it to the bay? Our fully-equipped mobile units bring the premium wash experience directly to your home or office. Each van is a self-contained detailing studio on wheels.</p>
      <div class="exp-meta"><span class="exp-meta-label">Service Radius</span><span class="exp-meta-value">50km from CBD</span></div>
      <div class="exp-meta"><span class="exp-meta-label">Fleet Size</span><span class="exp-meta-value">24 mobile units</span></div>
      <div class="exp-meta"><span class="exp-meta-label">Booking Slots</span><span class="exp-meta-value">7 days, 8am - 6pm</span></div>
    `;
  }

  function fillAddons() {
    const packagesEl = document.getElementById("package-grid");
    const addonsEl = document.getElementById("addons-grid");
    if (!packagesEl || !addonsEl) return;

    packagesEl.innerHTML = packages
      .map(
        (pkg) => `
          <article class="package-card">
            <div class="package-head">
              <h3 class="package-name">${pkg.name}</h3>
              <span class="package-mode">${pkg.mode}</span>
            </div>
            <p class="package-desc">${pkg.desc}</p>
            <p class="price">${pkg.price}</p>
          </article>
      `
      )
      .join("");

    addonsEl.innerHTML = addons
      .map(
        (addon) => `
          <article class="addon-card">
            <div>
              <p class="addon-name">${addon.name}</p>
              <p class="addon-desc">${addon.desc}</p>
            </div>
            <span class="accent">${addon.price}</span>
          </article>
      `
      )
      .join("");
  }

  function fillMembership() {
    const card = document.getElementById("membership-card");
    const tiersGrid = document.getElementById("tiers-grid");
    if (!card || !tiersGrid) return;

    card.innerHTML = `
      <p class="sub-eyebrow">Exclusive Access</p>
      <h2 class="card-title">Unlimited Membership</h2>
      <p class="card-desc">Join our premium membership program and enjoy unlimited washes, priority booking, and exclusive member-only services.</p>
      <div class="price-row">
        <span class="price-main">R599</span>
        <span class="price-month">/month</span>
      </div>
      <div class="feature-list">
        ${membershipFeatures
          .map(
            (feature) => `<div class="feature-item"><span class="feature-dot"></span><span>${feature}</span></div>`
          )
          .join("")}
      </div>
      <button class="join-btn" id="join-club-btn" data-action="join-club">Join the Club</button>
    `;

    tiersGrid.innerHTML = tiers
      .map(
        (tier) => `
          <article class="tier-card">
            <p class="tier-name">${tier.tier}</p>
            <p class="tier-price">${tier.price}</p>
            <p class="tier-discount">${tier.discount} off</p>
          </article>
      `
      )
      .join("");
  }

  function fillBooking() {
    const booking = document.getElementById("booking-content");
    if (!booking) return;

    booking.innerHTML = `
      <p class="eyebrow">Ready to Transform Your Vehicle?</p>
      <h2>Book Your Premium Wash Today</h2>
      <p class="desc">Choose between our mobile service that comes to you, or visit our state-of-the-art bay facility. Either way, your vehicle receives the INT216D premium treatment.</p>
      <div class="booking-btn-row">
        <button class="btn-primary" id="book-mobile-btn" data-action="book-mobile">Book Mobile Wash</button>
        <button class="btn-outline" id="book-bay-btn" data-action="book-bay">Book Bay Wash</button>
      </div>
      <div class="steps-grid">
        ${bookingSteps
          .map(
            (item) => `
              <article>
                <span class="step-num">${item.step}</span>
                <p class="step-label">${item.label}</p>
                <p class="step-desc">${item.desc}</p>
              </article>
          `
          )
          .join("")}
      </div>
    `;
  }

  function fillFooter() {
    const brand = document.getElementById("footer-brand");
    const servicesCol = document.getElementById("footer-services");
    const contactCol = document.getElementById("footer-contact");
    const bottom = document.getElementById("footer-bottom");
    if (!brand || !servicesCol || !contactCol || !bottom) return;

    brand.innerHTML = `
      <p class="footer-brand">INT216D</p>
      <p class="footer-blurb">Premium automotive care. We don't just wash cars - we restore them to their original glory with meticulous attention to every detail.</p>
      <div class="inline-links">
        ${footerLinks.socials
          .map((item) => `<a href="#" class="footer-link">${item}</a>`)
          .join("")}
      </div>
    `;

    servicesCol.innerHTML = `
      <p class="footer-col-title">Services</p>
      <div class="footer-col-list">
        ${footerLinks.services
          .map((item) => `<a href="${item.href}" class="footer-text-link">${item.label}</a>`)
          .join("")}
      </div>
    `;

    contactCol.innerHTML = `
      <p class="footer-col-title">Contact</p>
      <div class="footer-col-list">
        <p class="footer-text-link">Sandton, Johannesburg</p>
        <p class="footer-text-link">info@int216d.co.za</p>
        <p class="footer-text-link">+27 11 123 4567</p>
      </div>
    `;

    bottom.innerHTML = `
      <p class="footer-copy">&copy; 2025 INT216D CarWash. All rights reserved.</p>
      <div class="footer-bottom-links">
        ${footerLinks.legal
          .map((item) => `<a href="#" class="footer-text-link">${item}</a>`)
          .join("")}
      </div>
    `;
  }

  function setupScrollAndNav() {
    const nav = document.getElementById("main-nav");
    if (nav) {
      const colors = getThemeColors();
      nav.style.background = window.scrollY > 50 ? colors.navScrolled : colors.navTop;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!nav) return;
        const colors = getThemeColors();
        nav.style.background = window.scrollY > 50 ? colors.navScrolled : colors.navTop;
      },
      { passive: true }
    );

    document.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function setupHeroAnimations() {
    const lines = document.querySelectorAll("#hero-title .hero-line");
    const subtitle = document.getElementById("hero-subtitle");
    const cta = document.getElementById("hero-cta");

    const tl = gsap.timeline({ delay: 0.8 });
    tl.fromTo(
      lines,
      { y: 120, opacity: 0, rotateX: -40 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "power3.out", stagger: 0.12 }
    )
      .fromTo(subtitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.4")
      .fromTo(cta, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3");
  }

  function setupSectionScrollAnims() {
    gsap.fromTo(
      "#services-header",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#services",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".service-card",
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: "#services-cards",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      "#addons-header",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#addons",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".package-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: "#package-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".addon-card",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: "#addons-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      "#membership-card",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#membership",
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      "#booking-content",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#booking",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  function setupExperiencePin() {
    const wrapper = document.getElementById("experience-grid");
    const images = wrapper ? wrapper.querySelectorAll(".grid-image") : null;
    const nonCenterImages = wrapper ? wrapper.querySelectorAll(".grid-image:not(.grid-image--center)") : null;
    const centerImage = wrapper ? wrapper.querySelector(".grid-image--center") : null;
    const centerInner = centerImage ? centerImage.querySelector(".grid-image-inner") : null;
    const content = document.getElementById("experience-content");

    if (!wrapper || !images || !nonCenterImages || !centerImage || !centerInner || !content) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#experience",
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.8,
      },
    });

    tl.to(
      nonCenterImages,
      {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: "none",
        stagger: { each: 0.02, from: "edges" },
      },
      0
    )
      .to(centerImage, { width: "100vw", height: "100vh", opacity: 1, duration: 1, ease: "none" }, 0)
      .to(centerInner, { scale: 1, duration: 1, ease: "none" }, 0)
      .fromTo(content, { x: "100%", opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.6);
  }

  function setupHeroThreeBackground() {
    const mount = document.getElementById("hero-three");
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 10);
    camera.position.z = 1.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(getThemeColors().heroClear, 1);
    mount.appendChild(renderer.domElement);

    window.addEventListener("int216d:theme-changed", function () {
      renderer.setClearColor(getThemeColors().heroClear, 1);
    });

    const video = document.createElement("video");
    video.src = "/public/videos/hero-fluid.mp4";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.play().catch(function () {});

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneGeometry(1.92, 1.08, 16, 16);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(1.2, 1.2, 1.2);
    scene.add(mesh);

    const edgeGeometry = new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.92, 1.08));
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.5 });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    edges.position.z = 0.005;
    edges.scale.set(1.2, 1.2, 1.2);
    scene.add(edges);

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let time = 0;

    window.addEventListener("mousemove", function (event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
    });

    function animate() {
      time += 0.016;
      target.x = -mouse.y * 0.5;
      target.y = mouse.x * 0.5;

      mesh.rotation.x += (target.x - mesh.rotation.x) * 0.05;
      mesh.rotation.y += (target.y - mesh.rotation.y) * 0.05;

      const positions = mesh.geometry.attributes.position;
      const array = positions.array;
      for (let i = 0; i < array.length; i += 3) {
        const x = array[i];
        const y = array[i + 1];
        const zOffset = Math.sin(x * 2 + time) * 0.005 + Math.sin(y * 3 + time) * 0.005;
        array[i + 2] = zOffset;
      }
      positions.needsUpdate = true;

      edges.rotation.x = mesh.rotation.x;
      edges.rotation.y = mesh.rotation.y;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    setTimeout(function () {
      mount.classList.add("loaded");
    }, 500);

    animate();

    window.addEventListener("resize", function () {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    });
  }

  function randn() {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function setupLuminousBeam() {
    const canvas = document.getElementById("beam-canvas");
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const progress = { value: 0 };
    let width = 0;
    let height = 0;
    let particles = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = [];
      for (let i = 0; i < 100; i += 1) {
        particles.push({
          x: width / 2 + randn() * (width * 0.15),
          y: Math.random() * height,
          speed: 0.3 + Math.random() * 0.7,
          radius: 1 + Math.random() * 2,
          opacity: 0.2 + Math.random() * 0.5,
        });
      }
    }

    ScrollTrigger.create({
      trigger: "#membership",
      start: "top 80%",
      end: "bottom 20%",
      scrub: true,
      onUpdate: function (self) {
        progress.value = self.progress;
      },
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      const colors = getThemeColors();

      const eased = 1 - Math.pow(1 - progress.value, 3);
      const bottomY = height * eased;
      const centerX = width / 2;
      const hue = 180 + eased * 60;

      const gradient = ctx.createLinearGradient(centerX, 0, centerX, height);
      gradient.addColorStop(0, "hsla(" + hue + ", 80%, 50%, 0)");
      gradient.addColorStop(Math.min(0.45, eased * 0.5 + 0.1), "hsla(" + hue + ", 80%, 50%, 0.15)");
      gradient.addColorStop(Math.min(1, eased + 0.1), "hsla(" + hue + ", 80%, 50%, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(centerX - width * 0.2, 0, width * 0.4, height);

      ctx.save();
      ctx.shadowBlur = 50;
      ctx.shadowColor = "hsla(" + hue + ", 80%, 60%, 0.6)";
      ctx.strokeStyle = colors.beamStrokeOuter + 0.3 * eased + ")";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, bottomY);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors.beamShadowInner;
      ctx.strokeStyle = colors.beamStrokeInner + 0.6 * eased + ")";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, bottomY);
      ctx.stroke();
      ctx.restore();

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.y += p.speed * 0.5;
        if (p.y > height) {
          p.y = -10;
          p.x = centerX + randn() * (width * 0.15);
        }

        if (Math.abs(p.x - centerX) < width * 0.15 && p.y < bottomY) {
          const mote = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          mote.addColorStop(0, colors.beamMote + p.opacity * eased + ")");
          mote.addColorStop(1, colors.beamMote + "0)");
          ctx.fillStyle = mote;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
  }

  function setupIridescentFooter() {
    const canvas = document.getElementById("iridescent-canvas");
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const progress = { value: 0 };
    ScrollTrigger.create({
      trigger: "#footer",
      start: "top 80%",
      end: "center center",
      scrub: true,
      onUpdate: function (self) {
        progress.value = self.progress;
      },
    });

    function draw(time) {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      ctx.clearRect(0, 0, width, height);

      const fontSize = Math.min(width / 8, 120);
      const text = "IMPECCABLE";
      const x = width / 2;
      const y = height / 2;

      ctx.font = "400 " + fontSize + "px \"Instrument Serif\", serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;

      ctx.fillStyle = getThemeColors().iridescentBase;
      ctx.fillText(text, x, y);

      const current = progress.value;
      if (current > 0) {
        const bandHeight = fontSize * 0.6;
        const bandTop = y - bandHeight / 2;
        const revealY = bandTop + bandHeight * 2 * (1 - Math.min(1, current * 1.5));

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, Math.max(0, revealY - bandHeight), width, bandHeight);
        ctx.clip();

        const gradient = ctx.createLinearGradient(x - textWidth / 2, 0, x + textWidth / 2, 0);
        const offset = time * 0.0003;
        for (let i = 0; i <= 20; i += 1) {
          const pos = i / 20;
          const hue = (pos * 360 + offset * 100) % 360;
          gradient.addColorStop(pos, "hsl(" + hue + ",80%,60%)");
        }

        ctx.fillStyle = gradient;
        ctx.shadowColor = "rgba(18,179,166,0.6)";
        ctx.shadowBlur = 30;
        ctx.fillText(text, x, y);
        ctx.restore();

        if (current > 0.3) {
          const band2Height = fontSize * 0.3;
          const revealY2 = y - band2Height / 2 + band2Height * 2 * (1 - Math.min(1, (current - 0.3) / 0.7));

          ctx.save();
          ctx.beginPath();
          ctx.rect(0, Math.max(0, revealY2 - band2Height), width, band2Height);
          ctx.clip();

          const gradient2 = ctx.createLinearGradient(x - textWidth / 2, 0, x + textWidth / 2, 0);
          const offset2 = time * 0.0003;
          for (let j = 0; j <= 20; j += 1) {
            const pos2 = j / 20;
            const hue2 = (pos2 * 360 + offset2 * 100 + 180) % 360;
            gradient2.addColorStop(pos2, "hsl(" + hue2 + ",70%,55%)");
          }

          ctx.fillStyle = gradient2;
          ctx.shadowColor = "rgba(180,100,255,0.4)";
          ctx.shadowBlur = 20;
          ctx.fillText(text, x, y);
          ctx.restore();
        }
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  function setupHoverGlow() {
    document.addEventListener("mouseover", function (event) {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.matches(".pill-btn, .hero-cta, .btn-primary, .join-btn")) {
        target.style.boxShadow = "0 0 30px rgba(18, 179, 166, 0.3)";
      }
      if (target.matches(".btn-outline")) {
        target.style.borderColor = "rgba(18, 179, 166, 0.5)";
      }
    });

    document.addEventListener("mouseout", function (event) {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.matches(".pill-btn, .hero-cta, .btn-primary, .join-btn")) {
        target.style.boxShadow = "none";
      }
      if (target.matches(".btn-outline")) {
        target.style.borderColor = getThemeColors().outlineBorder;
      }
    });
  }

  function setupThemeToggle() {
    const toggleButton = document.getElementById("theme-toggle-btn");
    if (!toggleButton) return;

    toggleButton.addEventListener("click", function () {
      applyTheme(currentTheme === "dark" ? "light" : "dark");
      window.dispatchEvent(new CustomEvent("int216d:theme-changed", { detail: { theme: currentTheme } }));

      const nav = document.getElementById("main-nav");
      if (nav) {
        const colors = getThemeColors();
        nav.style.background = window.scrollY > 50 ? colors.navScrolled : colors.navTop;
      }
    });
  }

  function setupMobileMenu() {
    const nav = document.getElementById("main-nav");
    const menuToggle = document.getElementById("menu-toggle-btn");
    const navLinks = document.getElementById("main-nav-links");
    if (!nav || !menuToggle || !navLinks) return;

    function closeMenu() {
      nav.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      menuToggle.textContent = "Menu";
    }

    menuToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menuToggle.textContent = open ? "Close" : "Menu";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) closeMenu();
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  function setupBackendHooks() {
    document.addEventListener("click", function (event) {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const actionElement = target.closest("[data-action]");
      if (!(actionElement instanceof HTMLElement)) return;

      const action = actionElement.getAttribute("data-action");
      if (!action) return;

      emitFrontendEvent(action, {
        id: actionElement.id || null,
        text: actionElement.textContent ? actionElement.textContent.trim() : "",
      });
    });
  }

  function bootstrap() {
    initializeTheme();
    createBackendBridge();
    fillServices();
    fillExperience();
    fillAddons();
    fillMembership();
    fillBooking();
    fillFooter();

    setupScrollAndNav();
    setupThemeToggle();
    setupMobileMenu();
    setupHeroThreeBackground();
    setupHeroAnimations();
    setupSectionScrollAnims();
    setupExperiencePin();
    setupLuminousBeam();
    setupIridescentFooter();
    setupHoverGlow();
    setupBackendHooks();

    ScrollTrigger.refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
