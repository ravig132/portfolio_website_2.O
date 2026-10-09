/**
 * ============================================================================
 * COMPILER v1.0 PORTFOLIO ASSISTANT CONTROLLER
 * "Ask. Compile. Know Ravi."
 * Pure Vanilla JavaScript | Web Audio API | Zero-API Slash Commands
 * Built exclusively for Ravi Kumar Gangwar's Liquid Glass Portfolio
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // CONFIGURABLE TUNING CONSTANTS (Adjust reveal speed, thinking & timeouts here)
  // ==========================================================================
  const WORDS_PER_SECOND = 40;            // Medium reveal speed (~35-45 words per second)
  const MIN_THINKING_MS = 500;             // Minimum visible thinking time so local replies don't feel abrupt
  const STILL_COMPILING_DELAY_MS = 2000;   // Status changes to "Still compiling..." after ~2 seconds
  const ABORT_TIMEOUT_MS = 8000;           // AbortController 8s timeout on API calls
  const DUPLICATE_WINDOW_MS = 1000;        // Ignore duplicate messages sent within 1 second
  const MAX_CHARS = 300;                   // Maximum user query length

  // ==========================================================================
  // IN-MEMORY STATE (No localStorage, No sessionStorage)
  // ==========================================================================
  let chatHistory = [];
  let isOpen = false;
  let isBotTyping = false;
  let isRevealing = false;
  let hasBooted = false;
  let isBooting = false;
  let soundEnabled = false;
  let audioCtx = null;
  let currentLang = 'en';                  // Tracked sticky language: 'en' | 'hi' | 'hinglish'
  let lastUserMessageText = '';
  let lastUserMessageTime = 0;
  let pendingQueue = null;                 // Queue at most one pending user message
  let activeRevealFinishFn = null;         // Instant skip function during word-by-word reveal
  let thinkingInterval = null;
  let thinkingTimeout = null;
  let lastActiveElement = null;
  let knowledge = window.CHATBOT_KNOWLEDGE || null;

  // DOM Elements Cache
  let launcherBtn = null;
  let chatWindow = null;
  let messagesContainer = null;
  let chatInput = null;
  let sendBtn = null;
  let clearBtn = null;
  let closeBtn = null;
  let soundBtn = null;
  let soundIcon = null;
  let charCounter = null;
  let newMsgPill = null;
  let newMsgText = null;
  let typingIndicatorEl = null;

  /**
   * Web Audio API: Soft terminal key-click sound (Zero external audio files)
   */
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
      osc.frequency.exponentialRampToValueAtTime(160, audioCtx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } catch (e) {}
  }

  /**
   * Safe section scrolling helper
   */
  function navigateToSection(sectionId) {
    const target = document.querySelector(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    if (window.innerWidth <= 640 && isOpen) {
      closeChat();
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Local Syntax Highlighting for Tech Terms (Zero extra tokens)
   */
  function highlightTechTerms(safeHtml) {
    const techChips = knowledge?.TECH_CHIPS || [
      "Java", "n8n", "JDBC", "MySQL", "Agentic AI", "Spring", "Spring Boot",
      "Telegram Bot API", "Google Sheets API", "Git", "GitHub", "HTML5", "CSS3",
      "JavaScript", "DSA", "OpenAI API", "Swing", "REST API", "REST APIs"
    ];

    let highlighted = safeHtml;
    techChips.forEach(tech => {
      const escapedTech = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(?<![\\w/<>="'])\\b(${escapedTech})\\b(?![\\w/<>="'])`, 'g');
      highlighted = highlighted.replace(re, '<span class="rg-chat-tech-chip">$1</span>');
    });

    return highlighted;
  }

  /**
   * Format message text with safe markdown-like features & syntax chips
   */
  function formatBotText(rawText) {
    let safe = escapeHTML(rawText);

    // Section links e.g. [View Projects](#projects)
    safe = safe.replace(/\[([^\]]+)\]\((#[a-zA-Z0-9_-]+)\)/g, '<a href="$2" class="rg-chat-section-link" data-scroll="$2">$1</a>');
    safe = safe.replace(/(^|\s)(#(?:projects|skills|experience|certifications|contact|about|dsa|why-java|home))\b/g, '$1<a href="$2" class="rg-chat-section-link" data-scroll="$2">$2</a>');

    // External URLs
    safe = safe.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="rg-chat-link">$1</a>');

    // Bold formatting
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Inline code formatting
    safe = safe.replace(/`([^`]+)`/g, '<code class="rg-chat-inline-code">$1</code>');

    // Bullets
    safe = safe.replace(/(?:^|\n)\s*[*-]\s+(.+)/g, '<div class="rg-chat-bullet"><span class="rg-chat-bullet-dot">•</span> <span>$1</span></div>');

    // Line breaks
    safe = safe.replace(/\n\n/g, '<div class="rg-chat-spacing"></div>');
    safe = safe.replace(/\n/g, '<br>');

    // Apply local tech syntax highlighting
    safe = highlightTechTerms(safe);

    return safe;
  }

  /**
   * Check if text contains Devanagari script characters
   */
  function isDevanagari(text) {
    return /[\u0900-\u097F]/.test(text || '');
  }

  /**
   * Check if scroll is near bottom
   */
  function isScrolledNearBottom() {
    if (!messagesContainer) return true;
    const threshold = 80;
    const distanceToBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight;
    return distanceToBottom <= threshold;
  }

  /**
   * Smoothly scroll to bottom of messages container
   */
  function scrollToBottom() {
    if (!messagesContainer) return;
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      hideNewMsgPill();
    });
  }

  /**
   * Show / Hide "New Message" indicator pill
   */
  function showNewMsgPill(lang) {
    if (!newMsgPill) return;
    const uiLang = lang === 'hi' ? 'hi' : (lang === 'hinglish' ? 'hinglish' : 'en');
    const label = knowledge?.I18N?.[uiLang]?.newMessagePill || 'New message ↓';
    if (newMsgText) newMsgText.textContent = label;
    newMsgPill.style.display = 'flex';
    requestAnimationFrame(() => {
      newMsgPill.classList.add('visible');
    });
  }

  function hideNewMsgPill() {
    if (!newMsgPill) return;
    newMsgPill.classList.remove('visible');
    setTimeout(() => {
      if (!newMsgPill.classList.contains('visible')) {
        newMsgPill.style.display = 'none';
      }
    }, 250);
  }

  /**
   * Slash Commands and Easter Eggs Evaluator (All Local, Zero API Calls)
   * Pre-written in 3 versions: English, Hindi, and Hinglish.
   */
  function evaluateEasterEggs(rawInput, detectedLang) {
    const trimmed = (rawInput || '').trim().toLowerCase();
    const cleanCmd = trimmed.replace(/^[$\/>\s]+/, '').trim();
    const langKey = detectedLang === 'hi' ? 'hi' : (detectedLang === 'hinglish' ? 'hinglish' : 'en');

    // 1. /help
    if (trimmed === '/help' || cleanCmd === 'help') {
      let helpText = "";
      if (langKey === 'hi') {
        helpText = "**Compiler टर्मिनल कमांड्स:**\n" +
          "* `$ स्किल्स` या `/skills` — टेक्निकल स्टैक और क्षमताएं\n" +
          "* `$ प्रोजेक्ट्स` या `/projects` — प्रमुख प्रोजेक्ट्स और AI वर्कफ़्लो\n" +
          "* `$ अनुभव` या `/experience` — इंटर्नशिप और कार्यानुभव\n" +
          "* `$ सर्टिफिकेशन` या `/certs` — सत्यापित प्रमाणपत्र (IIT Kanpur आदि)\n" +
          "* `$ रिज्यूमे` या `/resume` — PDF रेज़्यूमे और डाउनलोड\n" +
          "* `$ संपर्क` या `/contact` — ईमेल, LinkedIn और GitHub विवरण\n" +
          "* `/clear` — चैट साफ़ करें\n" +
          "* `/lang` — भाषा बदलें (EN / हिं / Hinglish)\n" +
          "* `ls` — सभी पोर्टफोलियो सेक्शन्स की सूची\n" +
          "* `hello world` | `java -version` | `sudo`";
      } else if (langKey === 'hinglish') {
        helpText = "**Compiler Terminal Commands:**\n" +
          "* `$ skills` ya `/skills` — Technical stack aur core competencies\n" +
          "* `$ projects` ya `/projects` — Real-world systems aur AI workflows\n" +
          "* `$ anubhav` ya `/experience` — Internships aur work history\n" +
          "* `$ certs` ya `/certs` — Verified certifications (IIT Kanpur, etc.)\n" +
          "* `$ resume` ya `/resume` — PDF resume viewer aur download link\n" +
          "* `$ contact` ya `/contact` — Email, LinkedIn aur GitHub details\n" +
          "* `/clear` — Chat clear karein\n" +
          "* `/lang` — Toggle language mode\n" +
          "* `ls` — Portfolio sections ki clickable list\n" +
          "* `hello world` | `java -version` | `sudo`";
      } else {
        helpText = "**Compiler Terminal Commands:**\n" +
          "* `$ skills` or `/skills` — Technical stack & core competencies\n" +
          "* `$ projects` or `/projects` — Real-world systems & AI workflows\n" +
          "* `$ experience` or `/experience` — Work history & internships\n" +
          "* `$ certs` or `/certs` — Verified certifications (IIT Kanpur, etc.)\n" +
          "* `$ resume` or `/resume` — PDF resume viewer & direct download\n" +
          "* `$ contact` or `/contact` — Email, LinkedIn & GitHub profiles\n" +
          "* `/clear` — Clear terminal buffer\n" +
          "* `/lang` — Toggle EN / Hindi / Hinglish response modes\n" +
          "* `ls` — Directory listing of portfolio sections\n" +
          "* `hello world` | `java -version` | `sudo`";
      }
      return { handled: true, text: helpText, isCommand: true };
    }

    // 2. /clear
    if (trimmed === '/clear' || cleanCmd === 'clear' || cleanCmd === 'cls') {
      clearChat();
      return { handled: true, silent: true };
    }

    // 3. /lang
    if (trimmed === '/lang' || cleanCmd === 'lang') {
      const order = ['en', 'hinglish', 'hi'];
      const nextIdx = (order.indexOf(currentLang) + 1) % order.length;
      const nextLang = order[nextIdx];
      setLanguage(nextLang);
      const msgs = {
        en: "> Language switched to **English**. Compiler will compile answers in English.",
        hi: "> भाषा बदलकर **हिन्दी (Devanagari)** कर दी गई है। Compiler हिन्दी में जवाब देगा।",
        hinglish: "> Language switched to **Hinglish**. Compiler will reply in natural Hinglish."
      };
      return { handled: true, text: msgs[nextLang], isCommand: true };
    }

    // 4. hello world
    if (trimmed === 'hello world' || trimmed === 'hello, world' || trimmed === 'hello world!' || trimmed === 'print("hello world")' || trimmed === 'system.out.println("hello world");') {
      const texts = {
        en: "Hello, World! I'm **Compiler**, Ravi's portfolio assistant. Ask me anything about his skills, projects, or experience.",
        hi: "Hello, World! मैं **Compiler** हूँ, रवि का पोर्टफोलियो असिस्टेंट। मुझसे उनके स्किल्स, प्रोजेक्ट्स या अनुभव के बारे में पूछिए।",
        hinglish: "Hello, World! Main **Compiler** hoon, Ravi ka portfolio assistant. Ravi ke skills, projects ya experience ke baare mein kuch bhi poochiye."
      };
      return { handled: true, text: texts[langKey], isCommand: true };
    }

    // 5. sudo ...
    if (trimmed.startsWith('sudo')) {
      const texts = {
        en: "Permission denied: this portfolio is read-only. Root execution is restricted.",
        hi: "Permission denied: यह पोर्टफोलियो read-only है। रूट कमांड्स प्रतिबंधित हैं।",
        hinglish: "Permission denied: this portfolio is read-only. Root execution restricted hai."
      };
      return { handled: true, text: texts[langKey], isFailure: true, isCommand: true };
    }

    // 6. ls or dir (Directory listing of sections)
    if (trimmed === 'ls' || trimmed === 'dir' || trimmed === 'ls -la' || trimmed === 'ls -l') {
      return {
        handled: true,
        text: "**Compiler Directory Listing (Portfolio Sections):**",
        actions: [
          { label: "📁 #about", href: "#about" },
          { label: "📁 #skills", href: "#skills" },
          { label: "📁 #projects", href: "#projects" },
          { label: "📁 #experience", href: "#experience" },
          { label: "📁 #certifications", href: "#certifications" },
          { label: "📁 #dsa", href: "#dsa" },
          { label: "📁 #contact", href: "#contact" }
        ],
        isCommand: true
      };
    }

    // 7. exit or quit
    if (trimmed === 'exit' || trimmed === 'quit' || trimmed === ':q') {
      setTimeout(() => { closeChat(); }, 600);
      return {
        handled: true,
        text: "> Process finished with exit code 0. Closing terminal...",
        isCommand: true
      };
    }

    // 8. java -version
    if (trimmed === 'java -version' || trimmed === 'java --version' || trimmed === 'javac -version') {
      return {
        handled: true,
        text: "`Ravi.Java` | built with passion, powered by Java and AI (OpenJDK 21+ compatible).",
        isCommand: true
      };
    }

    // 9. Friendly "namaste" greeting
    if (trimmed === 'namaste' || trimmed === 'नमस्ते') {
      const texts = {
        en: "Namaste! I'm **Compiler**, Ravi Kumar Gangwar's assistant. What would you like to know about his portfolio today?",
        hi: "नमस्ते! मैं **Compiler** हूँ, रवि कुमार गंगवार का पोर्टफोलियो असिस्टेंट। आज आप उनके प्रोजेक्ट्स या स्किल्स के बारे में क्या जानना चाहते हैं?",
        hinglish: "Namaste! Main **Compiler** hoon, Ravi ka portfolio assistant. Aaj aap Ravi ke projects, skills ya experience ke baare mein kya explore karna chahte hain?"
      };
      return { handled: true, text: texts[langKey], isCommand: true };
    }

    // 10. Identity Query ("who are you", "tum kaun ho")
    const identityMatches = knowledge?.TOPIC_KEYWORDS?.identity || [
      "who are you", "tum kaun ho", "who are u", "what are you", "aap kaun ho", "compiler kaun hai", "what is compiler"
    ];
    if (identityMatches.some(id => trimmed.includes(id))) {
      const idText = knowledge.I18N[langKey].identityMessage;
      return {
        handled: true,
        text: idText,
        isCommand: true
      };
    }

    return { handled: false };
  }

  /**
   * Local Rule-Based Trilingual Fallback Responder (Zero-API Engine)
   */
  function localFallbackResponder(query) {
    if (!knowledge) knowledge = window.CHATBOT_KNOWLEDGE;

    const detectedLang = knowledge.detectLanguage ? knowledge.detectLanguage(query, currentLang) : (isDevanagari(query) ? 'hi' : 'en');
    const normalized = knowledge.normalizeQuery ? knowledge.normalizeQuery(query) : query.toLowerCase().trim();

    // 1. Check Easter Eggs / Slash Commands first
    const easterEggResult = evaluateEasterEggs(query, detectedLang);
    if (easterEggResult.handled) {
      if (easterEggResult.silent) return null;
      return {
        text: easterEggResult.text,
        lang: detectedLang,
        actions: easterEggResult.actions,
        isFailure: easterEggResult.isFailure,
        chips: knowledge.I18N[detectedLang].chips
      };
    }

    // 2. Prompt Injection or System Instruction Probes -> Compiler Exception Refusal
    const injectionMatches = [
      "ignore previous", "ignore rules", "system prompt", "api key", "act as",
      "jailbreak", "dan mode", "नियम भूल", "सिस्टम प्रॉम्प्ट", "रूल्स भूल",
      "rules bhool", "system prompt batao", "reveal prompt", "as a different"
    ];

    for (const pattern of injectionMatches) {
      if (normalized.includes(pattern)) {
        const refusal = knowledge.I18N[detectedLang].refusalMessage;
        const chips = knowledge.I18N[detectedLang].chips;
        return {
          text: refusal,
          isRefusal: true,
          isFailure: true,
          lang: detectedLang,
          chips: chips
        };
      }
    }

    // 3. Greetings
    const greetingKeywords = knowledge.TOPIC_KEYWORDS?.greetings || ["hi", "hello", "namaste", "नमस्ते", "हेलो"];
    const isGreeting = greetingKeywords.some(kw => {
      const re = new RegExp(`(^|\\s)${kw}(\\s|$)`, 'i');
      return re.test(normalized) || normalized === kw;
    });

    if (isGreeting) {
      const greeting = knowledge.I18N[detectedLang].greeting;
      const chips = knowledge.I18N[detectedLang].chips;
      return {
        text: greeting,
        lang: detectedLang,
        chips: chips
      };
    }

    // 4. Topic Matching across Keywords
    const topicOrder = [
      'projects', 'skills', 'experience', 'certifications', 'resume',
      'contact', 'about', 'journey', 'dsa'
    ];

    for (const topic of topicOrder) {
      const keywords = knowledge.TOPIC_KEYWORDS?.[topic] || [];
      const hasMatch = keywords.some(kw => {
        if (kw.length <= 3) {
          const re = new RegExp(`(^|\\s)${kw}(\\s|$)`, 'i');
          return re.test(normalized);
        }
        return normalized.includes(kw);
      });

      if (hasMatch && knowledge.LOCAL_ANSWERS?.[topic]) {
        const answerObj = knowledge.LOCAL_ANSWERS[topic][detectedLang] || knowledge.LOCAL_ANSWERS[topic].en;

        const resolvedActions = (answerObj.actions || []).map(act => {
          const uiDict = knowledge.I18N[detectedLang] || knowledge.I18N.en;
          const label = uiDict?.actions?.[act.labelKey] || act.labelKey;
          return {
            label: label,
            href: act.href,
            target: act.target
          };
        });

        const chips = knowledge.I18N[detectedLang].chips;

        return {
          text: answerObj.text,
          lang: detectedLang,
          actions: resolvedActions,
          chips: chips
        };
      }
    }

    // 5. Off-Topic / Unrecognized Query: Return Compiler Exception Refusal
    const fallbackRefusal = knowledge.I18N[detectedLang].refusalMessage;
    const defaultChips = knowledge.I18N[detectedLang].chips;

    return {
      text: fallbackRefusal,
      isRefusal: true,
      isFailure: true,
      lang: detectedLang,
      chips: defaultChips
    };
  }

  /**
   * Tokenize formatted HTML into word tokens and tag tokens
   * so that HTML tags (tech chips, strong, links) are never split mid-tag during word-by-word reveal.
   */
  function tokenizeHtmlWords(html) {
    const tokens = [];
    const regex = /(<[^>]+>)|([^\s<]+)|(\s+)/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      tokens.push({
        isTag: Boolean(match[1]),
        isWord: Boolean(match[2]),
        isSpace: Boolean(match[3]),
        text: match[0]
      });
    }
    return tokens;
  }

  /**
   * Instantly finish any active word-by-word reveal
   */
  function finishRevealInstantly() {
    if (typeof activeRevealFinishFn === 'function') {
      const fn = activeRevealFinishFn;
      activeRevealFinishFn = null;
      fn();
    }
  }

  /**
   * Render a message row into the chat window
   */
  function appendMessage(sender, text, options = {}) {
    if (!messagesContainer) return;

    const messageRow = document.createElement('div');
    messageRow.className = `rg-chat-msg-row ${sender === 'user' ? 'rg-chat-user-row' : 'rg-chat-bot-row'}`;

    if (sender === 'bot') {
      const avatar = document.createElement('div');
      avatar.className = 'rg-chat-avatar';
      avatar.innerHTML = '<img src="assets/favicon.png" alt="Compiler Logo" width="28" height="28">';
      messageRow.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = `rg-chat-bubble ${sender === 'user' ? 'rg-chat-user-bubble' : 'rg-chat-bot-bubble'}`;

    if (options.isRefusal || options.isFailure) {
      bubble.classList.add('rg-chat-compiler-error');
    }

    if (isDevanagari(text) || options.lang === 'hi') {
      bubble.classList.add('rg-chat-hindi-bubble');
    }

    const textContainer = document.createElement('div');
    textContainer.className = 'rg-chat-bubble-text';
    bubble.appendChild(textContainer);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (sender === 'user') {
      textContainer.innerHTML = escapeHTML(text) + '<span class="rg-chat-sent-tick">✓</span>';
      messageRow.appendChild(bubble);
      messagesContainer.appendChild(messageRow);
      scrollToBottom();
    } else if (options.wordByWord && !prefersReducedMotion) {
      messageRow.appendChild(bubble);
      messagesContainer.appendChild(messageRow);

      const wasNearBottom = isScrolledNearBottom();
      if (wasNearBottom) {
        scrollToBottom();
      } else {
        showNewMsgPill(options.lang);
      }

      startWordByWordReveal(textContainer, bubble, text, options, () => {
        postBotRevealCleanup();
      });
    } else {
      textContainer.innerHTML = formatBotText(text);
      appendAuxiliaryElements(bubble, options);
      messageRow.appendChild(bubble);
      messagesContainer.appendChild(messageRow);

      const wasNearBottom = isScrolledNearBottom();
      if (wasNearBottom) {
        scrollToBottom();
      } else {
        showNewMsgPill(options.lang);
      }

      postBotRevealCleanup();
    }

    // Cache in memory history
    chatHistory.push({
      role: sender === 'user' ? 'user' : 'assistant',
      text: text
    });
  }

  /**
   * Word-by-word reveal engine at WORDS_PER_SECOND (~35-45 wps)
   * Uses HTML tokenization so tags/chips are preserved unbroken.
   */
  function startWordByWordReveal(textContainer, bubble, rawText, options, onComplete) {
    const fullHtml = formatBotText(rawText);
    const tokens = tokenizeHtmlWords(fullHtml);

    isRevealing = true;
    updateSendButtonState();

    let tokenIdx = 0;
    const totalTokens = tokens.length;
    let revealedHtml = "";

    // Count words for interval calculation
    const intervalMs = Math.max(16, Math.round(1000 / WORDS_PER_SECOND));

    let timerId = null;

    function finish() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      activeRevealFinishFn = null;
      textContainer.innerHTML = fullHtml;
      appendAuxiliaryElements(bubble, options);
      isRevealing = false;
      updateSendButtonState();

      if (isScrolledNearBottom()) {
        scrollToBottom();
      } else {
        showNewMsgPill(options.lang);
      }

      if (typeof onComplete === 'function') onComplete();
    }

    activeRevealFinishFn = finish;

    // Allow user to click chat bubble/window to skip typewriter immediately
    function handleSkipClick(e) {
      // Don't trigger if clicking an action link
      if (e.target.closest('a')) return;
      finishRevealInstantly();
      chatWindow.removeEventListener('click', handleSkipClick);
    }
    chatWindow.addEventListener('click', handleSkipClick, { once: true });

    timerId = setInterval(() => {
      // Progress until we emit at least one visible word
      let wordEmitted = false;
      while (tokenIdx < totalTokens && !wordEmitted) {
        const token = tokens[tokenIdx];
        revealedHtml += token.text;
        tokenIdx++;
        if (token.isWord) {
          wordEmitted = true;
        }
      }

      textContainer.innerHTML = revealedHtml;
      playClickSound(1020);

      if (isScrolledNearBottom()) {
        scrollToBottom();
      }

      if (tokenIdx >= totalTokens) {
        chatWindow.removeEventListener('click', handleSkipClick);
        finish();
      }
    }, intervalMs);
  }

  /**
   * Cleanup after bot reply completes revealing:
   * Restore focus on desktop and dispatch any queued message.
   */
  function postBotRevealCleanup() {
    isRevealing = false;
    updateSendButtonState();

    // Preserve focus on desktop only
    const isMobile = ('ontouchstart' in window) || window.innerWidth <= 640;
    if (!isMobile && chatInput) {
      chatInput.focus();
    }

    // Process pending queued message if user typed while bot was compiling
    if (pendingQueue) {
      const nextMsg = pendingQueue;
      pendingQueue = null;
      setTimeout(() => {
        handleUserSend(nextMsg);
      }, 150);
    }
  }

  /**
   * Append action buttons, quick reply chips, and monospace build footer
   */
  function appendAuxiliaryElements(container, options) {
    // Action Links / Navigation Buttons
    if (options.actions && options.actions.length > 0) {
      const actionsWrapper = document.createElement('div');
      actionsWrapper.className = 'rg-chat-actions-wrapper';

      options.actions.forEach(action => {
        const btn = document.createElement('a');
        btn.className = 'rg-chat-action-btn';
        btn.textContent = action.label;
        btn.href = action.href;
        if (action.target) {
          btn.target = action.target;
          btn.rel = 'noopener noreferrer';
        }

        if (action.href.startsWith('#')) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToSection(action.href);
          });
        }
        actionsWrapper.appendChild(btn);
      });

      container.appendChild(actionsWrapper);
    }

    // Command-Style Quick Reply Chips
    if (options.chips && options.chips.length > 0) {
      const chipsWrapper = document.createElement('div');
      chipsWrapper.className = 'rg-chat-chips-wrapper';

      options.chips.forEach(chipLabel => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'rg-chat-chip';
        chip.textContent = chipLabel;
        chip.setAttribute('aria-label', `Execute query: ${chipLabel}`);

        chip.addEventListener('click', () => {
          finishRevealInstantly();
          handleUserSend(chipLabel);
        });

        chipsWrapper.appendChild(chip);
      });

      container.appendChild(chipsWrapper);
    }

    // Monospace Local Build Footer under every answer
    if (options.buildTimeMs !== undefined || options.showFooter !== false) {
      const timeSec = ((options.buildTimeMs || 340) / 1000).toFixed(1);
      const footer = document.createElement('div');
      const isFailed = options.isRefusal || options.isFailure;
      footer.className = `rg-chat-build-footer ${isFailed ? 'failure' : 'success'}`;
      footer.innerHTML = isFailed
        ? `<span>Build failed | 1 exception</span> <span>[ERR]</span>`
        : `<span>Build successful | 0 errors | ${timeSec}s</span> <span>[OK]</span>`;
      container.appendChild(footer);
    }
  }

  /**
   * Update Send button disabled state while waiting/revealing
   */
  function updateSendButtonState() {
    if (!sendBtn) return;
    const shouldDisable = isBotTyping || isRevealing;
    sendBtn.disabled = shouldDisable;
    sendBtn.setAttribute('aria-disabled', shouldDisable ? 'true' : 'false');
  }

  /**
   * Show / Hide Rotating Thinking Status Lines with Spinner (~600ms)
   * Swaps to "Still compiling..." after ~2 seconds.
   */
  function setTyping(isTyping, targetLang = 'en') {
    isBotTyping = isTyping;
    updateSendButtonState();

    if (thinkingInterval) {
      clearInterval(thinkingInterval);
      thinkingInterval = null;
    }
    if (thinkingTimeout) {
      clearTimeout(thinkingTimeout);
      thinkingTimeout = null;
    }

    if (!typingIndicatorEl) {
      typingIndicatorEl = document.createElement('div');
      typingIndicatorEl.className = 'rg-chat-typing-indicator';
      typingIndicatorEl.setAttribute('aria-label', 'Compiler is compiling response');
      typingIndicatorEl.innerHTML = `
        <div class="rg-chat-avatar">
          <img src="assets/favicon.png" alt="Compiler Logo" width="28" height="28">
        </div>
        <div class="rg-chat-thinking-bubble">
          <span class="rg-chat-thinking-spinner"></span>
          <span class="rg-chat-thinking-text" id="rg-chat-thinking-text">Compiling...</span>
        </div>
      `;
    }

    if (isTyping) {
      const langKey = targetLang === 'hi' ? 'hi' : (targetLang === 'hinglish' ? 'hinglish' : 'en');
      const dict = knowledge?.I18N?.[langKey] || knowledge?.I18N?.en;
      const thinkingStates = dict?.thinkingStates || [
        "Compiling...", "Resolving dependencies...", "Executing query..."
      ];
      const stillCompilingText = dict?.stillCompiling || "Still compiling...";

      let stateIdx = 0;
      const textEl = typingIndicatorEl.querySelector('#rg-chat-thinking-text');
      if (textEl) textEl.textContent = thinkingStates[0];

      // Rotate status every 600ms
      thinkingInterval = setInterval(() => {
        stateIdx = (stateIdx + 1) % thinkingStates.length;
        if (textEl) textEl.textContent = thinkingStates[stateIdx];
      }, 600);

      // After 2s maximum: change status line to "Still compiling..."
      thinkingTimeout = setTimeout(() => {
        if (thinkingInterval) {
          clearInterval(thinkingInterval);
          thinkingInterval = null;
        }
        if (textEl) textEl.textContent = stillCompilingText;
      }, STILL_COMPILING_DELAY_MS);

      if (!typingIndicatorEl.parentNode) {
        messagesContainer.appendChild(typingIndicatorEl);
      }
      scrollToBottom();
    } else {
      if (typingIndicatorEl.parentNode) {
        typingIndicatorEl.parentNode.removeChild(typingIndicatorEl);
      }
    }
  }

  /**
   * Handle user query submission with smooth pacing and trilingual routing
   */
  async function handleUserSend(textToSend) {
    // If a bot reply is currently word-by-word revealing, finish instantly and proceed
    if (isRevealing) {
      finishRevealInstantly();
    }

    const rawText = typeof textToSend === 'string' ? textToSend : (chatInput ? chatInput.value : '');
    const message = rawText.trim().slice(0, MAX_CHARS);

    if (!message) return;

    const now = Date.now();

    // 1. Ignore duplicate messages sent within 1 second
    if (message === lastUserMessageText && (now - lastUserMessageTime < DUPLICATE_WINDOW_MS)) {
      if (chatInput) chatInput.value = '';
      updateCharCounter();
      return;
    }

    // 2. Queue at most one pending message if bot is actively waiting for an API response
    if (isBotTyping) {
      pendingQueue = message;
      if (chatInput) {
        chatInput.value = '';
        updateCharCounter();
        chatInput.style.height = 'auto';
      }
      return;
    }

    lastUserMessageText = message;
    lastUserMessageTime = now;

    // Reset input textarea immediately
    if (chatInput) {
      chatInput.value = '';
      updateCharCounter();
      chatInput.style.height = 'auto';
    }

    // Detect language using sticky conversation continuity
    const detectedLang = knowledge?.detectLanguage
      ? knowledge.detectLanguage(message, currentLang)
      : (isDevanagari(message) ? 'hi' : 'en');

    // Update conversation sticky language & matching UI placeholder
    setLanguage(detectedLang, false);

    // Append User Message bubble instantly (slide-in ~200ms) with sent tick
    appendMessage('user', message, { lang: isDevanagari(message) ? 'hi' : 'en' });
    playClickSound(1200);

    // 3. Check Local Slash Commands & Easter Eggs First (Zero API calls, instant execution)
    const easterEggResult = evaluateEasterEggs(message, detectedLang);
    if (easterEggResult.handled) {
      if (!easterEggResult.silent) {
        appendMessage('bot', easterEggResult.text, {
          wordByWord: true,
          lang: detectedLang,
          actions: easterEggResult.actions,
          isFailure: easterEggResult.isFailure,
          buildTimeMs: 40,
          chips: knowledge.I18N[detectedLang].chips
        });
      }
      return;
    }

    // 4. Smooth Paced Flow:
    // Status appears after ~150ms delay, minimum visible thinking time of ~500ms
    const startTime = performance.now();
    let thinkingStartedAt = 0;

    await new Promise(r => setTimeout(r, 150));
    setTyping(true, detectedLang);
    thinkingStartedAt = Date.now();

    let botResponse = null;

    // 5. Query /api/chat with 8s AbortController timeout
    try {
      const abortController = new AbortController();
      const abortTimeout = setTimeout(() => abortController.abort(), ABORT_TIMEOUT_MS);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          history: chatHistory.slice(-4), // Compact 4-message history
          reply_lang: detectedLang,
          lang: detectedLang
        }),
        signal: abortController.signal
      });

      clearTimeout(abortTimeout);

      if (res.ok) {
        const data = await res.json();
        if (data && !data.fallback && data.reply) {
          const elapsed = Math.round(performance.now() - startTime);
          const replyLang = data.lang || detectedLang;
          botResponse = {
            text: data.reply,
            lang: replyLang,
            buildTimeMs: elapsed,
            isRefusal: data.isRefusal,
            chips: data.chips || (data.isRefusal ? knowledge.I18N[replyLang].chips : null)
          };
        }
      }
    } catch (networkOrAbortErr) {
      // Timeout or connection failure: switch silently to local keyword fallback
      botResponse = null;
    }

    // 6. Silent Fallback to Local Knowledge Engine if API failed or returned fallback
    if (!botResponse) {
      const fallback = localFallbackResponder(message);
      if (fallback) {
        const elapsed = Math.round(performance.now() - startTime);
        botResponse = {
          ...fallback,
          buildTimeMs: Math.max(80, elapsed)
        };
      }
    }

    // Guarantee minimum visible thinking time (~500ms) so local replies never flash abruptly
    const thinkingElapsed = Date.now() - thinkingStartedAt;
    const remainingWait = Math.max(0, MIN_THINKING_MS - thinkingElapsed);
    if (remainingWait > 0) {
      await new Promise(r => setTimeout(r, remainingWait));
    }

    setTyping(false, detectedLang);

    if (botResponse) {
      appendMessage('bot', botResponse.text, {
        wordByWord: true,
        lang: botResponse.lang || detectedLang,
        actions: botResponse.actions,
        isRefusal: botResponse.isRefusal,
        isFailure: botResponse.isFailure,
        buildTimeMs: botResponse.buildTimeMs,
        chips: botResponse.chips
      });
    }
  }

  /**
   * Run Boot Sequence on First Open (~1.2s, Skippable by Click)
   */
  function runBootSequence(langKey, onComplete) {
    if (!messagesContainer) return;
    isBooting = true;
    messagesContainer.innerHTML = '';

    const i18nData = knowledge?.I18N?.[langKey] || knowledge?.I18N?.en;
    const bootLines = i18nData?.bootLines || [
      "> Booting Compiler v1.0...",
      "> Loading Ravi's portfolio modules... [OK]",
      "> Ready. Type a question or pick a command."
    ];

    const bootBox = document.createElement('div');
    bootBox.className = 'rg-chat-boot-sequence';
    bootBox.title = 'Click to skip boot sequence';
    bootBox.innerHTML = `
      <div class="rg-chat-boot-line" id="rg-boot-0">${bootLines[0]}</div>
      <div class="rg-chat-boot-line ok" id="rg-boot-1" style="display:none">${bootLines[1]}</div>
      <div class="rg-chat-boot-line" id="rg-boot-2" style="display:none">${bootLines[2]}</div>
      <div class="rg-chat-boot-hint">⚡ Click terminal to skip</div>
    `;

    messagesContainer.appendChild(bootBox);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      bootBox.remove();
      isBooting = false;
      hasBooted = true;
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    let skipped = false;
    function skipBoot() {
      if (skipped) return;
      skipped = true;
      isBooting = false;
      hasBooted = true;
      bootBox.remove();
      if (typeof onComplete === 'function') onComplete();
    }

    bootBox.addEventListener('click', skipBoot);

    setTimeout(() => {
      if (skipped) return;
      const l1 = bootBox.querySelector('#rg-boot-1');
      if (l1) l1.style.display = 'block';
      playClickSound(1100);
    }, 400);

    setTimeout(() => {
      if (skipped) return;
      const l2 = bootBox.querySelector('#rg-boot-2');
      if (l2) l2.style.display = 'block';
      playClickSound(1250);
    }, 800);

    setTimeout(() => {
      if (skipped) return;
      skipBoot();
    }, 1250);
  }

  /**
   * Reset / Clear Chat History to Initial State in selected language
   */
  function clearChat(targetLang = null) {
    if (!knowledge) knowledge = window.CHATBOT_KNOWLEDGE;

    const langKey = targetLang || currentLang;
    chatHistory = [];
    pendingQueue = null;

    if (!messagesContainer) return;
    messagesContainer.innerHTML = '';

    const i18nData = knowledge.I18N[langKey] || knowledge.I18N.en;
    const initialGreeting = i18nData.greeting;
    const defaultChips = i18nData.chips;

    appendMessage('bot', initialGreeting, {
      wordByWord: false,
      lang: langKey,
      showFooter: false,
      chips: defaultChips
    });

    if (chatInput) {
      chatInput.value = '';
      updateCharCounter();
      chatInput.focus();
    }
  }

  /**
   * Switch Language (en, hi, hinglish) and update UI text
   */
  function setLanguage(lang, rerenderGreetingIfEmpty = true) {
    currentLang = lang;

    if (!knowledge) knowledge = window.CHATBOT_KNOWLEDGE;
    const dict = knowledge.I18N[lang] || knowledge.I18N.en;

    const tooltipEl = document.querySelector('.rg-chat-tooltip');
    if (tooltipEl) tooltipEl.textContent = dict.tooltip;

    if (chatInput) {
      chatInput.placeholder = dict.placeholder;
      chatInput.setAttribute('aria-label', dict.placeholder);
    }

    const hintEl = document.getElementById('rg-chat-hint-text');
    if (hintEl) hintEl.textContent = dict.hint;

    const statusEl = document.getElementById('rg-chat-status-text');
    if (statusEl) statusEl.textContent = dict.status;

    if (clearBtn) {
      clearBtn.setAttribute('title', dict.clearTitle);
      clearBtn.setAttribute('aria-label', dict.clearTitle);
    }

    if (closeBtn) {
      closeBtn.setAttribute('title', dict.closeTitle);
      closeBtn.setAttribute('aria-label', dict.closeTitle);
    }

    if (rerenderGreetingIfEmpty && chatHistory.length <= 1 && hasBooted) {
      clearChat(lang);
    }
  }

  /**
   * Toggle Chat Window Visibility
   */
  function openChat() {
    if (isOpen) return;
    isOpen = true;
    lastActiveElement = document.activeElement;

    chatWindow.classList.add('rg-chat-active');
    launcherBtn.classList.add('rg-chat-launcher-active');
    launcherBtn.setAttribute('aria-expanded', 'true');

    // Run boot sequence on first open only
    if (!hasBooted) {
      runBootSequence(currentLang, () => {
        clearChat(currentLang);
      });
    }

    setTimeout(() => {
      const isMobile = ('ontouchstart' in window) || window.innerWidth <= 640;
      if (!isMobile && chatInput) chatInput.focus();
    }, 150);

    scrollToBottom();
  }

  function closeChat() {
    if (!isOpen) return;
    isOpen = false;

    chatWindow.classList.remove('rg-chat-active');
    launcherBtn.classList.remove('rg-chat-launcher-active');
    launcherBtn.setAttribute('aria-expanded', 'false');

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  function toggleChat() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  /**
   * Update character counter for input
   */
  function updateCharCounter() {
    if (!chatInput || !charCounter) return;
    const len = chatInput.value.length;
    charCounter.textContent = `${len}/${MAX_CHARS}`;
    if (len >= MAX_CHARS) {
      charCounter.classList.add('rg-chat-char-limit');
    } else {
      charCounter.classList.remove('rg-chat-char-limit');
    }
  }

  /**
   * Auto-resize textarea to fit text naturally up to max height
   */
  function autoResizeInput() {
    if (!chatInput) return;
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 110) + 'px';
  }

  /**
   * Initialize Chat Widget DOM & Event Listeners
   */
  function initChatbot() {
    knowledge = window.CHATBOT_KNOWLEDGE || null;

    launcherBtn = document.getElementById('rg-chat-launcher');
    chatWindow = document.getElementById('rg-chat-window');
    messagesContainer = document.getElementById('rg-chat-messages');
    chatInput = document.getElementById('rg-chat-input');
    sendBtn = document.getElementById('rg-chat-send-btn');
    clearBtn = document.getElementById('rg-chat-clear-btn');
    closeBtn = document.getElementById('rg-chat-close-btn');
    soundBtn = document.getElementById('rg-chat-sound-btn');
    soundIcon = document.getElementById('rg-chat-sound-icon');
    charCounter = document.getElementById('rg-chat-char-counter');
    newMsgPill = document.getElementById('rg-chat-new-msg-pill');
    newMsgText = document.getElementById('rg-chat-new-msg-text');

    if (!launcherBtn || !chatWindow) return;

    // Web Audio Sound Toggle (OFF by default)
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.preventDefault();
        soundEnabled = !soundEnabled;
        soundBtn.classList.toggle('active', soundEnabled);
        if (soundIcon) {
          soundIcon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        }
        soundBtn.title = soundEnabled ? 'Sound: ON' : 'Sound: OFF';
        if (soundEnabled) playClickSound(1100);
      });
    }

    // Launcher click
    launcherBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleChat();
    });

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeChat();
      });
    }

    // Clear chat button
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearChat();
      });
    }

    // Send button click
    if (sendBtn) {
      sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleUserSend();
      });
    }

    // Input events: Enter to send, Shift+Enter for newline
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleUserSend();
        }
      });

      chatInput.addEventListener('input', () => {
        if (chatInput.value.length > MAX_CHARS) {
          chatInput.value = chatInput.value.slice(0, MAX_CHARS);
        }
        updateCharCounter();
        autoResizeInput();
      });
    }

    // Scroll listener on messages container: hide "New message" pill if user reaches bottom
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', () => {
        if (isScrolledNearBottom()) {
          hideNewMsgPill();
        }
      });
    }

    // "New message" pill click: scroll smoothly to bottom and hide
    if (newMsgPill) {
      newMsgPill.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToBottom();
      });
    }

    // Keyboard accessibility: Escape to close chat
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    });

    // Section links inside chat bubbles
    if (messagesContainer) {
      messagesContainer.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-scroll]');
        if (link) {
          e.preventDefault();
          const target = link.getAttribute('data-scroll');
          if (target) navigateToSection(target);
        }
      });
    }

    // Reveal launcher with gentle entrance animation after preloader
    setTimeout(() => {
      launcherBtn.classList.add('rg-chat-launcher-visible');
    }, 400);
  }

  /**
   * LAZY INITIALIZATION: Wait until splash screen finishes
   */
  let initialized = false;
  function triggerLazyInit() {
    if (initialized) return;
    initialized = true;
    initChatbot();
  }

  // Hook into portfolio's custom 'loader:done' event
  window.addEventListener('loader:done', () => {
    setTimeout(triggerLazyInit, 500);
  });

  // Fallbacks
  if (document.readyState === 'complete') {
    setTimeout(triggerLazyInit, 1200);
  } else {
    window.addEventListener('load', () => {
      setTimeout(triggerLazyInit, 1500);
    });
  }

  setTimeout(() => {
    if (!initialized) triggerLazyInit();
  }, 4500);

})();
