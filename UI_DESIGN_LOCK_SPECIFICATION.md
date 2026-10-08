# 🔒 UI DESIGN LOCK & ARCHITECTURAL SPECIFICATION
**Repository:** `ravig132/portfolio_website_2.O`  
**Owner / Developer:** Ravi Kumar Gangwar (Java Developer & AI Automation Engineer)  
**Status:** FROZEN & LOCKED FOR ALL AI MODELS / DEVELOPERS  
**Design Paradigm:** Futuristic Water Droplet, 3D Ice Cube Crystal, Glassmorphism, Deep Dark Void (#050914), Neon Cyan/Blue Glow

---

## ⚠️ MANDATORY DIRECTIVE FOR ALL AI MODELS
> **CRITICAL ENFORCEMENT:**  
> The visual identity, aesthetics, glassmorphic layout, 3D ice cube portrait block, liquid particle canvas, typography, color schemes, card structures, and animation mechanics defined in this specification are **STRICTLY LOCKED**.  
> **NO AI MODEL OR AUTOMATED AGENT IS PERMITTED TO ALTER, REMOVE, OVERRIDE, SIMPLIFY, OR REFACTOR THE UI DESIGN, CSS TOKENS, OR INTERACTION LOGIC WITHOUT EXPLICIT WRITTEN CONSENT FROM RAVI KUMAR GANGWAR.**

---

## 1. DESIGN TOKENS & COLOR PALETTE

```css
:root {
  /* Backgrounds */
  --bg-dark: #050914;               /* Deep Void Charcoal Blue */
  --bg-dark-surface: #0a1124;       /* Elevated Dark Card Surface */
  --bg-glass: rgba(12, 22, 45, 0.45); /* Translucent Glass Card Base */
  --bg-glass-hover: rgba(18, 32, 64, 0.65); /* Hover Translucency */
  
  /* Borders */
  --border-glass: rgba(0, 242, 255, 0.18);        /* Subtle Cyan Border */
  --border-glass-bright: rgba(0, 242, 255, 0.45); /* Bright Cyan Highlight */

  /* Neon Accent Colors */
  --accent-cyan: #00f2ff;    /* Primary Liquid Glow / Buttons / Links */
  --accent-aqua: #00a8ff;    /* Mid-tone Aqua */
  --accent-blue: #0055ff;    /* Electric Royal Blue */
  --accent-indigo: #4361ee;  /* Supporting Indigo Gradient */
  
  /* Typography Colors */
  --text-primary: #f0f6fc;   /* Clean High-Contrast White */
  --text-secondary: #94a3b8; /* Muted Slate Grey */
  --text-muted: #64748b;     /* Tertiary Dim Text */

  /* Typography Fonts */
  --font-main: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-code: 'Fira Code', monospace;

  /* Shadows & Glows */
  --shadow-droplet: 0 16px 40px rgba(0, 242, 255, 0.15), inset 0 2px 3px rgba(255, 255, 255, 0.25);
  --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.5);

  /* Border Radii */
  --radius-sm: 10px;
  --radius-md: 18px;
  --radius-lg: 28px;
  --radius-full: 9999px;

  /* Transitions */
  --transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 2. CORE VISUAL & INTERACTIVE LAYERS

### A. Ambient Cursor Radial Glow Follower (`#cursor-glow`)
- **Dimensions:** 600px × 600px circular layer.
- **Gradient:** `radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)`
- **Behavior:** Tracks cursor mouse coordinates `clientX` & `clientY` with a smooth 0.1s spring trailing effect.
- **Responsive Behavior:** Automatically hidden via `display: none !important;` on screens `max-width: 768px` (mobile/touch devices).

### B. Liquid Floating Particle Canvas (`#liquid-canvas`)
- **Engine:** Full-screen 2D canvas running at 60 FPS.
- **Particle Count:** 45 particles with dynamic radii (2px – 6px), floating upward with negative `vy` (`-0.1` to `-0.5`) and subtle horizontal drift `vx`.
- **Styling:** `rgba(0, 242, 255, alpha)` with `ctx.shadowBlur = 12` and `ctx.shadowColor = '#00f2ff'`.
- **Auto-respawn:** When particles float past `y < 0`, they wrap to bottom `height + 10` with random X coordinate.

### C. Hero 3D Frosted Ice Cube Visual (`.hero-visual` / `.ice-cube-container`)
- **Dimensions:** 320px × 320px (Desktop), scaling down to 260px (Tablet) and 220px (Mobile).
- **Ice Cube Block (`.ice-cube-3d`):** 270px × 270px, border-radius `28px`, border `2px solid rgba(255, 255, 255, 0.55)`, inner bevel `1px solid rgba(255, 255, 255, 0.25)`, `backdrop-filter: blur(8px)`.
- **Floating Animation (`iceCubeFloat`):** 6.5s ease-in-out infinite floating across 3D perspective (`rotateX` 2deg–6deg, `rotateY` -2deg–-7deg, `translateY` 0px to -12px).
- **Interactive Mouse Tilt:** Tracks container mouse coordinates, rotating up to ±14deg and pauses the float keyframe while being hovered.
- **Embedded Portrait (`.hero-portrait`):** Displays `assets/my_image.png` with `object-fit: cover; object-position: center 8%; contrast(1.05) saturate(1.03)`.
- **Ice Frost Overlay (`.ice-frost-overlay`):** Subtle bottom gradient `linear-gradient(180deg, transparent 65%, rgba(5, 12, 26, 0.5) 100%)` ensuring face clarity while providing contrast for badges.
- **Dynamic Specular Sheen (`.ice-specular-shine`):** Sweeps across the surface on hover with `translateY(100%) rotate(25deg)` over 0.85s.
- **Floating Badges (`.hero-photo-badges`):** Pinned at bottom center:
  - `<span class="photo-badge badge-java"><i class="fa-brands fa-java"></i> Java</span>`
  - `<span class="photo-badge badge-db"><i class="fa-solid fa-bolt"></i> n8n AI</span>`
- **Orbiting Nodes:** 3 orbiting circular glass nodes at 140px radius:
  - Node 1: `<i class="fa-brands fa-java"></i>` (Java Core)
  - Node 2: `<i class="fa-solid fa-diagram-project"></i>` (n8n AI Workflows, delay -4s)
  - Node 3: `<i class="fa-solid fa-brain"></i>` (Problem Solving, delay -8s)

---

## 3. SECTIONS & CONTENT DIRECTORY

### Navigation Bar (`.navbar-wrapper`)
- Floating pill header centered at top `1.5rem`, max-width `1200px`, `backdrop-filter: blur(20px)`, border-radius `var(--radius-full)`.
- Brand droplet logo rotating -45deg gradient with inside icon `fa-droplet` rotated 45deg.
- Links: Home, About, Skills, Certifications, Why Java?, Projects, Resume (`assets/Ravi Kumar Gangwar 2023-27 Resume.pdf`), Experience, DSA, Contact.
- Mobile Hamburger Toggle: Pill drawer dropdown with `backdrop-filter: blur(30px)`.

### Hero Section (`#home`)
- Status Badge: Available for Internships & AI Automation / Java Roles with pulsating cyan dot (`pulseGlow`).
- Hero Name: `Ravi Kumar Gangwar` in white-to-cyan gradient text clipping.
- Dynamic Typing Effect: Types sequentially:
  1. `Java Developer`
  2. `AI Automation Engineer`
  3. `n8n Workflow Specialist`
  4. `CSE Student`
- Action Buttons:
  - View My Projects (`#projects`)
  - View Resume (Direct PDF link)
  - Download Resume (Direct PDF download attribute)

### About Section (`#about`)
- Introduction Glass Card: Photo avatar with cyan glow border, description of CSE student background, Java backend focus, and n8n agentic AI workflows.
- Glass Pills: Java & Backend, n8n AI Workflows, Agentic AI, SQL & JDBC, Telegram Bot API.
- Stats Grid:
  - `14+` Projects & AI Workflows
  - `Java` Core Backend Stack
  - `n8n` AI Automation Engine
  - `100+` Problems Solved

### Technical Skills Grid (`#skills`)
- 11 Featured Tech Cards:
  1. **Java** (PRIMARY badge, Collections, OOP, Multithreading, Swing)
  2. **n8n Workflows** (Event-Driven Automation, Webhooks, Custom Nodes)
  3. **Agentic AI & LLMs** (OpenAI API, AI Agents, Query Classification)
  4. **Telegram Bot API** (BotFather, Automated Messaging)
  5. **Resume Parsing AI** (PDF Extraction, Candidate Scoring)
  6. **SQL & MySQL** (Schema Design, Joins, Indexes)
  7. **JDBC** (PreparedStatements, Transactions)
  8. **Google Sheets API** (Data Logging, Sync)
  9. **Git & GitHub** (Version Control, Branching)
  10. **Web Stack** (HTML5, CSS3, JavaScript ES6+)
  11. **DSA** (Algorithmic Optimization, Complexity Analysis)

### Certifications (`#certifications`)
- 3 Verified Credentials:
  1. **Machine Learning** — IIT Kanpur, Kanpur, UP
  2. **Use of AI Tools and Prompting** — Be10x
  3. **Certificate in Computer Course** — National Board of Computer Education, Kichha, Uttarakhand

### Why Java & AI Automation? (`#why-java`)
- Central glowing liquid sphere with pulsating 3s gradient animation and Java logo.
- 6 Surrounding Feature Nodes:
  1. Backend Systems
  2. Agentic AI Agents
  3. n8n Workflows
  4. Database Integration
  5. OOP Principles
  6. Automated Comms

### Featured Projects (`#projects`)
- 8 Featured Projects:
  1. **AI HR Recruitment Automation** (n8n, AI Agent, Resume Parsing, Google Sheets, Auto Emails - LinkedIn link)
  2. **Intelligent Form Routing Agent** (Agentic AI Hackathon, OpenAI LLM, Routing - LinkedIn link)
  3. **AI Telegram Assistant Bot** (Telegram API, BotFather, n8n, LLM - LinkedIn link)
  4. **Conversational AI Workflow Engine** (n8n, Multi-Channel, NoCode - LinkedIn link)
  5. **E-Bank Management System** (Java, Swing, JDBC, MySQL - GitHub link)
  6. **Ticket Booking System** (Java, MySQL, JDBC, SQL - GitHub link)
  7. **Liquid Glass Portfolio Website** (HTML5, CSS3, JavaScript - GitHub & Live Preview)
  8. **CRUD Project – Spring Boot** (Java, Spring Boot - GitHub link)

### Work Experience Section (`#experience`)
- 3 Glassmorphic 3D Tilt Cards with cyan droplet glow:
  1. **Java Backend Developer Intern** — Apex Software Labs (Remote / New Delhi)
  2. **AI Automation Engineer Intern** — Cognitive Workflows & Systems (Remote)
  3. **Software & Automation Freelancer** — Self-Employed / Client Projects (Hybrid / Remote)

### Learning Journey Timeline (`#journey`)
- Glowing vertical liquid line down the center (`#timeline-line`).
- Milestones:
  - **2023**: Started B.Tech CSE
  - **2024**: Java & Programming Fundamentals
  - **2025**: JDBC, SQL, MySQL, Git & GitHub
  - **2026**: Agentic AI, n8n & Automated Systems
  - **Present**: Building Real-World Software (Active highlighted star)

### Problem Solving & DSA Visualizer (`#dsa`)
- 9 Algorithmic Topics: Arrays, Strings, Linked Lists, Stack, Queue, Trees, Searching, Sorting, Recursion.
- **Interactive Algorithm Visualizer:**
  - Real-time animated bubble sort using liquid cyan-to-blue bars.
  - Controls: "Reset Array" and "Run Bubble Sort".
  - Active comparison bars highlight in `#ff0055` (hot pink/red).

### Contact Section & Form (`#contact`)
- Contact Info Cards: Email (`gangwarr132@gmail.com`), GitHub (`github.com/ravig132`), LinkedIn (`ravi-kumar-gangwar-bb891927a`).
- Contact Form: Name, Email, Message with EmailJS delivery integration.

### Footer (`.footer`)
- Water Droplet Icon, Ravi Kumar Gangwar name, copyright year 2026, social links.

---

## 4. JAVASCRIPT LOGIC & CONFIGURATION

### EmailJS Integration
```javascript
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "4c4h7IjpNBKNE6cXZ",
  SERVICE_ID: "service_kh7u30c",
  TEMPLATE_ID: "template_mo4c0db"
};
```

---

## 5. REPOSITORY ASSETS DIRECTORY
- `assets/favicon_rj.svg`: Primary high-fidelity vector crystal water droplet logo & favicon with the 'RJ' (Ravi.Java) monogram.
- `assets/rj_logo.svg`: Synchronized vector crystal water droplet logo (copy of favicon_rj.svg).
- `assets/favicon.svg`: Synchronized vector crystal water droplet favicon (copy of favicon_rj.svg).
- `assets/favicon.png`: High-resolution 3D luminous crystal glass orb featuring the illuminated 'RJ' (Ravi.Java) tech monogram.
- `assets/ravi_java_brand.png`: Full developer brand artwork with 3D crystal droplet and 'Ravi.Java DEVELOPER BRAND' typography.
- `assets/my_image.png`: High-resolution photograph of Ravi Kumar Gangwar used in Hero 3D Ice Cube and About Avatar.
- `assets/Ravi Kumar Gangwar 2023-27 Resume.pdf`: Official PDF resume linked in Navbar and Hero actions.

---

## 6. STRICT ENFORCEMENT RULES FOR FUTURE CHANGES
1. **Never replace Vanilla CSS with CSS frameworks (e.g., Tailwind, Bootstrap) unless explicitly ordered.**
2. **Never remove or diminish the glassmorphic styling (`backdrop-filter: blur`, translucent borders, deep void background).**
3. **Never replace the 3D Ice Cube visual or photo framing with a flat rectangular box or generic circular avatar.**
4. **Never delete the liquid canvas background, cursor glow follower, or live algorithm visualizer.**
5. **Always preserve all project descriptions, links, certifications, and educational milestones.**
