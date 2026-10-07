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
  initPreloader();
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

/* ==========================================================================
   10. FULL-SCREEN PRELOADER & SPLASH SCREEN CONTROLLER (UPGRADED)
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const welcomeText = document.getElementById('pl-welcome-text');
  const welcomeTitle = document.getElementById('pl-welcome-title');
  const statusLine = document.getElementById('pl-status-line');
  const progressFill = document.getElementById('pl-progress-fill');
  const counter = document.getElementById('pl-counter');
  const codeStream = document.getElementById('pl-code-stream');
  const consolePanel = document.getElementById('pl-console-panel');
  const consoleOutput = document.getElementById('pl-console-output');
  const codeBg = document.getElementById('pl-code-bg');
  const logoWrapper = document.getElementById('pl-logo-wrapper');
  const hintText = document.getElementById('pl-hint-text');
  const skipBtn = document.getElementById('pl-skip-btn');
  const soundBtn = document.getElementById('pl-sound-btn');
  const soundIcon = document.getElementById('pl-sound-icon');
  const soundText = document.getElementById('pl-sound-text');
  const particleCanvas = document.getElementById('pl-particles');

  // Preloader State Variables (declared early to prevent Temporal Dead Zone ReferenceErrors)
  let isExited = false;
  let isBoosted = false;
  let progress = 0;
  let currentStage = 1;
  let linesRendered = 0;
  let consoleLinesRendered = 0;
  let soundEnabled = false;
  let audioCtx = null;
  let progressInterval = null;
  let isWindowLoaded = document.readyState === 'complete';

  // Lock page scrolling while preloader is active
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  // 10.1 Web Audio API: Soft Synth Keyboard Click (No Audio Files, Opt-In)

  function playClickSound(freq = 950) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEnabled = !soundEnabled;
      soundBtn.classList.toggle('active', soundEnabled);
      if (soundIcon) {
        soundIcon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      }
      if (soundText) {
        soundText.textContent = soundEnabled ? 'Sound: ON' : 'Sound: OFF';
      }
      if (soundEnabled) playClickSound(1100);
    });
  }

  // 10.2 Background Java Program to Type (Visual Simulation Only)
  const javaCodeLines = [
    '<span class="pl-kw">public class</span> <span class="pl-cls">Portfolio</span> {',
    '    <span class="pl-kw">public static void</span> <span class="pl-fn">main</span>(<span class="pl-cls">String</span>[] args) {',
    '        <span class="pl-cls">Developer</span> <span class="pl-var">ravi</span> = <span class="pl-kw">new</span> <span class="pl-cls">Developer</span>(<span class="pl-str">"Ravi Kumar Gangwar"</span>);',
    '        ravi.<span class="pl-fn">addSkill</span>(<span class="pl-str">"Java"</span>);',
    '        ravi.<span class="pl-fn">addSkill</span>(<span class="pl-str">"n8n"</span>);',
    '        ravi.<span class="pl-fn">addSkill</span>(<span class="pl-str">"Agentic AI"</span>);',
    '        ravi.<span class="pl-fn">connect</span>(<span class="pl-str">"MySQL"</span>, <span class="pl-str">"JDBC"</span>);',
    '        <span class="pl-cls">System</span>.out.<span class="pl-fn">println</span>(<span class="pl-str">"Welcome to Ravi.Java"</span>);',
    '        ravi.<span class="pl-fn">launch</span>();',
    '    }',
    '}'
  ];

  // Simulated Console Output Lines
  const consoleLines = [
    '<div class="pl-console-line"><span class="pl-kw">$</span> javac Portfolio.java</div>',
    '<div class="pl-console-line success">Compiling... OK (0 errors, 0 warnings)</div>',
    '<div class="pl-console-line"><span class="pl-kw">$</span> java Portfolio</div>',
    '<div class="pl-console-line">Loading modules: [Java] [n8n] [AI Agents] [JDBC]</div>',
    '<div class="pl-console-line">Server started on port 8080</div>',
    '<div class="pl-console-line success">Build successful. Launching portfolio...</div>'
  ];

  // Foreground Status Messages
  const statusMessages = [
    '> Initializing Java environment...',
    '> Compiling portfolio.java...',
    '> Connecting n8n workflows...',
    '> Loading AI agents...',
    '> Build successful. Entering site...'
  ];

  // 10.3 Welcome Message Typing Effect
  const welcomeTarget = 'Welcome to Ravi.Java';
  let welcomeCharIndex = 0;
  function typeWelcome() {
    if (!welcomeText) return;
    if (welcomeCharIndex < welcomeTarget.length) {
      welcomeCharIndex++;
      const current = welcomeTarget.substring(0, welcomeCharIndex);
      if (current.includes('.Java')) {
        const parts = current.split('.Java');
        welcomeText.innerHTML = parts[0] + '<span class="pl-accent">.Java</span>';
      } else {
        welcomeText.textContent = current;
      }
      playClickSound(800 + welcomeCharIndex * 20);
      setTimeout(typeWelcome, isBoosted ? 20 : 45);
    }
  }
  setTimeout(typeWelcome, 160);

  // 10.4 Progress & Synchronization Logic
  preloader.classList.add('pl-stage-1');

  // Trigger brief glitch on stage change
  function setStage(stage) {
    if (currentStage === stage) return;
    currentStage = stage;
    preloader.classList.remove('pl-stage-1', 'pl-stage-2', 'pl-stage-3', 'pl-stage-4');
    preloader.classList.add(`pl-stage-${stage}`);

    if (welcomeTitle) {
      welcomeTitle.classList.remove('pl-glitch');
      void welcomeTitle.offsetWidth; // Trigger reflow
      welcomeTitle.classList.add('pl-glitch');
    }
    playClickSound(1250);
  }

  // Interval loop for progress
  const intervalTime = 25; // ms
  const baseIncrement = 100 / (3200 / intervalTime); // ~3.2 seconds default

  progressInterval = setInterval(() => {
    const inc = isBoosted ? baseIncrement * 2.8 : baseIncrement;
    progress = Math.min(progress + inc, 100);

    // Update bar and percentage
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (counter) counter.textContent = `${Math.floor(progress)}%`;

    // Stage 1 (0% - 25%): Typing the Java code line-by-line
    if (progress < 25) {
      setStage(1);
      if (statusLine) statusLine.textContent = statusMessages[0];
      const targetLines = Math.min(Math.floor((progress / 25) * javaCodeLines.length) + 1, javaCodeLines.length);
      if (targetLines > linesRendered && codeStream) {
        linesRendered = targetLines;
        codeStream.innerHTML = javaCodeLines.slice(0, linesRendered).join('\n');
        playClickSound(750 + linesRendered * 30);
      }
    } 
    // Stage 2 (25% - 50%): "javac" Compiling
    else if (progress < 50) {
      setStage(2);
      if (statusLine) statusLine.textContent = statusMessages[1];
      if (linesRendered < javaCodeLines.length && codeStream) {
        linesRendered = javaCodeLines.length;
        codeStream.innerHTML = javaCodeLines.join('\n');
      }
      if (consolePanel && !consolePanel.classList.contains('active')) {
        consolePanel.classList.add('active');
      }
      const targetConsole = Math.min(Math.floor(((progress - 25) / 25) * 2) + 1, 2);
      if (targetConsole > consoleLinesRendered && consoleOutput) {
        consoleLinesRendered = targetConsole;
        consoleOutput.innerHTML = consoleLines.slice(0, consoleLinesRendered).join('');
        playClickSound(900);
      }
    } 
    // Stage 3 (50% - 80%): "java Portfolio" Running & Module Loading
    else if (progress < 80) {
      setStage(3);
      if (statusLine) statusLine.textContent = progress < 65 ? statusMessages[2] : statusMessages[3];
      const targetConsole = Math.min(2 + Math.floor(((progress - 50) / 30) * 3) + 1, 5);
      if (targetConsole > consoleLinesRendered && consoleOutput) {
        consoleLinesRendered = targetConsole;
        consoleOutput.innerHTML = consoleLines.slice(0, consoleLinesRendered).join('');
        playClickSound(1050);
      }
    } 
    // Stage 4 (80% - 100%): "Build successful" & Entering Site
    else {
      setStage(4);
      if (statusLine) statusLine.textContent = statusMessages[4];
      if (consoleLinesRendered < consoleLines.length && consoleOutput) {
        consoleLinesRendered = consoleLines.length;
        consoleOutput.innerHTML = consoleLines.join('');
        playClickSound(1300);
      }
    }

    // Check completion
    if (progress >= 100) {
      clearInterval(progressInterval);
      checkAndExit();
    }
  }, intervalTime);

  // 10.5 Interactive Hold-to-Boost & Click Ripple
  preloader.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#pl-skip-btn') || e.target.closest('#pl-sound-btn')) return;
    isBoosted = true;
    if (hintText) hintText.classList.add('active');

    // Create ripple effect
    createRipple(e.clientX, e.clientY);
    progress = Math.min(progress + 3, 99);
    playClickSound(1200);
  });

  const stopBoost = () => {
    isBoosted = false;
    if (hintText) hintText.classList.remove('active');
  };
  window.addEventListener('pointerup', stopBoost);
  window.addEventListener('pointercancel', stopBoost);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      isBoosted = true;
      if (hintText) hintText.classList.add('active');
    }
    if (e.code === 'Enter' || e.code === 'Escape') {
      triggerSkip();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      isBoosted = false;
      if (hintText) hintText.classList.remove('active');
    }
  });

  function createRipple(x, y) {
    const ripple = document.createElement('span');
    ripple.className = 'pl-ripple';
    const size = Math.max(window.innerWidth, window.innerHeight) * 0.38;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    preloader.appendChild(ripple);
    setTimeout(() => ripple.remove(), 900);
  }

  // 10.6 Skip Button Setup
  setTimeout(() => {
    if (skipBtn) skipBtn.classList.add('visible');
  }, 400);

  function triggerSkip() {
    if (isExited) return;
    if (progressInterval) clearInterval(progressInterval);
    progress = 100;
    if (progressFill) progressFill.style.width = '100%';
    if (counter) counter.textContent = '100%';
    if (codeStream) codeStream.innerHTML = javaCodeLines.join('\n');
    if (consoleOutput) consoleOutput.innerHTML = consoleLines.join('');
    completePreloader();
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerSkip();
    });
    skipBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
    });
  }

  // 10.7 Mouse & Touch Parallax
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowEnd = window.innerWidth < 600 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  if (!isReducedMotion && !isLowEnd) {
    let mouseX = 0, mouseY = 0;
    preloader.addEventListener('mousemove', (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW;
      mouseY = (e.clientY - halfH) / halfH;

      if (codeBg) {
        codeBg.style.transform = `translate(${-mouseX * 16}px, ${-mouseY * 16}px)`;
      }
      if (logoWrapper) {
        logoWrapper.style.transform = `perspective(700px) rotateX(${-mouseY * 12}deg) rotateY(${mouseX * 12}deg)`;
      }
    });
  }

  // 10.8 Floating Particle Canvas (Lightweight Ambient Droplets)
  if (particleCanvas && !isReducedMotion && !isLowEnd) {
    const pCtx = particleCanvas.getContext('2d');
    let pWidth = particleCanvas.width = window.innerWidth;
    let pHeight = particleCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      pWidth = particleCanvas.width = window.innerWidth;
      pHeight = particleCanvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: pWidth / 2 + (Math.random() - 0.5) * 360,
        y: pHeight / 2 + (Math.random() - 0.5) * 360,
        r: Math.random() * 2.5 + 1.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    function renderParticles() {
      if (isExited) return;
      pCtx.clearRect(0, 0, pWidth, pHeight);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around center area
        if (p.x < pWidth / 2 - 220) p.x = pWidth / 2 + 220;
        if (p.x > pWidth / 2 + 220) p.x = pWidth / 2 - 220;
        if (p.y < pHeight / 2 - 220) p.y = pHeight / 2 + 220;
        if (p.y > pHeight / 2 + 220) p.y = pHeight / 2 - 220;

        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(0, 242, 255, ${p.alpha})`;
        pCtx.shadowBlur = 8;
        pCtx.shadowColor = '#00f2ff';
        pCtx.fill();
      });

      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }

  // 10.9 Window Load Synchronization & Exit Sequence
  if (!isWindowLoaded) {
    window.addEventListener('load', () => {
      isWindowLoaded = true;
    });
  }

  function checkAndExit() {
    completePreloader();
  }

  // Safety maximum timeout so site is never blocked
  setTimeout(() => {
    if (!isExited) completePreloader();
  }, 5000);

  function completePreloader() {
    if (isExited) return;
    isExited = true;
    if (progressInterval) clearInterval(progressInterval);

    // Final moment: freeze rotation, scale up, update status message
    preloader.classList.add('pl-final-moment');
    if (welcomeText) {
      welcomeText.innerHTML = 'Build successful. Entering <span class="pl-accent">Ravi.Java...</span>';
    }
    if (statusLine) {
      statusLine.textContent = '> Site ready. Welcome aboard!';
    }
    playClickSound(1500);

    // Restore normal page scroll immediately
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    // Liquid dissolve and circular reveal
    setTimeout(() => {
      preloader.classList.add('pl-fade-out');

      // Dispatch custom loader:done event
      window.dispatchEvent(new CustomEvent('loader:done'));

      // Remove from DOM after exit animation finishes
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 760);
    }, 280);
  }
}