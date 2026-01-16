# Evangadi Forum – Full Stack Application

Evangadi Forum is a full-stack web application that enables users to register, log in, ask questions, and post answers in a community-driven discussion platform.
This repository contains both the backend REST API and the frontend React application.

---

## 📁 Project Structure

EvangadiForum/
├── Client/

├── Server/

└── README.md

---

## ✨ Features

- User authentication (Sign-up & Login)
- JWT-based authorization
- Ask questions and post answers
- View all questions and answers
- Protected API routes
- Responsive UI
- RESTful API integration

---

## 🛠 Technologies Used

### Backend
- Node.js
- Express.js
- JWT
- MYSQL Database

### Frontend
- React
- React Router DOM
- JavaScript (ES6+)
- CSS

---

## 🔐 Backend API Overview

### Authentication
- POST /api/user/register
- POST /api/user/login
- GET /api/user/checkUser

### Questions
- GET /api/question
- GET /api/question/:question_id
- POST /api/question

### Answers
- GET /api/answer/:question_id
- POST /api/answer

---

## 🎨 Frontend Overview

- Sign-up & Sign-in pages
- Home page with all questions
- Question & Answer pages
- Header & Footer components
- Responsive design

### Routes
- / → Home
- /login → Sign-in
- /register → Sign-up
- /question/:id → Question page
- /answer/:id → Answer page
- /about → About page

---

## ⚙️ Installation & Setup

### Clone Repository
git clone https://github.com/Ribka12/EvangadiForum-Individual.git

### Backend
cd server

npm install

npm start

### Frontend
cd client

npm install

npm start

---

## 🚀 Usage

Register, log in, ask questions, post answers, and engage with the community.

---

## 👩‍💻 Author

Ribka Mengiste

Software Engineering

Evangadi Network Project
