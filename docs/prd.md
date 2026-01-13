# **Product Requirements Document (PRD)**

## **1\. Overview**

**Product:** Personal website — moritz-kobler.com  
**Audience:** Recruiters, hiring managers, collaborators, app users (support)  
**Primary Goal:** Present professional profile and app projects in a clear, memorable, and low-maintenance way.

The website should be visually distinctive (neon, edgy, slightly experimental) while remaining technically simple, fast, and easy to host as static files.

---

## **2\. Key Principles & Constraints**

* **Hosting:** Static hosting via Hostinger, served from a GitHub repository  
* **Deployment model:** Push to GitHub → Hostinger renders static files  
* **Build step:** Not required; a light, optional build step is acceptable only if clearly justified  
* **Browser support:** Modern evergreen browsers only

### **Technical Constraints**

* Static-only (no backend services)  
* Vanilla stack: HTML, CSS, minimal JavaScript  
* Clean URLs (no `index.html` in paths)  
* Custom 404 page required

### **Content & Structure**

* Content-driven: copy and structured data sourced from JSON files  
* Language-specific data files (EN / DE)  
* URL structure must support future project types

---

## **3\. Visual, Brand & Frontend Quality**

### **3.1 Look & Feel**

* Dark theme (not pure black)  
* Neon / high-contrast accent colors  
* Modern, sleek, "edgy but professional" aesthetic  
* Visually distinctive but restrained

### **3.2 Motion & Interaction**

* Decorative animations (background / header)  
* Micro-interactions:  
  * Hover states  
  * Focus states  
  * Subtle UI transitions  
* Lightweight CSS- and SVG-based animations only  
* Respect `prefers-reduced-motion`

### **3.3 CSS & Frontend Standards**

* Clean, maintainable CSS is a hard requirement  
* Use CSS variables for:  
  * Colors  
  * Spacing  
  * Typography  
* No inline styles  
* Avoid deep selector nesting  
* Use modern layout primitives (Flexbox / Grid)  
* **Mobile-first implementation**  
* Media queries should be additive (`min-width` preferred)  
* No CSS frameworks

---

## **4\. Information Architecture**

### **4.1 Top-Level Navigation**

* About Me (`/about-me`)  
* App Projects (`/projects`)

Navigation must be visible and consistent across all pages.

---

## **5\. Page: About Me**

**Path:** `/about-me`

### **5.1 Purpose**

Present Moritz Kobler professionally as an online CV / resume.

* Content may be rewritten for clarity and narrative flow  
* Must accurately reflect the underlying CV  
* Supports English and German

### **5.2 Content Sections**

* **Chat: “Ask about Moritz” (AI)**
  * A chat entrypoint at the very top of the page (above or integrated into the intro)
  * Lets users ask questions about Moritz and get answers from a custom GPT
  * Must be clearly labeled as AI-generated content
  * Must not block access to the rest of the About page

* **Header / Intro**  
  * Name  
  * Professional summary  
  * Location  
  * LinkedIn link  
* **Work Experience (Horizontal Gallery)**  
  * Horizontally scrollable, swipeable card gallery  
  * One card per role  
  * Company represented by official logo  
  * Role title, company name, dates, and key highlights per card  
  * Scroll-snap behavior preferred  
* **Education (Horizontal Gallery)**  
  * Same gallery pattern as Work Experience  
  * Institution represented by official logo  
  * Degree, institution, dates, and focus per card  
* **Skills & Tools**  
  * Brand icons only (placeholders acceptable initially)  
  * Optional grouping (e.g. Analytics, Product, Engineering, AI)  
* **Hobbies / Personal Notes**  
* **Contact Information**  
  * LinkedIn only (email optional / hidden)  
* **Downloadable CV**  
  * PDF download link  
  * English initially; German optional later

### **5.4 AI Chat Assistant (“Ask about Moritz”)**

**Goal:** Provide an easy way for recruiters/hiring managers to ask questions about Moritz and get fast answers.

**Placement:** At the very top of `/about-me`.

**UX requirements:**
* Must look native to the site (dark/neon styling)
* Must be keyboard accessible
* Must respect `prefers-reduced-motion`
* Must have a clear disclaimer (e.g. “AI-generated. May be inaccurate.”)

**Privacy & security constraints (important):**
* The site is static-only. Do **not** embed any secret API keys in client-side code.
* If the assistant is implemented via OpenAI API calls, a secure token-minting proxy (serverless or backend) is required.

**Implementation options (choose one):**
1. **Default (static-safe):** A chat entrypoint that opens the custom GPT in ChatGPT (link-out).
2. **Optional (requires serverless/backend):** Embedded on-site chat UI that calls an OpenAI endpoint via a secure proxy.

**Analytics (optional):** Track “open chat” / “start chat” events only after user consent.

### **5.3 Data & Language Handling**

* All copy sourced from external JSON files  
* Language-specific files (e.g. `about.en.json`, `about.de.json`)  
* Default language: English  
* Explicit EN / DE toggle in UI  
* Language also switchable via URL parameter  
* Partial translations allowed initially; full parity required long-term

---

## **6\. Page: App Projects**

**Path:** `/projects`

### **6.1 Purpose**

Showcase apps and projects, provide marketing-style descriptions, and host App Store–required information.

### **6.2 Project Listing**

* Grid or list of project cards  
* Each card displays:  
  * Project name  
  * Short description  
  * Free-text status  
  * Icon or screenshot placeholder

### **6.3 Individual Project Pages**

**Path pattern:** `/projects/apps/{slug}`

Each project page must include:

* App name  
* App icon  
* Status  
* Long-form description  
* Screenshots (placeholders allowed pre-release)  
* App Store links (when applicable)

#### **App Store Compliance**

* **Support section**  
  * Mailto link is sufficient  
* **Privacy section**  
  * App-specific privacy statement

URL structure must allow future non-app project types.

---

## **7\. Data Models**

### **7.1 CV / About Me (`about.{lang}.json`)**

* One file per language  
* Dates stored as ISO strings and formatted in UI

{  
  "meta": {  
    "name": "Moritz Kobler",  
    "title": "Senior AI Product Manager",  
    "location": "Melbourne, Australia",  
    "linkedin": "https://linkedin.com/in/mkobler",  
    "cvPdf": "/assets/cv/moritz-kobler-en.pdf",
    "chat": {
      "enabled": true,
      "mode": "link",
      "label": "Ask about Moritz",
      "url": "https://chat.openai.com/g/g-<your-custom-gpt-id>"
    }
  },  
  "summary": "Professional summary",  
  "experience": \[  
    {  
      "id": "seek-senior-ai-pm",  
      "company": "SEEK",  
      "role": "Senior AI Product Manager",  
      "startDate": "2022-10",  
      "endDate": "present",  
      "highlights": \["Achievement"\],  
      "logo": "/assets/logos/seek.svg"  
    }  
  \],  
  "education": \[  
    {  
      "id": "msc-tu-berlin",  
      "institution": "Technical University Berlin & Lund University",  
      "degree": "M.Sc. Industrial Engineering",  
      "focus": "Computer Science",  
      "startDate": "2014-09",  
      "endDate": "2018-02",  
      "details": \["Thesis description"\],  
      "logo": "/assets/logos/tu-berlin.svg"  
    }  
  \],  
  "skills": \[\],  
  "hobbies": \[\]  
}

### **7.2 Projects (`projects.json`)**

{  
  "projects": \[  
    {  
      "slug": "chronomo",  
      "type": "app",  
      "name": "Chronomo",  
      "status": "Coming 2026",  
      "shortDescription": "Short pitch",  
      "longDescription": "Full description",  
      "appStoreLinks": {  
        "ios": null,  
        "android": null  
      },  
      "supportEmail": "support@domain.com",  
      "privacy": "Privacy statement",  
      "screenshots": \[\]  
    }  
  \]  
}

---

## **8\. Accessibility, Performance & Compliance**

* Semantic HTML  
* Keyboard navigable  
* Reasonable color contrast  
* Fast load times on mobile and desktop

### **Analytics & Privacy**

* Google Analytics integrated  
* Cookie / tracking consent banner required  
* Analytics must only initialize after explicit user consent  
* Respect Do Not Track where applicable

---

## **9\. Out of Scope (for now)**

* Blog  
* CMS  
* Server-side forms or backend processing