# 🧠 MindCare: Your Digital Sanctuary for Mental Well-being

MindCare is a premium, immersive mental health platform designed to help users find balance, focus, and peace in a fast-paced digital world. Built with a focus on "Modern Zen" design, it offers a suite of cognitive tools and therapeutic exercises.

**🌐 Live Demo: [https://minddcare.netlify.app](https://minddcare.netlify.app)**

![MindCare Banner](./public/og-image.png)

## ✨ Core Features

### 🎮 Mind Games (Cognitive Refinement)
Immersive, low-friction exercises designed to quiet the mind and heighten focus.
*   **Memory Match**: Classic pattern matching to anchor focus.
*   **Light Painter**: Creative flow exercise using glowing trails.
*   **Affirmation Search**: Positive reinforcement through word discovery.

### 🌬️ Breathing Exercises
Responsive, guided breathing modules with dynamic visual feedback.
*   Includes **Box Breathing**, **4-7-8 Technique**, and **Coherent Breathing**.
*   Real-time visual guides that scale across all devices.

### 💬 Serene AI Chat
A compassionate AI assistant powered by Groq (Llama 3.3) to provide supportive guidance and a listening ear whenever you need it.

### 📖 Mood Journal
Track your emotional journey with a clean, intuitive journaling system.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion, Lucide React, Shadcn UI.
*   **Backend**: Node.js, Express.
*   **Database**: MongoDB Atlas.
*   **AI**: Groq SDK (Llama 3.3 70B).
*   **Authentication**: JWT-based secure login and registration.

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas Account
*   Groq API Key

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/sarthak-bhuptani/MindCare.git
    cd MindCare
    ```

2.  **Install Dependencies**
    ```bash
    # Root dependencies
    npm install

    # Server dependencies
    cd server
    npm install
    cd ..
    ```

3.  **Environment Setup**
    Create a `.env` file in the root:
    ```env
    VITE_GROQ_API_KEY=your_key_here
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

4.  **Run the Application**
    ```bash
    npm run fullstack
    ```
    The app will be available at `http://localhost:5173`.

## 🎨 Design Philosophy
MindCare follows a **Modern Zen** aesthetic:
*   **Glassmorphism**: Dual-layer glows and high-transparency blur effects.
*   **Vibrant Gradients**: Carefully curated HSL palettes for calmness and energy.
*   **Micro-animations**: Smooth transitions using Framer Motion for a premium feel.

---
Created by [Sarthak Bhuptani](https://github.com/sarthak-bhuptani)
