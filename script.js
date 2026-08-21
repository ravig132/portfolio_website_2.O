/* ==========================================================================
   LIQUID GLASS ENGINE & INTERACTIVE CONTROLLER
   Developer: Ravi Kumar Gangwar (Java Developer)
   Features: Floating Canvas Particles, 3D Tilt, Typing, Algo Visualizer
   ========================================================================== */

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

/* 2. FLUID CURSOR TRAILER */
function initFluidCursor() {
  const cursor = document.getElementById('fluid-cursor');
  const follower = document.getElementById('fluid-cursor-follower');
  if (!cursor || !follower) return;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;

    follower.style.left = `${e.clientX}px`;
    follower.style.top = `${e.clientY}px`;
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
      typeSpeed = 1800; // Pause at end
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

/* 7. LIVE ALGORITHM VISUALIZER ENGINE (BUBBLE SORT) */
function initAlgorithmVisualizer() {
  const barsArea = document.getElementById('algo-bars-area');
  const btnRun = document.getElementById('btn-run-sort');
  const btnReset = document.getElementById('btn-reset-algo');
  const statusText = document.getElementById('algo-status');

  if (!barsArea || !btnRun || !btnReset) return;

  let array = [];
  const barCount = 16;

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

/* 8. CONTACT FORM SUBMISSION TOAST */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('form-toast');

  if (!form || !toast) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    toast.className = 'form-toast success';
    toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully.';
    form.reset();

    setTimeout(() => {
      toast.style.display = 'none';
    }, 5000);
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