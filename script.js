/* ==========================================================================
   LIQUID GLASS ENGINE & INTERACTIVE CONTROLLER
   Developer: Ravi Kumar Gangwar (Java Developer)
   Features: Floating Canvas Particles, Glow Pointer, 3D Tilt, EmailJS
   ========================================================================== */

const EMAILJS_CONFIG = {
  PUBLIC_KEY: "4c4h7IjpNBKNE6cXZ",
  SERVICE_ID: "service_kh7u30c",
  TEMPLATE_ID: "template_mo4c0db"
};

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initFluidCursor();
  initNavbarScroll();
  initTypingEffect();
  initCounterAnimation();
  init3DTilt();
  initAlgorithmVisualizer();
  initContactForm();
  initResumeModal();
});

/* 1. INTERACTIVE LIQUID PARTICLE BACKGROUND CANVAS */
function initBackgroundCanvas() {
  const canvas = document.getElementById('liquid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 4 + 2,
      vy: -(Math.random() * 0.4 + 0.1),
      vx: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;

      if (p.y < 0) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 255, ${p.alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f2ff';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   MAGNETIC DYNAMIC CIRCLE CURSOR WITH INVERTED FLUID-DISTORTION TRAIL
   -------------------------------------------------------------------------- */
function initFluidCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let trailContainer = document.getElementById('cursor-trail-wrap');
  
  if (!dot || !ring) return;

  // Create 6 fluid trail nodes dynamically
  const trailNodes = [];
  const trailCount = 6;
  
  if (!trailContainer) {
    trailContainer = document.createElement('div');
    trailContainer.id = 'cursor-trail-wrap';
    document.body.appendChild(trailContainer);
  }
  trailContainer.innerHTML = '';

  for (let i = 0; i < trailCount; i++) {
    const node = document.createElement('div');
    node.className = 'cursor-trail-node';
    trailContainer.appendChild(node);
    trailNodes.push({
      el: node,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      scale: (1 - i * 0.14)
    });
  }

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let posDot = { x: mouse.x, y: mouse.y };
  let posRing = { x: mouse.x, y: mouse.y };
  let magneticTarget = null;

  // Track mouse coordinates & magnetic element proximity
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const interactiveElements = document.querySelectorAll(
      '.btn, .nav-link, .brand-droplet, .skill-card, .project-card, .contact-info-card, .dsa-card, .social-icon'
    );
    let foundMagnetic = false;

    interactiveElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(mouse.x - centerX, mouse.y - centerY);

      // 70px magnetic pull threshold
      if (dist < 70) {
        foundMagnetic = true;
        magneticTarget = {
          x: centerX + (mouse.x - centerX) * 0.3, // Pull cursor toward element center
          y: centerY + (mouse.y - centerY) * 0.3
        };
      }
    });

    if (!foundMagnetic) {
      magneticTarget = null;
    }
  });

  // 60fps Smooth Lerp Animation Loop
  function render() {
    // Fast lerp for center dot
    posDot.x += (mouse.x - posDot.x) * 0.45;
    posDot.y += (mouse.y - posDot.y) * 0.45;

    // Smooth lerp for outer ring with magnetic snapping
    const targetX = magneticTarget ? magneticTarget.x : mouse.x;
    const targetY = magneticTarget ? magneticTarget.y : mouse.y;

    posRing.x += (targetX - posRing.x) * 0.16;
    posRing.y += (targetY - posRing.y) * 0.16;

    // Update DOM positions
    dot.style.left = `${posDot.x}px`;
    dot.style.top = `${posDot.y}px`;

    ring.style.left = `${posRing.x}px`;
    ring.style.top = `${posRing.y}px`;

    if (magneticTarget) {
      ring.classList.add('is-magnetic');
    } else {
      ring.classList.remove('is-magnetic');
    }

    // Update fluid trail nodes trailing behind the ring
    let prevX = posRing.x;
    let prevY = posRing.y;

    trailNodes.forEach((node, index) => {
      node.x += (prevX - node.x) * (0.35 - index * 0.04);
      node.y += (prevY - node.y) * (0.35 - index * 0.04);

      node.el.style.left = `${node.x}px`;
      node.el.style.top = `${node.y}px`;
      node.el.style.transform = `translate(-50%, -50%) scale(${node.scale})`;

      prevX = node.x;
      prevY = node.y;
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* 3. NAVBAR SCROLL & MOBILE MENU TOGGLE */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* 4. HERO DYNAMIC TYPING EFFECT */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const titles = [
    'Java Developer',
    'Backend Developer',
    'Problem Solver',
    'CSE Engineering Student'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typingElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentTitle.length) {
      typeSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* 5. ANIMATED STATISTICS COUNTER */
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  window.addEventListener('scroll', () => {
    const section = document.querySelector('.about-section');
    if (!section || animated) return;

    const sectionPos = section.getBoundingClientRect().top;
    if (sectionPos < window.innerHeight - 100) {
      statNumbers.forEach(num => {
        const target = +num.getAttribute('data-count');
        let count = 0;
        const speed = target / 40;

        const updateCount = () => {
          count += speed;
          if (count < target) {
            num.innerText = Math.ceil(count);
            setTimeout(updateCount, 30);
          } else {
            num.innerText = target;
          }
        };

        updateCount();
      });
      animated = true;
    }
  });
}

/* 6. 3D GLASS CARD TILT EFFECT */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 12;
      const rotateY = (centerX - x) / 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* 7. LIVE ALGORITHM VISUALIZER ENGINE */
function initAlgorithmVisualizer() {
  const barsArea = document.getElementById('algo-bars-area');
  const btnRun = document.getElementById('btn-run-sort');
  const btnReset = document.getElementById('btn-reset-algo');
  const statusText = document.getElementById('algo-status');

  if (!barsArea || !btnRun || !btnReset) return;

  let array = [];
  const barCount = window.innerWidth < 480 ? 10 : 16;

  function generateArray() {
    array = [];
    barsArea.innerHTML = '';
    for (let i = 0; i < barCount; i++) {
      const val = Math.floor(Math.random() * 80) + 15;
      array.push(val);

      const bar = document.createElement('div');
      bar.className = 'algo-bar';
      bar.style.height = `${val}%`;
      barsArea.appendChild(bar);
    }
    statusText.textContent = 'Status: Array reset with random liquid values.';
  }

  async function bubbleSort() {
    btnRun.disabled = true;
    btnReset.disabled = true;
    const bars = barsArea.children;

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        bars[j].classList.add('active-bar');
        bars[j + 1].classList.add('active-bar');
        statusText.textContent = `Comparing nodes at index ${j} and ${j + 1}`;

        await new Promise(r => setTimeout(r, 120));

        if (array[j] > array[j + 1]) {
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;

          bars[j].style.height = `${array[j]}%`;
          bars[j + 1].style.height = `${array[j + 1]}%`;
        }

        bars[j].classList.remove('active-bar');
        bars[j + 1].classList.remove('active-bar');
      }
    }

    statusText.textContent = 'Status: Sort complete! Nodes ordered in O(N²) time.';
    btnRun.disabled = false;
    btnReset.disabled = false;
  }

  btnReset.addEventListener('click', generateArray);
  btnRun.addEventListener('click', bubbleSort);

  generateArray();
}

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initFluidCursor();
  initNavbarScroll();
  initTypingEffect();
  initCounterAnimation();
  init3DTilt();
  initAlgorithmVisualizer();
  initContactForm();
  initResumeModal();
});

