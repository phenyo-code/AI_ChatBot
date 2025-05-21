# Lwazi - AI Chatbot

Lwazi is a modern, responsive AI chatbot application built with Next.js, powered by Groq, and designed to provide an intelligent conversational experience. It features secure user authentication with Google OAuth and credentials-based login, chat history management, and a sleek UI with light/dark mode support. The project uses Prisma with MongoDB for data persistence and Tailwind CSS for styling.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- **AI-Powered Chat**: Engage in conversations with Lwazi, powered by Groq's AI technology.
- **User Authentication**: Secure sign-in with Google OAuth or email/password via NextAuth.js.
- **Chat History**: View, rename, and delete recent chats (authenticated users only).
- **Theme Toggling**: Switch between light and dark modes, persisted via `localStorage`.
- **Responsive Design**: Optimized for mobile and desktop with Tailwind CSS.
- **Dashboard**: Personalized dashboard for authenticated users to manage chats.
- **Error Handling**: Robust error pages and form validation for a smooth user experience.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma, MongoDB
- **Authentication**: NextAuth.js (Google OAuth, credentials provider)
- **AI Integration**: Groq API
- **Icons**: Lucide React, React Icons
- **Animations**: Framer Motion
- **Notifications**: Sonner (toast notifications)

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance, e.g., [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [Git](https://git-scm.com/)
- A Groq API key (sign up at [groq.com](https://groq.com/))
- Google OAuth credentials (set up via [Google Cloud Console](https://console.cloud.google.com/))

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/lwazi.git
   cd lwazi
   ```

2. **Install Dependencies**:
   ```bash
      npm install
    ```

4. **Set Up Environment Variables**:
   Create a .env.local file in the root directory and add the following:

```bash
    GROQ_API_KEY=""
    VERCEL_OIDC_TOKEN=""
    DATABASE_URL=""
    NODE_ENV=
    GOOGLE_CLIENT_ID=""
    GOOGLE_CLIENT_SECRET=""
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET=""
```


## Configuration

Prisma Schema: The prisma/schema.prisma file defines models for User and Chat. Ensure your MongoDB database is running and DATABASE_URL is correctly configured.
NextAuth: Configure authentication providers in app/api/auth/[...nextauth]/route.ts. The project supports Google OAuth and credentials-based authentication.
Groq Integration: Verify that the GROQ_API_KEY is valid and the Groq API is accessible for chat functionality.
Tailwind CSS: Tailwind is pre-configured in tailwind.config.js. Ensure the darkMode setting is set to 'class' for theme toggling.

## Running the Project

Start the Development Server:
```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Build for Production:

```bash
npm run build
npm run start
```



Usage

Home Page (/): Unauthenticated users see a welcome message with a call-to-action to sign in. Authenticated users are greeted personally (e.g., Hi, <name>!) and can navigate to their dashboard.
Sign-In (/auth/signin): Log in via Google OAuth or email/password (credentials form is toggleable).
Sign-Up (/auth/signup): Register a new account with email, password, and name.
Dashboard (/dashboard): Authenticated users can view recent chats, start new ones, rename, or delete them.
Chat (/chat?chatId=<id>): Interact with the AI chatbot, powered by Groq.
Theme Toggling: Switch between light and dark modes using the toggle button in the header, sign-in page, or dashboard.

## Project Structure
```bash
lwazi/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx        # Sign-in page with Google and credentials login
│   │   ├── signup/page.tsx        # Sign-up page
│   │   ├── error/page.tsx         # Authentication error page
│   ├── dashboard/page.tsx         # User dashboard for managing chats
│   ├── page.tsx                   # Home page with project overview
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   ├── chats/                 # API routes for chat CRUD operations
├── components/
│   ├── header.tsx                 # Header with navigation and theme toggle
│   ├── project-overview.tsx       # Home page content with personalized greeting
│   ├── chat.tsx                   # Chat component (UI for AI interaction)
│   ├── ui/                        # Reusable UI components (Button, Input, etc.)
├── prisma/
│   ├── schema.prisma              # Prisma schema for User and Chat models
├── public/                        # Static assets (e.g., images, favicon)
├── styles/                        # Global CSS (if any)
├── .env.local                     # Environment variables
├── next.config.js                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Project dependencies and scripts
├── README.md                      # This file
```

## Contributing
Contributions are welcome! To contribute:


