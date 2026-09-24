# Resume Builder

Resume Builder is a modern web application that helps users create professional resumes quickly and easily.
It provides an intuitive form-based workflow, real-time preview, and multiple customizable templates.

🔗 **Live Demo:** [resume-builder-two-ruddy.vercel.app](https://resume-builder-two-ruddy.vercel.app)

---

## ✨ Features

- Easy-to-use resume builder form
- Live resume preview, updated as you type
- 10 customizable templates, each with its own layout and color style
- AI Resume Writer for job-optimized rewriting
- Skill autocomplete suggestions (start typing and pick from matches)
- Collapsible sections for Summary, Skills, Experience, Education, and Projects
- File uploads for certifications/documents per education entry
- Download resume as a print-ready PDF
- Light & Dark mode support
- Responsive design for all devices

---

## 📸 Screenshots

### Landing Page
![Landing Page](screenshots/landing-page.png)

### Explore Tools & Templates
All available templates are browsable from one gallery page before you start editing.

![Template Gallery 1](screenshots/templates-gallery-1.png)
![Template Gallery 2](screenshots/templates-gallery-2.png)
![Template Gallery 3](screenshots/templates-gallery-3.png)

---

## 🎨 Templates

Every template shares the same underlying data — fill your info out once, and you can preview it in any style. Here's how each one looks and works:

### Modern
Clean two-column layout with a circular photo slot at the top, followed by collapsible Summary / Skills / Experience / Education / Projects sections. Best for a straightforward, ATS-friendly resume.

![Modern Template](screenshots/template-modern.png)

### Classic
A traditional single-column resume layout with Save / Edit / Export PDF / Reset controls above the form, and a dedicated Live Preview pane on the right.

![Classic Template](screenshots/template-classic.png)

### Minimal
Stripped-down layout with generous white space, ideal for a distraction-free, text-first resume. Same Save / Edit / Reset / PDF controls as other templates.

![Minimal Template](screenshots/template-minimal.png)

### Elegant
Adds a soft gradient background and rounded section cards. The live preview panel highlights your name and professional title in a bold serif-style heading as you type.

![Elegant Template](screenshots/template-elegant.png)

### Premium Elegant
A refined variant of Elegant with a purple accent border around the whole form and solid-color action buttons (Preview, Save, Reset, Export PDF), giving it a more polished, premium feel.

![Premium Elegant Template](screenshots/template-premium-elegant.png)

### Creative Photo
The most colorful template — each section (Skills, Experience, Education, Projects) is tinted in its own pastel gradient (yellow, blue, green, pink), making the form easy to scan visually.

![Creative Photo Template](screenshots/template-creative-photo.png)

### Sidebar Bold
A bold, high-contrast layout with a purple gradient background and a photo circle with a camera icon placeholder. The live preview shows a bold accent bar next to your name and title, and skill tags render as filled pill badges.

![Sidebar Bold Template](screenshots/template-sidebar-bold.png)

Filled out with real data — name, contact info, and skills all render live as you type:

![Sidebar Bold Filled Example](screenshots/filled-resume-preview.png)

### TechGrid, Professional & Corporate
Three additional ATS-friendly templates available from the gallery, geared toward technical and corporate resumes. (Screenshots coming soon — click any of them from the [template gallery](https://resume-builder-two-ruddy.vercel.app) to preview instantly.)

---

## 📝 Building Your Resume — Section by Section

Each template uses the same set of collapsible sections:

### Summary & Skills
Write a short professional summary, then add skills one at a time. As you type, an autocomplete dropdown suggests matching skills (e.g. typing "h" suggests HTML, Python, GraphQL) so you can add them with one click.

![Summary and Skills](screenshots/section-accordion.png)
![Skill Autocomplete](screenshots/skills-autocomplete.png)

### Experience
Add role, company, location, start/end dates, and a description for each position. You can also attach achievements, tag relevant skills to that role, and upload supporting files. Everything you enter appears instantly in the live preview on the right.

![Experience Section](screenshots/section-experience.png)

### Education
Add degree, institution, field of study, and start/end year. There's also space for certifications/documents (file upload), honors, and courses — each with its own "+" button to add multiple entries.

![Education Section](screenshots/section-education.png)

### Projects
Add project name, your role, the tech stack used (with an "+ Add Tech" button for multiple technologies), a description, and a GitHub/demo link. Click "+ Add Project" to list more than one.

![Projects Section](screenshots/section-projects.png)

---

## 📤 Exporting to PDF

Once your resume is ready, click **Export PDF** on any template. This opens your browser's native "Save As" dialog so you can save a print-ready PDF copy directly to your computer.

![Export to PDF](screenshots/export-pdf.png)

---

## 🛠 Tech Stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Redux Toolkit**
- **Tailwind CSS**
- **jsPDF** / **@react-pdf/renderer** (for PDF export)
- **NextAuth** (authentication)
- **json-server** (mock backend / local API for development)

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Rameen-zahra2004/Resume-Builder.git
cd Resume-Builder
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run the mock backend (json-server)

In a separate terminal:

```bash
npm run json-server
```

This starts a local REST API on `http://localhost:3001`, backed by `db.json`.

### 4️⃣ Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

This project is deployed on [Vercel](https://vercel.com). The mock backend (`json-server`) is hosted separately since Vercel only runs serverless functions and can't keep a long-running process alive.

---

## 📄 License

This project is for educational/portfolio purposes.
