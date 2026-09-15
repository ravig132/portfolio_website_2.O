/* ==========================================================================
   LIQUID GLASS ENGINE & INTERACTIVE CONTROLLER
   Developer: Ravi Kumar Gangwar (Java Developer)
   ========================================================================== */


const EMAILJS_CONFIG = {
  PUBLIC_KEY: "4c4h7IjpNBKNE6cXZ",
  SERVICE_ID: "service_kh7u30c",
  TEMPLATE_ID: "template_mo4c0db"
};

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initCursorGlow();
  initNavbarScroll();
  initTypingEffect();
  initCounterAnimation();
  init3DTilt();
  initAlgorithmVisualizer();
  initContactForm();
  initIceCubeInteractivity();
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

/* 2. DYNAMIC AMBIENT CURSOR GLOW FOLLOWER */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
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
    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      navMenu.classList.toggle('active');

      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars-staggered';
        }
      }
    }

    mobileToggle.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars-staggered';
      });
    });

    document.addEventListener('click', (e) => {
      if (navbar && !navbar.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars-staggered';
      }
    });
  }
}

/* 4. HERO DYNAMIC TYPING EFFECT */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const titles = [
    'Java Developer',
    'AI Automation Engineer',
    'n8n Workflow Specialist',
    'CSE Student'
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
            num.innerText = num.getAttribute('data-count').includes('.') ? count.toFixed(2) : Math.ceil(count);
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

/* 8. CONTACT FORM SUBMISSION */
let isSubmitting = false;

function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('form-toast');

  if (!form || !toast) return;

  if (form.dataset.listenerAttached === "true") return;
  form.dataset.listenerAttached = "true";

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

    toast.style.display = 'none';

    try {
      if (window.emailjs && EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        await emailjs.sendForm(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          form
        );

        toast.className = 'form-toast success';
        toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Success! Your message has been sent directly to Ravi.';
        toast.style.display = 'block';
        form.reset();
      } else {
        await new Promise(r => setTimeout(r, 1000));
        toast.className = 'form-toast success';
        toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Demo Mode: Message simulated!';
        toast.style.display = 'block';
        form.reset();
      }
    } catch (error) {
      console.error('EmailJS Delivery Error:', error);
      toast.className = 'form-toast error';
      toast.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Delivery failed: ' + (error.text || error.message || 'Check EmailJS keys.');
      toast.style.display = 'block';
    } finally {
      isSubmitting = false;

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }

      setTimeout(() => {
        toast.style.display = 'none';
      }, 7000);
    }
  });
}

/* 9. HERO 3D ICE CUBE INTERACTIVITY */
function initIceCubeInteractivity() {
  const container = document.querySelector('.ice-cube-container') || document.querySelector('.droplet-container');
  const iceCube = document.querySelector('.ice-cube-3d') || document.querySelector('.water-droplet-3d');
  if (!container || !iceCube) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    const tiltX = (y / (rect.height / 2)) * -14;
    const tiltY = (x / (rect.width / 2)) * 14;

    iceCube.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`;
    iceCube.style.animationPlayState = 'paused';
  });

  container.addEventListener('mouseleave', () => {
    iceCube.style.transform = '';
    iceCube.style.animationPlayState = 'running';
  });
}