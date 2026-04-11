# AI Resume Analyzer - Project Overview & Implementation Guide

This document is a simple, clear guide explaining how this project is built, the technologies used, and the core concepts you learned. You can use this as a reference if your faculty asks you questions during your presentation!

---

## 1. The Technology Stack (What We Used)

This project is built using the **MERN Stack** alongside a powerful Generative AI.

### Frontend (User Interface)
*   **React:** The core library used to build the website. It allows us to split the UI into reusable pieces called "Components".
*   **Vite:** A super-fast build tool that starts up our React development server instantly.
*   **Tailwind CSS:** A utility-first CSS framework. Instead of writing long CSS files, we use Tailwind's classes (like \`bg-slate-900\` or \`flex\`) directly in our HTML to style things incredibly fast.
*   **Lucide React:** A beautiful, open-source icon library used for all the little icons (like the sparkling stars, clock, and checkmarks).

### Backend (Server & Logic)
*   **Node.js:** Allows us to run JavaScript on the server (outside of the browser).
*   **Express.js:** A framework for Node.js that makes it very easy to create an API and handle network requests (like saving or retrieving history).
*   **Axios:** A tool used to send HTTP requests to the internet (used to talk to the AI).

### Database
*   **MongoDB:** A NoSQL database that stores data as JSON-like documents. It is used to save the history of all the resumes you analyze.
*   **Mongoose:** A tool for Node.js that makes talking to MongoDB very easy and organized.

### Artificial Intelligence
*   **Groq API:** A wildly fast inference engine used to run open-source AI models.
*   **Llama-3 (70B):** An incredibly powerful open-source AI model created by Meta (Facebook). We use this to actually read, understand, and grade the resumes.

---

## 2. Core Concepts (How It Works)

If asked about the main concepts used in this project, you can discuss these three pillars:

### A. Client-Server Architecture (REST API)
The project is split into two halves:
1.  The **Frontend** (React) runs in the user's browser.
2.  The **Backend** (Node/Express) runs on the server.
They communicate with each other using a **REST API**. When you click "Analyze", the Frontend securely packages your resume text and sends it in an API request payload to the Backend to do the heavy lifting safely.

### B. Prompt Engineering & JSON Enforcement
Working with AI often results in unpredictable text paragraphs. We used an advanced concept called **JSON Enforcement**. Our Backend explicitly instructs Llama-3 to act as an Elite Career Coach and forces the AI to reply in a strict \`JSON\` programming format. This ensures our app never breaks, because the AI returns exactly the data types (a Number for the score, Arrays for keywords) that our UI expects.

### C. Glassmorphism Design
The user interface was styled using a highly modern design trend called Glassmorphism. By combining translucent backgrounds (\`bg-slate-900/60\`), backdrop blurring, and neon gradients, it creates a visual effect that mimics frosted glass floating over a glowing background.

---

## 3. Implementation & Setup Guide

If you need to set this project up on a completely new computer, follow these clear steps:

**Step 1: Set up the Database & API Keys**
1. Ensure MongoDB is running on your computer (or use a free MongoDB Atlas cloud link).
2. Inside the \`backend/\` folder, create a file named \`.env\`.
3. Add your private keys to it exactly like this:
   \`\`\`text
   GROQ_API_KEY=your_groq_key_here
   MONGO_URI=mongodb://localhost:27017/resume_analyzer
   \`\`\`

**Step 2: Start the Backend Server**
1. Open a new terminal.
2. Navigate to the backend folder: \`cd backend\`
3. Install the packages: \`npm install\`
4. Run the server: \`npm run dev\` *(or \`node server.js\`)*

**Step 3: Start the Frontend Application**
1. Open a *second* new terminal.
2. Navigate to the main project folder.
3. Install the packages: \`npm install\`
4. Run the React website: \`npm run dev\`

Once both terminals are running, open the local link (usually \`http://localhost:5173\`) in your web browser, and the app will be live and connected!
