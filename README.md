# AI Resume Plus 🚀

AI Resume Plus is a modern, AI-powered resume builder designed to help job seekers create professional, ATS-friendly resumes in minutes. Built with a robust MERN stack (MongoDB, Express.js, React, Node.js) and enhanced with AI capabilities, this application streamlines the resume creation process.

## 🌟 Features

- **AI-Powered Content Generation**: Leverage AI to generate professional summaries, experience descriptions, and skills based on your input.
- **Real-time Preview**: See your resume come to life as you edit it with our split-screen editor.
- **ATS-Friendly Templates**: Export resumes that are optimized for Applicant Tracking Systems.
- **Secure Authentication**: User accounts are protected with secure login and registration.
- **Dashboard**: Manage multiple resumes, update them anytime, and track your application progress.
- **Modern UI/UX**: A sleek, dark-themed interface built with Tailwind CSS and Framer Motion for a premium user experience.

## 🛠️ Tech Stack

### Frontend
- **React**: UI library for building interactive interfaces.
- **Vite**: Next-generation frontend tooling.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: Production-ready animation library for React.
- **Redux Toolkit**: State management.
- **React Router**: Navigation and routing.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing user data and resumes.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.

### AI Services
- **Groq**: Llama 3.3-70b-versatile (Primary provider for fast, free inference).
- **OpenAI**: GPT-3.5 Turbo (Secondary fallback for high-quality responses).
- **Google Gemini**: Gemini 1.5 Flash (Tertiary fallback).

## 🚀 Getting Started

[View Deployment Guide](deployment.md)

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally or a MongoDB Atlas connection string.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Tatendamarimo/ai-resume-plus.git
    cd ai-resume-plus
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd Backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../Frontend
    npm install
    ```

4.  **Environment Variables**
    Create a `.env` file in the `Backend` directory and add your configuration (Database URL, JWT Secret, etc.).
    Create a `.env` file in the `Frontend` directory with the following keys:
    ```env
    VITE_GROQ_API_KEY=your_groq_api_key
    VITE_OPENAI_API_KEY=your_openai_api_key
    VITE_GEMENI_API_KEY=your_gemini_api_key
    ```

5.  **Run the Application**
    *   Start the Backend:
        ```bash
        cd Backend
        npm run dev
        ```
    *   Start the Frontend:
        ```bash
        cd Frontend
        npm run dev
        ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
