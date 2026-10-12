/**
 * ============================================================================
 * COMPILER v1.0 KNOWLEDGE BASE & TRILINGUAL ENGINE
 * Assistant Name: "Compiler" | Tagline: "Ask. Compile. Know Ravi."
 * Single source of truth shared between /api/chat and the browser client.
 * Trilingual Support: English (en), Hindi Devanagari (hi), Hinglish (hinglish).
 * ============================================================================
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CHATBOT_KNOWLEDGE = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // Brand Metadata
  const BRAND = {
    name: "Compiler",
    version: "v2.0",
    tagline: "Ask. Compile. Know Ravi.",
    subtitle: "v2.0 | Ravi.Java"
  };

  // Common Hinglish words and markers for accurate client-side detection
  const HINGLISH_WORDS = [
    "kya", "kaise", "kaun", "kitne", "kahan", "hai", "hain", "ho", "tha", "thi", "the",
    "mujhe", "mera", "meri", "mere", "apka", "aapka", "aapki", "aapke", "batao", "bataiye",
    "dikhao", "bolo", "kar", "karo", "karta", "karti", "karte", "karna", "wala", "wale", "wali",
    "ke baare mein", "baare", "mein", "kaam", "anubhav", "sampark", "naam", "nahi", "haan",
    "aur", "bhi", "kuch", "sab", "acha", "theek", "bhai", "yaar", "ravi ka", "ravi ke", "ravi ki",
    "chahiye", "aati", "aate", "aata", "kahan ki", "kisko", "kisne", "kab", "kyun", "kyu",
    "batayein", "sikha", "shuru", "pehle", "kariye", "karo", "achha"
  ];

  // Ambiguous/short phrases for sticky language continuity
  const AMBIGUOUS_WORDS = [
    "ok", "okay", "aur batao", "thanks", "thank you", "thx", "hmm", "hm",
    "projects", "skills", "experience", "certs", "resume", "contact", "about",
    "dsa", "hi", "hello", "hey", "aur", "more", "next", "accha", "theek hai", "achha", "aur kuch"
  ];

  // Localized UI Strings, System Messages & Prompts across 3 languages
  const I18N = {
    en: {
      assistantName: "Compiler",
      tagline: "Ask. Compile. Know Ravi.",
      greeting: "Hi! I'm Compiler, Ravi's portfolio assistant. Ask me anything about his skills, projects, experience, or contact info. Want to see his projects?",
      chips: ["$ skills", "$ projects", "$ experience", "$ certs", "$ resume", "$ contact"],
      refusalMessage: "Exception: OffTopicException\nCompiler only runs queries about Ravi's portfolio.\nTry: skills, projects, experience, certs or contact.",
      unknownInfoMessage: "Warning: Data not found. Please check the Contact section to reach Ravi directly.",
      identityMessage: "I'm Compiler, Ravi's portfolio assistant. I only compile answers about Ravi Kumar Gangwar's skills, projects, experience and contact info.",
      placeholder: "Ask or type a command (/help)...",
      tooltip: "Run a query on Ravi",
      clearTitle: "Clear chat (/clear)",
      closeTitle: "Close chat (Esc)",
      status: "v2.0 | Ravi.Java",
      hint: "Enter to send • Shift+Enter for new line",
      stillCompiling: "Still compiling...",
      newMessagePill: "New message ↓",
      bootLines: [
        "> Booting Compiler v2.0...",
        "> Loading Ravi's portfolio modules... [OK]",
        "> Ready. Type a question or pick a command."
      ],
      thinkingStates: [
        "Compiling...",
        "Resolving dependencies...",
        "Executing query..."
      ],
      actions: {
        projects: "View All Projects",
        skills: "Explore Skills Section",
        experience: "View Experience",
        certifications: "View Certifications",
        resume: "View Resume Section",
        resumePdf: "Open PDF Document",
        contact: "Go to Contact Form",
        about: "Read Full About Story",
        dsa: "Open Algorithm Visualizer"
      }
    },
    hi: {
      assistantName: "Compiler",
      tagline: "Ask. Compile. Know Ravi.",
      greeting: "नमस्ते! मैं Compiler हूँ, रवि का पोर्टफोलियो असिस्टेंट। उनके स्किल्स, प्रोजेक्ट्स, अनुभव या संपर्क के बारे में कुछ भी पूछिए। क्या आप उनके प्रोजेक्ट्स देखना चाहते हैं?",
      chips: ["$ स्किल्स", "$ प्रोजेक्ट्स", "$ अनुभव", "$ सर्टिफिकेशन", "$ रिज्यूमे", "$ संपर्क"],
      refusalMessage: "Exception: OffTopicException\nCompiler सिर्फ़ रवि के पोर्टफोलियो से जुड़े सवालों पर चलता है।\nआप स्किल्स, प्रोजेक्ट्स, अनुभव, सर्टिफिकेशन या संपर्क पूछ सकते हैं।",
      unknownInfoMessage: "Warning: Data not found. सीधे रवि से संपर्क करने के लिए Contact सेक्शन देखें।",
      identityMessage: "मैं Compiler हूँ, रवि का पोर्टफोलियो असिस्टेंट। मैं सिर्फ़ रवि कुमार गंगवार के स्किल्स, प्रोजेक्ट्स, अनुभव और संपर्क से जुड़े जवाब कंपाइल करता हूँ।",
      placeholder: "सवाल पूछें या कमांड लिखें (/help)...",
      tooltip: "रवि पर क्वेरी चलाएं",
      clearTitle: "चैट साफ़ करें (/clear)",
      closeTitle: "चैट बंद करें (Esc)",
      status: "v2.0 | Ravi.Java",
      hint: "भेजने के लिए Enter • नई लाइन के लिए Shift+Enter",
      stillCompiling: "अभी भी कंपाइल हो रहा है...",
      newMessagePill: "नया संदेश ↓",
      bootLines: [
        "> Compiler v2.0 बूट हो रहा है...",
        "> पोर्टफोलियो मॉड्यूल लोड हो रहे हैं... [OK]",
        "> तैयार। कोई सवाल पूछें या कमांड चुनें।"
      ],
      thinkingStates: [
        "कंपाइल हो रहा है...",
        "डिपेंडेंसी जोड़ रहे हैं...",
        "क्वेरी चल रही है..."
      ],
      actions: {
        projects: "सभी प्रोजेक्ट्स देखें",
        skills: "स्किल्स सेक्शन देखें",
        experience: "अनुभव देखें",
        certifications: "सर्टिफिकेशन देखें",
        resume: "रिज्यूमे देखें",
        resumePdf: "PDF डॉक्यूमेंट खोलें",
        contact: "संपर्क फॉर्म पर जाएं",
        about: "परिचय पढ़ें",
        dsa: "एल्गोरिदम विज़ुअलाइज़र खोलें"
      }
    },
    hinglish: {
      assistantName: "Compiler",
      tagline: "Ask. Compile. Know Ravi.",
      greeting: "Namaste! Main Compiler hoon, Ravi ka portfolio assistant. Skills, projects, anubhav ya contact ke baare mein kuch bhi poochiye.",
      chips: ["$ skills", "$ projects", "$ anubhav", "$ certs", "$ resume", "$ contact"],
      refusalMessage: "Exception: OffTopicException\nCompiler sirf Ravi ke portfolio ke sawalon par chalta hai.\nAap skills, projects, anubhav, certs ya contact pooch sakte hain.",
      unknownInfoMessage: "Warning: Yeh jaankari mere paas nahi hai. Aap Contact section se seedha Ravi se baat kar sakte hain.",
      identityMessage: "I'm Compiler, Ravi's portfolio assistant. I only compile answers about Ravi Kumar Gangwar's skills, projects, experience and contact info.",
      placeholder: "Query poochein ya command likhein (/help)...",
      tooltip: "Run a query on Ravi",
      clearTitle: "Clear chat (/clear)",
      closeTitle: "Close chat (Esc)",
      status: "v2.0 | Ravi.Java",
      hint: "Enter to send • Shift+Enter for new line",
      stillCompiling: "Abhi bhi compile ho raha hai...",
      newMessagePill: "Naya message ↓",
      bootLines: [
        "> Booting Compiler v2.0...",
        "> Loading Ravi's portfolio modules... [OK]",
        "> Ready. Type a question or pick a command."
      ],
      thinkingStates: [
        "Compile ho raha hai...",
        "Dependencies jod rahe hain...",
        "Query chal rahi hai..."
      ],
      actions: {
        projects: "View All Projects",
        skills: "Explore Skills Section",
        experience: "View Experience",
        certifications: "View Certifications",
        resume: "View Resume Section",
        resumePdf: "Open PDF Document",
        contact: "Go to Contact Form",
        about: "Read Full About Story",
        dsa: "Open Algorithm Visualizer"
      }
    }
  };

  // Structured Core Knowledge Base (English source of truth)
  const KNOWLEDGE = {
    developer: {
      name: "Ravi Kumar Gangwar",
      title: "Aspiring Java & AI Automation Engineer",
      education: "B.Tech Computer Science Engineering student (2023-27)",
      status: "Available for internships and Java / AI Automation roles",
      focus: "Skilled in Java backend systems, database management and Agentic AI workflows with n8n.",
      email: "gangwarr132@gmail.com",
      github: "https://github.com/ravig132",
      githubDisplay: "github.com/ravig132",
      linkedin: "https://www.linkedin.com/in/ravi-kumar-gangwar-bb891927a/",
      linkedinDisplay: "linkedin.com/in/ravi-kumar-gangwar-bb891927a",
      resumePath: "assets/Ravi Kumar Gangwar 2023-27 Resume.pdf"
    },

    skills: [
      "Java (OOP, Collections Framework, Multithreading, Exception Handling, Swing)",
      "Spring Core (IoC Container, Dependency Injection, Bean Lifecycle, Annotations)",
      "Spring Boot (RESTful APIs, Auto-Configuration, Spring Data JPA, Embedded Tomcat)",
      "n8n Workflows",
      "Agentic AI & LLMs (OpenAI API, AI agents, query classification, prompt engineering)",
      "Telegram Bot API",
      "Resume Parsing AI",
      "SQL & MySQL",
      "JDBC",
      "Google Sheets API",
      "Git & GitHub",
      "Web stack (HTML/CSS/JS)",
      "DSA"
    ],

    certifications: [
      {
        title: "Machine Learning",
        issuer: "IIT Kanpur",
        note: "Verifiable on his LinkedIn"
      },
      {
        title: "Use of AI Tools and Prompting",
        issuer: "Be10x",
        note: "Verifiable on his LinkedIn"
      },
      {
        title: "Certificate in Computer Course",
        issuer: "National Board of Computer Education",
        location: "Kichha, Uttarakhand",
        note: "Verifiable on his LinkedIn"
      }
    ],

    projects: [
      {
        id: "ai-hr-recruitment",
        title: "AI HR Recruitment Automation",
        tech: "n8n + AI agent, Google Sheets API, Gmail",
        summary: "n8n + AI agent; resume parsing, scoring against job roles, interview email at 80%+ skill match, polite rejection below 80%, Google Sheets logging."
      },
      {
        id: "form-routing-agent",
        title: "Intelligent Form Routing Agent",
        tech: "n8n, LLM Query Classification, Google Sheets, Email",
        summary: "Built in a Mini Hackathon on Agentic AI; form -> LLM query classification -> category tagging -> Google Sheets logging -> category email response."
      },
      {
        id: "telegram-bot",
        title: "AI Telegram Assistant Bot",
        tech: "BotFather, Telegram Bot API, n8n, LLM",
        summary: "Autonomous conversational assistant on Telegram handling natural language queries with live context."
      },
      {
        id: "conversational-ai-engine",
        title: "Conversational AI Workflow Engine",
        tech: "n8n, Multi-channel APIs, LLM APIs",
        summary: "No-code n8n framework linking website, Telegram and WhatsApp style channels to AI model APIs."
      },
      {
        id: "ebank-system",
        title: "E-Bank Management System",
        tech: "Java Swing, JDBC, MySQL",
        summary: "Account creation, money transfer, PIN verification, balance updates, statements."
      },
      {
        id: "ticket-booking-system",
        title: "Ticket Booking System",
        tech: "Java, MySQL, JDBC, SQL",
        summary: "Seat availability, booking confirmation, ticket retrieval."
      },
      {
        id: "portfolio-website",
        title: "Liquid Glass Portfolio Website",
        tech: "HTML5, CSS3, JavaScript",
        summary: "Glassmorphism, 3D card tilts, liquid particle background, custom cursor, algorithm visualizer."
      },
      {
        id: "crud-spring-boot",
        title: "CRUD Project - Spring Boot",
        tech: "Java, Spring Boot",
        summary: "Create, Read, Update, Delete, RESTful API data handling."
      }
    ],

    experience: [
      {
        role: "Summer Intern (AI training and internship program)",
        company: "Madan Mohan Malaviya University of Technology (MMMUT)",
        location: "Gorakhpur, Uttar Pradesh, India",
        period: "June 2026 - July 2026 (about 2 months; six-week program). Completed.",
        type: "Hybrid",
        certificate: "Internship certificate PDF is available in the Experience section",
        tech: ["Python", "NumPy", "Machine Learning", "Data Analytics", "n8n", "AI & Automation"],
        highlights: [
          "Covered Machine Learning, Deep Learning, Generative AI and automation workflows",
          "Built a city-wise delivery delay dashboard (data preprocessing and analysis)",
          "Built a sentiment analysis project using ML",
          "Built an intelligent form routing agent using n8n",
          "Took part in a Personality Development workshop and explored AI productivity tools including Antigravity",
          "Strengthened skills in Data Analytics, ML, AI and Automation"
        ],
        note: "This summer internship is his only work experience. If asked about other jobs, freelance work or other internships, state that the portfolio lists this summer internship as his work experience, plus projects and a hackathon, and he is open to internships and Java / AI Automation roles."
      }
    ],

    hackathons: [
      {
        title: "Machine Learning Hackathon",
        organizer: "Indian Institute of Technology (IIT) Kanpur with Techgyan Technologies",
        date: "28 March 2025",
        status: "Successfully completed",
        certificateId: "T-IITK-108",
        tech: ["Machine Learning", "Python", "Data Science"],
        description: "Applied data processing, ML models and algorithms to solve problem statements in sprint timeframes. Received official Certificate of Participation (ID: T-IITK-108)."
      },
      {
        title: "Mini Hackathon on Agentic AI",
        organizer: "Agentic AI Mini Hackathon",
        status: "Completed",
        tech: ["n8n", "LLM Classification", "Automation"],
        description: "Built the Intelligent Form Routing Agent (form -> LLM query classification -> category tagging -> Google Sheets logging -> category email response)."
      }
    ],

    learningJourney: [
      { year: "2023", milestone: "Started B.Tech CSE (programming logic, C/C++, fundamentals)" },
      { year: "2024", milestone: "Java, OOP, Exception Handling, Collections Framework" },
      { year: "2025", milestone: "JDBC, SQL, MySQL, Git and GitHub" },
      { year: "2026", milestone: "Agentic AI, n8n, automated systems (AI recruitment automation, LLM query routers, Telegram bots, workflows during AI mini hackathons)" },
      { year: "Present", milestone: "Building real-world software, practicing DSA, preparing for software engineering and AI automation roles" }
    ],

    dsa: {
      topics: ["Arrays", "Strings", "Linked Lists", "Stack", "Queue", "Trees", "Searching", "Sorting", "Recursion"],
      summary: "Ravi actively solves algorithmic problems in Java covering Arrays, Strings, Linked Lists, Stack, Queue, Trees, Searching, Sorting, and Recursion, with an interactive sorting visualizer built directly into this portfolio site."
    }
  };

  // Pre-written Medium-Length Answers (3-4 short sentences, key fact + useful detail + ONE next-step hint)
  const LOCAL_ANSWERS = {
    skills: {
      en: {
        text: "Ravi specializes in Java backend systems and Agentic AI automation workflows. His stack includes Java (OOP, Collections, Multithreading, Exception Handling, Swing), Spring Core, Spring Boot REST APIs, and n8n workflows. He also works with Agentic AI & LLMs, SQL/MySQL, JDBC, Google Sheets API, Git, and DSA. Would you like to explore his projects?",
        actions: [{ labelKey: "skills", href: "#skills" }]
      },
      hi: {
        text: "रवि Java बैकएंड सिस्टम्स और Agentic AI ऑटोमेशन वर्कफ़्लो में कुशल हैं। उनके मुख्य स्टैक में Java (OOP, Collections, Multithreading, Swing), Spring Core, Spring Boot REST APIs और n8n वर्कफ़्लो शामिल हैं। इसके अलावा वे Agentic AI, SQL/MySQL, JDBC, Google Sheets API, Git और DSA में भी पारंगत हैं। क्या आप उनके प्रोजेक्ट्स देखना चाहते हैं?",
        actions: [{ labelKey: "skills", href: "#skills" }]
      },
      hinglish: {
        text: "Ravi Java backend development aur Agentic AI automation workflows mein skilled hain. Unke core stack mein Java, Spring Core, Spring Boot REST APIs, aur n8n workflows shaamil hain. Saath hi OpenAI API, SQL, MySQL, JDBC, Google Sheets API, Git aur DSA par strong command hai. Kya aap unke projects explore karna chahte hain?",
        actions: [{ labelKey: "skills", href: "#skills" }]
      }
    },

    projects: {
      en: {
        text: "Ravi has developed 8 core projects spanning Java backend and Agentic AI automation. Key builds include AI HR Recruitment Automation, Intelligent Form Routing Agent, AI Telegram Bot, E-Bank Management System, and Spring Boot CRUD REST APIs. Every project focuses on practical utility, clean architecture, and automated workflows. Would you like details on a specific project?",
        actions: [{ labelKey: "projects", href: "#projects" }]
      },
      hi: {
        text: "रवि ने Java बैकएंड और Agentic AI ऑटोमेशन में 8 मुख्य प्रोजेक्ट्स बनाए हैं। इनमें AI HR Recruitment Automation, Intelligent Form Routing Agent, AI Telegram Bot, E-Bank Management System और Spring Boot CRUD REST API शामिल हैं। प्रत्येक प्रोजेक्ट व्यावहारिक उपयोग और क्लीन आर्किटेक्चर पर आधारित है। क्या आप किसी प्रोजेक्ट के बारे में विस्तार से जानना चाहते हैं?",
        actions: [{ labelKey: "projects", href: "#projects" }]
      },
      hinglish: {
        text: "Ravi ne Java aur Agentic AI automation par 8 solid projects banaye hain. Inme AI HR Recruitment Automation, Intelligent Form Routing Agent, AI Telegram Bot, E-Bank Management System, aur Spring Boot CRUD REST API shaamil hain. Har project real-world problem solving aur clean architecture par focused hai. Kisi project ki detail dekhna chahenge?",
        actions: [{ labelKey: "projects", href: "#projects" }]
      }
    },

    experience: {
      en: {
        text: "Ravi completed a six-week hybrid Summer Internship in AI training and automation at Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur (June 2026 - July 2026). During the internship, he built a city-wise delivery delay dashboard, a sentiment analysis ML project, and an n8n form routing agent while exploring tools like Antigravity. This internship, along with his projects and hackathons, represents his official work experience. He is actively available for internships and Java or AI Automation roles.",
        actions: [{ labelKey: "experience", href: "#experience" }]
      },
      hi: {
        text: "रवि ने मदन मोहन मालवीय प्रौद्योगिकी विश्वविद्यालय (MMMUT), गोरखपुर से जून 2026 - जुलाई 2026 में 6-सप्ताह की हाइब्रिड समर इंटर्नशिप (AI ट्रेनिंग एवं ऑटोमेशन) पूरी की है। इसमें उन्होंने डिलीवरी डिले डैशबोर्ड, सेंटीमेंट एनालिसिस और n8n फॉर्म रूटिंग एजेंट पर काम किया तथा Antigravity जैसे टूल्स सीखे। उनके पोर्टफोलियो में यह समर इंटर्नशिप, प्रोजेक्ट्स और हैकाथॉन मुख्य अनुभव हैं। वे इंटर्नशिप और Java / AI रोल्स के लिए उपलब्ध हैं।",
        actions: [{ labelKey: "experience", href: "#experience" }]
      },
      hinglish: {
        text: "Ravi ne Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur se June 2026 - July 2026 mein 6-week hybrid Summer Internship (AI training & automation) complete ki hai. Isme unhone delivery delay dashboard, sentiment analysis ML project aur n8n form routing agent build kiya. Yeh summer internship, unke projects aur hackathons hi unka official work experience hain. Wo actively internships aur Java ya AI Automation roles ke liye available hain.",
        actions: [{ labelKey: "experience", href: "#experience" }]
      }
    },

    hackathons: {
      en: {
        text: "Ravi participated in the Machine Learning Hackathon at IIT Kanpur (28 March 2025) with Techgyan Technologies, earning an official Certificate of Participation (ID: T-IITK-108) by solving sprint ML problem statements. He also built his Intelligent Form Routing Agent during a Mini Hackathon on Agentic AI. Both events highlighted his hands-on problem solving in ML, data processing, and automation. Would you like to check his hackathon project?",
        actions: [{ labelKey: "projects", href: "#projects" }]
      },
      hi: {
        text: "रवि ने 28 मार्च 2025 को IIT Kanpur और Techgyan Technologies द्वारा आयोजित Machine Learning Hackathon में भाग लिया और आधिकारिक प्रमाणपत्र (ID: T-IITK-108) प्राप्त किया। इसमें उन्होंने समयबद्ध स्प्रिंट में ML मॉडल्स और डेटा प्रोसेसिंग लागू की। इसके अतिरिक्त उन्होंने Agentic AI Mini Hackathon में Intelligent Form Routing Agent भी बनाया था। क्या आप उनके प्रोजेक्ट्स देखना चाहते हैं?",
        actions: [{ labelKey: "projects", href: "#projects" }]
      },
      hinglish: {
        text: "Ravi ne 28 March 2025 ko IIT Kanpur aur Techgyan Technologies ke Machine Learning Hackathon mein participate karke official Certificate of Participation (ID: T-IITK-108) earn kiya. Wahan unhone sprint timeframes mein ML models aur data processing implement kiya. Saath hi ek Agentic AI Mini Hackathon mein unhone Intelligent Form Routing Agent bhi develop kiya tha. Kya aap unke hackathon projects dekhna chahte hain?",
        actions: [{ labelKey: "projects", href: "#projects" }]
      }
    },

    certifications: {
      en: {
        text: "Ravi holds verified certifications including Machine Learning from IIT Kanpur, Use of AI Tools and Prompting from Be10x, and a Computer Course Certificate from the National Board of Computer Education (Kichha). All these credentials are fully verifiable on his LinkedIn profile. Would you like his LinkedIn link or contact details?",
        actions: [{ labelKey: "certifications", href: "#certifications" }]
      },
      hi: {
        text: "रवि के पास IIT Kanpur से Machine Learning, Be10x से Use of AI Tools and Prompting, और National Board of Computer Education (Kichha) से कंप्यूटर कोर्स का सत्यापित प्रमाणपत्र है। इन सभी प्रमाणपत्रों को उनके LinkedIn प्रोफ़ाइल पर देखा जा सकता है। क्या आप उनका LinkedIn देखना चाहते हैं?",
        actions: [{ labelKey: "certifications", href: "#certifications" }]
      },
      hinglish: {
        text: "Ravi ke paas IIT Kanpur se Machine Learning, Be10x se Use of AI Tools and Prompting, aur NBCE Kichha se Computer Course ka verified certificate hai. Ye sabhi certificates unke LinkedIn profile par verified aur available hain. Kya unka contact info chahiye?",
        actions: [{ labelKey: "certifications", href: "#certifications" }]
      }
    },

    resume: {
      en: {
        text: "Ravi's official resume is available for viewing and direct PDF download right here on the portfolio in the #resume section. It highlights his technical stack, internship projects, and academic background. Would you like me to open the resume section?",
        actions: [
          { labelKey: "resume", href: "#resume" },
          { labelKey: "resumePdf", href: "assets/Ravi Kumar Gangwar 2023-27 Resume.pdf", target: "_blank" }
        ]
      },
      hi: {
        text: "रवि का ऑफिशियल रेज़्यूमे इस पोर्टफोलियो के #resume सेक्शन में लाइव देखने और सीधे PDF डाउनलोड करने के लिए उपलब्ध है। इसमें उनके प्रोजेक्ट्स, स्किल्स और इंटर्नशिप का पूरा विवरण है। क्या मैं रेज़्यूमे सेक्शन खोल दूँ?",
        actions: [
          { labelKey: "resume", href: "#resume" },
          { labelKey: "resumePdf", href: "assets/Ravi Kumar Gangwar 2023-27 Resume.pdf", target: "_blank" }
        ]
      },
      hinglish: {
        text: "Ravi ka official resume portfolio ke #resume section mein available hai. Aap wahan se live PDF view aur download kar sakte hain jisme unke projects aur experience listed hain. Kya main resume section open kar doon?",
        actions: [
          { labelKey: "resume", href: "#resume" },
          { labelKey: "resumePdf", href: "assets/Ravi Kumar Gangwar 2023-27 Resume.pdf", target: "_blank" }
        ]
      }
    },

    contact: {
      en: {
        text: "You can connect with Ravi via email at gangwarr132@gmail.com, or through his verified LinkedIn and GitHub profiles. He is actively available for internships and Java or AI automation roles. Would you like to navigate to the contact form?",
        actions: [{ labelKey: "contact", href: "#contact" }]
      },
      hi: {
        text: "आप रवि से gangwarr132@gmail.com पर ईमेल के जरिए या उनके LinkedIn और GitHub प्रोफ़ाइल पर संपर्क कर सकते हैं। वे इंटर्नशिप और Java / AI रोल्स के लिए सक्रिय रूप से उपलब्ध हैं। क्या आप संपर्क फॉर्म पर जाना चाहते हैं?",
        actions: [{ labelKey: "contact", href: "#contact" }]
      },
      hinglish: {
        text: "Aap Ravi se gangwarr132@gmail.com par email kar sakte hain, ya unke LinkedIn aur GitHub profile par connect kar sakte hain. Ravi internships aur Java / AI roles ke liye actively available hain. Kya message bhejna chahte hain?",
        actions: [{ labelKey: "contact", href: "#contact" }]
      }
    },

    about: {
      en: {
        text: "Ravi Kumar Gangwar is a B.Tech Computer Science Engineering student (2023-2027) and an aspiring Java & AI Automation Engineer. He is skilled in Java backend systems, database management, and Agentic AI workflows with n8n. He is available for internships and Java / AI Automation roles. What else would you like to know about him?",
        actions: [{ labelKey: "about", href: "#about" }]
      },
      hi: {
        text: "रवि कुमार गंगवार B.Tech CSE (2023-2027) के छात्र हैं और एक उभरते हुए Java एवं AI Automation Engineer हैं। वे Java बैकएंड सिस्टम्स, डेटाबेस मैनेजमेंट और n8n के साथ Agentic AI वर्कफ़्लो पर काम करते हैं। वे इंटर्नशिप और Java / AI ऑटोमेशन रोल्स के लिए उपलब्ध हैं। आप उनके बारे में और क्या जानना चाहते हैं?",
        actions: [{ labelKey: "about", href: "#about" }]
      },
      hinglish: {
        text: "Ravi Kumar Gangwar B.Tech CSE (2023-27) student hain aur aspiring Java & AI Automation Engineer hain. Wo robust Java backend systems, database management aur n8n agentic workflows banane mein proficient hain. Wo internships aur Java / AI roles ke liye actively available hain. Aur kya jaanna chahte hain?",
        actions: [{ labelKey: "about", href: "#about" }]
      }
    },

    journey: {
      en: {
        text: "Ravi started B.Tech CSE in 2023 (programming logic, C/C++), learned Java OOP and Collections in 2024, mastered JDBC, SQL, MySQL, and Git in 2025, and stepped into Agentic AI and n8n workflows in 2026. Currently, he builds real-world software, practices DSA, and prepares for software engineering roles. Would you like to view his skills?",
        actions: [{ labelKey: "about", href: "#about" }]
      },
      hi: {
        text: "रवि ने 2023 में C/C++ और प्रोग्रामिंग लॉजिक के साथ B.Tech शुरू किया, 2024 में Java OOP और Collections सीखे, 2025 में JDBC, SQL, MySQL और Git में महारत हासिल की, और 2026 में Agentic AI एवं n8n में कदम रखा। वर्तमान में वे वास्तविक सॉफ्टवेयर बना रहे हैं और DSA का अभ्यास कर रहे हैं। क्या आप उनके स्किल्स देखना चाहते हैं?",
        actions: [{ labelKey: "about", href: "#about" }]
      },
      hinglish: {
        text: "Ravi ne 2023 mein B.Tech start karke programming fundamentals seekhe, 2024 mein Java OOP aur Collections master kiye, 2025 mein JDBC, SQL, MySQL aur Git par kaam kiya, aur 2026 mein Agentic AI aur n8n automate kiya. Abhi wo real-world software build kar rahe hain aur DSA practice kar rahe hain. Unke skills explore karna chahenge?",
        actions: [{ labelKey: "about", href: "#about" }]
      }
    },

    dsa: {
      en: {
        text: "Ravi regularly solves Data Structures and Algorithms problems in Java, covering Arrays, Strings, Linked Lists, Stack, Queue, Trees, Searching, Sorting, and Recursion. He also built an interactive Sorting Visualizer live on this portfolio. Would you like to check out the visualizer?",
        actions: [{ labelKey: "dsa", href: "#dsa" }]
      },
      hi: {
        text: "रवि Java में Data Structures और Algorithms (Arrays, Strings, Linked Lists, Trees, Stacks, Searching, और Sorting) का नियमित अभ्यास करते हैं। उन्होंने इस पोर्टफोलियो पर एक इंटरैक्टिव Sorting Visualizer भी बनाया है। क्या आप विज़ुअलाइज़र देखना चाहते हैं?",
        actions: [{ labelKey: "dsa", href: "#dsa" }]
      },
      hinglish: {
        text: "Ravi Java me Data Structures aur Algorithms (Arrays, Strings, Linked Lists, Trees, Stacks, Searching, Sorting, Recursion) regularly practice karte hain. Is portfolio par unka interactive Sorting Visualizer bhi live chal raha hai. Kya aap visualizer dekhna chahte hain?",
        actions: [{ labelKey: "dsa", href: "#dsa" }]
      }
    }
  };

  /**
   * Trilingual Keyword Dictionaries for Local Fallback Engine
   */
  const TOPIC_KEYWORDS = {
    skills: [
      "skills", "skill", "kaushal", "स्किल्स", "स्किल", "कौशल", "tech stack", "तकनीक", "प्रौद्योगिकी",
      "java", "n8n", "spring", "mysql", "jdbc", "technologies", "tools", "languages", "language",
      "skills kya hain", "kaun si languages aati hain", "kaun si language", "kaunse tools", "kya aata hai"
    ],
    projects: [
      "project", "projects", "prakalp", "प्रोजेक्ट", "प्रोजेक्ट्स", "परियोजना", "परियोजनाएं",
      "kaam", "kam", "work", "recruitment", "routing", "ebank", "e-bank", "telegram bot",
      "booking", "portfolio site", "banao", "banaya", "projects dikhao", "projects batao",
      "ravi ke projects", "kaam dikhao", "kya banaya hai"
    ],
    experience: [
      "experience", "internship", "anubhav", "अनुभव", "intern", "job", "नौकरी", "इंटरनशिप",
      "mmmut", "company", "summer intern", "madan mohan malaviya", "gorakhpur", "work",
      "kaam ka anubhav", "ravi ka anubhav batao", "internship kahan ki hai", "internship kahan ki",
      "kahan kaam kiya", "work experience", "anubhav batao", "intern kahan the"
    ],
    hackathons: [
      "hackathon", "hackathons", "buildathon", "competition", "iit kanpur", "hackathon kab",
      "हैकाथॉन", "mini hackathon", "techgyan", "pratiyogita", "प्रतियोगिता", "t-iitk-108",
      "hackathon certificate", "kya ravi ne koi hackathon kiya"
    ],
    certifications: [
      "certificate", "certification", "certifications", "certs", "praman", "सर्टिफिकेट", "सर्टिफिकेशन्स",
      "सर्टिफिकेशन", "प्रमाणपत्र", "iit", "kanpur", "be10x", "credentials", "diploma", "certificates"
    ],
    resume: [
      "resume", "cv", "रिज्यूमे", "रेज़्युमे", "biodata", "बायोडाटा", "download resume",
      "resume download", "pdf resume", "resume chahiye", "cv chahiye", "resume dikhao"
    ],
    contact: [
      "contact", "email", "sampark", "संपर्क", "hire", "milna", "baat", "reach",
      "linkedin", "github", "phone", "kahan se contact", "rabta", "kaho",
      "contact kaise karu", "sampark kaise kare", "kaise mile", "email kya hai"
    ],
    about: [
      "about", "parichay", "परिचय", "padhai", "पढ़ाई", "shiksha", "शिक्षा", "who is ravi",
      "ravi", "education", "college", "btech", "background", "kon hai", "kiske bare me", "ravi kaun hai"
    ],
    identity: [
      "who are you", "tum kaun ho", "who are u", "what are you", "aap kaun ho", "compiler kaun hai",
      "what is compiler", "tum kya ho", "aap kya ho", "who r u", "kya ho tum"
    ],
    journey: [
      "journey", "yatra", "सफर", "यात्रा", "roadmap", "timeline", "story", "learning journey",
      "seekhne ka safar", "learning", "kaise seekha"
    ],
    dsa: [
      "dsa", "data structure", "data structures", "algorithm", "algorithms", "एल्गोरिदम",
      "सॉर्टिंग", "sorting", "leetcode", "problem solving", "binary search", "array"
    ],
    greetings: [
      "hi", "hello", "hey", "namaste", "नमस्ते", "हेलो", "हेल्लो", "thanks", "dhanyavad",
      "धन्यवाद", "shukriya", "शुक्रिया", "kaise ho", "kya haal", "good morning", "good evening"
    ]
  };

  /**
   * Technology names for automatic local syntax highlighting
   */
  const TECH_CHIPS = [
    "Java", "n8n", "JDBC", "MySQL", "Agentic AI", "Spring", "Spring Core", "Spring Boot",
    "Telegram Bot API", "Google Sheets API", "Git", "GitHub", "HTML5", "CSS3",
    "JavaScript", "DSA", "OpenAI API", "Swing", "REST API", "REST APIs", "Python",
    "NumPy", "Machine Learning", "Data Analytics", "Deep Learning", "Generative AI",
    "Antigravity", "MMMUT", "IIT Kanpur"
  ];

  /**
   * Client-side language detector with sticky conversation memory:
   * 1. Devanagari characters present -> 'hi'
   * 2. Short / ambiguous follow-ups ("ok", "aur batao", "thanks") -> keep previous language
   * 3. Hinglish word match -> 'hinglish'
   * 4. Else -> 'en'
   */
  function detectLanguage(text, previousLang = 'en') {
    if (!text || typeof text !== 'string') return previousLang || 'en';

    // 1. Devanagari script detection (Unicode range \u0900-\u097F)
    if (/[\u0900-\u097F]/.test(text)) {
      return 'hi';
    }

    const clean = text.toLowerCase().trim();

    // 2. Sticky Language check for short or ambiguous follow-ups
    const isAmbiguous = AMBIGUOUS_WORDS.some(w => clean === w || clean === w + '.' || clean === w + '!');
    if (isAmbiguous && previousLang && previousLang !== 'auto') {
      return previousLang;
    }

    // 3. Multi-word phrase matches for Hinglish
    const multiWordPhrases = ["ke baare mein", "ravi ka", "ravi ke", "ravi ki", "kahan ki"];
    for (const phrase of multiWordPhrases) {
      if (clean.includes(phrase)) {
        return 'hinglish';
      }
    }

    // 4. Individual Hinglish words check
    for (const word of HINGLISH_WORDS) {
      if (!word.includes(' ')) {
        const re = new RegExp(`(^|\\s|[.,!?])${word}(\\s|[.,!?]|$)`, 'i');
        if (re.test(clean)) {
          return 'hinglish';
        }
      }
    }

    // 5. Short follow-up retention if previousLang was Hinglish or Hindi
    if (clean.length <= 12 && previousLang && (previousLang === 'hinglish' || previousLang === 'hi')) {
      return previousLang;
    }

    return 'en';
  }

  /**
   * Normalize user query for accurate keyword matching
   */
  function normalizeQuery(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .toLowerCase()
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/^[$\/>\s]+/, '') // strip command prefixes like $, /, >
      .replace(/[?!.,;:_'"()\[\]{}—–\-\/\\|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Generates compact, token-efficient system prompt for Gemini with exact language and topic filtering
   */
  function buildSystemInstruction(targetLang = 'en', userQuery = '') {
    let langDirective = "Reply in English.";
    if (targetLang === 'hi') {
      langDirective = "Reply in Hindi (Devanagari); keep tech terms in English.";
    } else if (targetLang === 'hinglish') {
      langDirective = "Reply in Hinglish: Hindi in Roman letters mixed with English tech terms, casual and polite, no Devanagari.";
    }

    const normQ = normalizeQuery(userQuery || '');
    
    // Topic detection for token efficiency
    function isTopic(t) {
      const kws = TOPIC_KEYWORDS[t] || [];
      return kws.some(kw => {
        if (kw.length <= 3) {
          const re = new RegExp(`(^|\\s)${kw}(\\s|$)`, 'i');
          return re.test(normQ);
        }
        return normQ.includes(kw);
      });
    }

    const matchedTopics = [];
    if (isTopic('experience')) matchedTopics.push('experience');
    if (isTopic('hackathons')) matchedTopics.push('hackathons');
    if (isTopic('skills')) matchedTopics.push('skills');
    if (isTopic('projects')) matchedTopics.push('projects');
    if (isTopic('certifications')) matchedTopics.push('certifications');
    if (isTopic('resume')) matchedTopics.push('resume');
    if (isTopic('contact')) matchedTopics.push('contact');
    if (isTopic('dsa')) matchedTopics.push('dsa');
    if (isTopic('journey')) matchedTopics.push('journey');

    // Section builders
    const sections = {
      profile: [
        `NAME: ${KNOWLEDGE.developer.name}`,
        `ROLE: ${KNOWLEDGE.developer.title} (${KNOWLEDGE.developer.education})`,
        `STATUS: ${KNOWLEDGE.developer.status}`,
        `FOCUS: ${KNOWLEDGE.developer.focus}`,
        `CONTACT: ${KNOWLEDGE.developer.email} | GitHub: ${KNOWLEDGE.developer.githubDisplay} | LinkedIn: ${KNOWLEDGE.developer.linkedinDisplay}`,
        `RESUME: Available in #resume section (${KNOWLEDGE.developer.resumePath})`
      ].join("\n"),

      experience: "EXPERIENCE:\n" + KNOWLEDGE.experience.map(e => 
        `* ${e.role} at ${e.company}, ${e.location} (${e.period}, ${e.type})\n  Tech: ${e.tech.join(', ')}\n  Highlights: ${e.highlights.join('; ')}\n  Certificate: ${e.certificate}\n  Note: ${e.note}`
      ).join("\n"),

      hackathons: "HACKATHONS:\n" + KNOWLEDGE.hackathons.map(h => 
        `* ${h.title} (${h.organizer || ''}): ${h.description} ${h.certificateId ? `(Certificate ID: ${h.certificateId})` : ''}`
      ).join("\n"),

      skills: "SKILLS:\n" + KNOWLEDGE.skills.map(s => `- ${s}`).join("\n"),

      certifications: "CERTIFICATIONS:\n" + KNOWLEDGE.certifications.map(c => 
        `- ${c.title} from ${c.issuer} (${c.location || ''}) - ${c.note}`
      ).join("\n"),

      projects: "PROJECTS (8):\n" + KNOWLEDGE.projects.map(p => 
        `* ${p.title} (${p.tech}): ${p.summary}`
      ).join("\n"),

      journey: "LEARNING JOURNEY:\n" + KNOWLEDGE.learningJourney.map(j => `* ${j.year}: ${j.milestone}`).join("\n"),

      dsa: "DSA: " + KNOWLEDGE.dsa.topics.join(", ") + ". " + KNOWLEDGE.dsa.summary,

      contact: `CONTACT DETAILS: Email: ${KNOWLEDGE.developer.email}, GitHub: ${KNOWLEDGE.developer.githubDisplay}, LinkedIn: ${KNOWLEDGE.developer.linkedinDisplay}`
    };

    // If specific topic matched, deliver targeted section for maximum token efficiency
    let knowledgePayload = "";
    if (matchedTopics.length > 0) {
      knowledgePayload = [
        "--- PORTFOLIO SPECIFICATION (TARGETED TOPIC) ---",
        sections.profile,
        "",
        matchedTopics.map(t => sections[t] || "").filter(Boolean).join("\n\n"),
        "",
        "AVAILABLE PORTFOLIO MODULES: skills, projects, experience (MMMUT Summer Intern), hackathons (IIT Kanpur), certifications, learning journey, dsa, contact."
      ].join("\n");
    } else {
      // General overview across all modules
      knowledgePayload = [
        "--- PORTFOLIO SPECIFICATION ---",
        sections.profile,
        "",
        sections.skills,
        "",
        sections.experience,
        "",
        sections.hackathons,
        "",
        sections.certifications,
        "",
        sections.projects,
        "",
        sections.journey,
        "",
        sections.dsa
      ].join("\n");
    }

    return [
      "You are Compiler, Ravi Kumar Gangwar's portfolio assistant. Tone: friendly, confident, slightly techy. Max 3-4 short sentences (max 80 words). No filler, no greetings, no closing offers.",
      langDirective,
      "CRITICAL FACTUAL SAFETY RULES:",
      "1. Use ONLY the given portfolio data. Never invent companies, dates, percentages (such as 35% or 75%), numbers, awards, or responsibilities.",
      "2. Ravi has ONLY ONE work experience: Summer Intern at Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur (June 2026 - July 2026).",
      "3. Ravi has NEVER held any other company role, internship, or freelance position. If asked about any unlisted companies, external jobs, or freelance work, explicitly state that there is no such information or record in his portfolio, and direct the user to his MMMUT Summer Internship, his projects, and the Contact section.",
      "4. If any information is not listed in the portfolio data, state that the info is not available and point to the Contact section.",
      "",
      knowledgePayload
    ].join("\n");
  }

  return {
    ...KNOWLEDGE,
    BRAND,
    CACHE_VERSION: BRAND.version,
    I18N,
    LOCAL_ANSWERS,
    TOPIC_KEYWORDS,
    TECH_CHIPS,
    HINGLISH_WORDS,
    AMBIGUOUS_WORDS,
    detectLanguage,
    normalizeQuery,
    buildSystemInstruction,
    // Backward-compatible getters
    greeting: I18N.en.greeting,
    refusalMessage: I18N.en.refusalMessage,
    unknownInfoMessage: I18N.en.unknownInfoMessage,
    quickChips: I18N.en.chips
  };
});
