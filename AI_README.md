# 🚀 EduAI - AI Integration Documentation

## 📖 Overview
EduAI is a next-generation learning platform powered by advanced Artificial Intelligence. Our AI features are designed to reduce instructor workload, personalize the student learning experience, and provide an interactive study assistant. This document provides a comprehensive breakdown of the AI capabilities integrated into the platform.

---

## 📊 AI Features Status Matrix

| AI Feature | Status | Where Implemented | Description |
| :--- | :--- | :--- | :--- |
| **1. AI Content Generator** | ✅ Implemented | Instructor/Admin Dashboards (`CreateCourseModal`, `QuizModal`) | Auto-generates course descriptions, short summaries, and highly contextual multiple-choice quizzes. |
| **2. AI Smart Recommendations** | ✅ Implemented | User Dashboard (`src/app/dashboard/user/page.tsx`) | Analyzes user's enrolled courses and available courses to recommend relevant learning paths. |
| **3. AI Chat Assistant** | ✅ Implemented | AI Study Assistant (`src/app/dashboard/user/ai-chat/page.tsx`) | A context-aware chatbot that acts as a tutor, answering programming and educational questions. |
| **4. AI Data Analyzer** | ❌ Not Implemented | N/A | Planned for predictive insights on student dropout rates and course revenue forecasting. |
| **5. AI Auto Tagging / Classification** | ✅ Implemented | Instructor/Admin Dashboards (`CreateCourseModal`) | NLP-based categorization that automatically tags and categorizes a course based on its title and description. |
| **6. AI Image or Voice Feature** | ❌ Not Implemented | N/A | Planned for AI-generated course thumbnails and voice-to-text transcriptions for video lessons. |

---

## 🛠️ Implemented Features Deep-Dive

### 1. AI Content Generator
* **Frontend Component:** `src/app/dashboard/admin/courses/page.tsx` (`CreateCourseModal`) & `src/app/dashboard/admin/courses/[courseId]/page.tsx` (`QuizModal`)
* **Backend API Route:** `POST /api/ai/generate-description` and `POST /api/ai/generate-quiz`
* **Backend Service:** `aiService.generateCourseDescription` & `aiService.generateQuiz`
* **How it works:** Instructors provide a course title, category, and level. The frontend triggers the backend, which constructs an optimized prompt demanding a structured JSON response. The LLM returns a comprehensive description, a concise short description, and learning outcomes. For quizzes, the AI reads the specific lesson content and generates an array of multiple-choice questions with designated correct answers and explanations.
* **Technology:** Groq API / LLM Models

### 2. AI Smart Recommendations
* **Frontend Component:** `src/app/dashboard/user/page.tsx` (Recommended Courses Section)
* **Backend API Route:** `GET /api/ai/recommendations`
* **Backend Service:** `aiService.getSmartRecommendations`
* **How it works:** The backend queries PostgreSQL (Prisma) to retrieve a user's enrollment history and cross-references it against a list of available, un-enrolled courses. This data is fed into the LLM, which acts as a recommendation engine to select the top 4 most relevant courses based on the user's past subjects and difficulty levels.
* **Technology:** Prisma, Groq API

### 3. AI Chat Assistant
* **Frontend Component:** `src/app/dashboard/user/ai-chat/page.tsx`
* **Backend API Route:** `POST /api/ai/chat`, `GET /api/ai/chat/sessions`, `GET /api/ai/chat/:sessionId`
* **Backend Service:** `aiService.chatWithAssistant`
* **How it works:** Provides an interactive chat interface. The backend retrieves the last 10 messages of the specific `sessionId` from the database to maintain conversational context. This history is passed to the AI model using `startChat` along with a strict `systemInstruction` dictating its persona as an encouraging, knowledgeable EduAI Tutor. Responses are streamed/returned and saved to the database.
* **Technology:** React Markdown, Framer Motion, Groq API

### 4. AI Auto Tagging / Classification
* **Frontend Component:** `src/app/dashboard/admin/courses/page.tsx` (`CreateCourseModal`)
* **Backend API Route:** `POST /api/ai/classify`
* **Backend Service:** `aiService.classifyContent`
* **How it works:** When an instructor creates a course, this service runs concurrently with the description generator. It feeds the title and raw description to the AI, instructing it to act as a taxonomy expert. The AI returns a structured JSON containing the most appropriate main category, difficulty level, and a normalized array of search tags.
* **Technology:** Groq API

---

## 🏗️ Implementation Architecture

The platform utilizes a modern Client-Proxy-Server architecture for its AI features:

1. **Frontend (Next.js App Router):** React components collect user input and trigger `react-query` mutations.
2. **Next.js API Proxy (`src/app/api/[...proxy]/route.ts`):** All frontend requests starting with `/api` are intercepted by this proxy and securely forwarded to the Express backend. This prevents CORS issues and hides backend IP addresses.
3. **Backend Express Server:** The request hits the `ai.router.ts`, passes through a rate limiter (`aiLimiter`) to prevent abuse, and verifies the user's JWT authorization.
4. **AI Service Layer (`ai.service.ts`):** The service layer communicates with the AI Provider SDK (e.g., Groq API), injecting dynamic application context (like database records) into engineered prompts.
5. **Database:** Chat histories and user interactions are persisted in PostgreSQL via Prisma.

---

## 🚀 Future AI Features

- **AI Data Analyzer:** An administrative dashboard widget that analyzes student engagement data to predict drop-out risks before they happen.
- **AI Image Generation:** An integration (e.g., via DALL-E or Stable Diffusion) to allow instructors to generate beautiful course thumbnails with a single click if they don't have their own cover image.
- **AI Audio Transcription:** Automatically converting uploaded lesson videos to text transcripts for improved accessibility and searchability.

---

## 💻 Developer Notes

### Setup Instructions
1. Ensure your PostgreSQL database is running.
2. Set your AI provider keys in the backend `.env` file.
3. Start the backend: `npm run dev` (in the `eduai-backend` directory).
4. Start the frontend: `npm run dev` (in the `eduai-frontend` directory).

### Environment Variables
**Backend (`eduai-backend/.env`)**
```env
# AI Provider API Keys
GROQ_API_KEY="your_groq_api_key_here"

# If switching models:
GEMINI_API_KEY="your_gemini_api_key_here"
```

### Rate Limiting & Optimization
- **Rate Limiting:** All AI routes are protected by `aiLimiter` in the backend to prevent API abuse and cost overruns. Ensure `express-rate-limit` is properly configured in production.
- **JSON Parsing:** The `aiService` includes robust string stripping (`replace(/```json|```/g, "")`) to ensure that LLM responses with markdown code blocks do not break `JSON.parse`.
- **Concurrent Requests:** In the frontend `CreateCourseModal`, `generateDescription` and `classifyContent` are executed concurrently via `Promise.all()` to significantly reduce the user's waiting time.