/* 8. Contact Form */

let isSubmitting = false;

function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('form-toast');

  if (!form || !toast) return;

  // Prevent duplicate listener attachments
  if (form.dataset.listenerAttached === "true") return;
  form.dataset.listenerAttached = "true";

  // Initialize EmailJS SDK
  if (window.emailjs && EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (isSubmitting) return;
    isSubmitting = true;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Liquid Message...';
    }

    // Hide old toast state during active sending
    toast.style.display = 'none';

    try {
      if (window.emailjs && EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        await emailjs.sendForm(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          form
        );

        // Show Success Toast
        toast.className = 'form-toast success';
        toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Success! Your message has been sent directly to Ravi.';
        toast.style.display = 'block'; // Force display to block
        form.reset();
      } else {
        await new Promise(r => setTimeout(r, 1000));
        
        // Show Demo Success Toast
        toast.className = 'form-toast success';
        toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Demo Mode: Message simulated! (Configure your EmailJS keys in script.js for live delivery).';
        toast.style.display = 'block'; // Force display to block
        form.reset();
      }
    } catch (error) {
      console.error('EmailJS Delivery Error:', error);
      
      // Show Error Toast with details
      toast.className = 'form-toast error';
      toast.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Delivery failed: ' + (error.text || error.message || 'Please check your EmailJS keys.');
      toast.style.display = 'block'; // Force display to block
    } finally {
      isSubmitting = false;

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }

      // Hide toast automatically after 7 seconds
      setTimeout(() => {
        toast.style.display = 'none';
      }, 7000);
    }
  });
}

/* 9. RESUME MODAL HANDLER */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('open-resume-btn');
  const closeBtn = document.getElementById('close-resume-btn');

  if (!modal || !openBtn || !closeBtn) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}