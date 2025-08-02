---

# 🚀 QuickDesk - Help Desk System

A modern, full-stack help desk application built with React, **Node.js, and **PostgreSQL, featuring role-based access control, real-time updates, and a premium UI/UX.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

* 🎨 Premium Dark UI – Glassmorphism design with elegant animations
* 👥 Role-Based Access – End Users, Support Agents, and Admins
* 🎫 Ticket Management – Raise, track, and resolve support tickets
* ⚡ Real-Time Updates – Live ticket status changes and notifications via Socket.IO
* 📱 Responsive Design – Seamlessly adapts to desktop, tablet, and mobile
* 🔐 Secure Authentication – JWT-based auth and bcrypt password hashing
* 📊 Dashboard Analytics – Visual insights and ticket statistics for admins

---

## 🛠 Tech Stack

### 🔹 Frontend

* React 18.2
* Material-UI (MUI) v5
* React Router
* Axios
* React Query
* Framer Motion

### 🔸 Backend

* Node.js
* Express.js
* PostgreSQL
* Sequelize ORM
* Socket.IO
* JWT Authentication

---

## 📸 Screenshots

![Image](https://github.com/user-attachments/assets/639aa03b-97c2-4b71-9903-3f5ff7451138)

![Image](https://github.com/user-attachments/assets/13f0ef7c-e20a-4214-9a76-3cdac9e46116)

![Image](https://github.com/user-attachments/assets/b21347d3-8267-44e2-939d-94bbc4bea2f3)

![Image](https://github.com/user-attachments/assets/fdc27066-285e-4173-a339-d38fee9ff8f0)

---

## ⚙ Quick Start

### 🔍 Prerequisites

* Node.js (v16 or higher)
* PostgreSQL (v12 or higher)
* npm or Yarn

### 🧱 Installation

bash
# 1. Clone the repository
git clone https://github.com/Shivendu0103/QuickDesk
cd quickdesk


bash
# 2. Backend Setup
cd backend
npm install


bash
# 3. Frontend Setup
cd ../frontend
npm install


bash
# 4. Create PostgreSQL Database
CREATE DATABASE quickdesk;


---

### 🔐 Environment Variables

backend/.env

env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quickdesk
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret


frontend/.env

env
REACT_APP_API_URL=http://localhost:5000/api


---

### ▶ Run Application

bash
# Terminal 1 - Backend
cd backend
npm run dev


bash
# Terminal 2 - Frontend
cd frontend
npm start


Visit [http://localhost:3000](http://localhost:3000)

---

## 👤 User Roles

| Role              | Permissions                                          |
| ----------------- | ---------------------------------------------------- |
| End User      | Create/view tickets, comment on own tickets          |
| Support Agent | View all tickets, update status, assign tickets      |
| Admin         | Full access, manage users, configure system settings |

---

## 📁 Project Structure


quickdesk/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
└── README.md


---

## 🔌 API Endpoints

### Auth

* POST /api/auth/register — Register a new user
* POST /api/auth/login — Login and get token
* GET /api/auth/me — Get current user

### Tickets

* GET /api/tickets — Fetch all tickets
* POST /api/tickets — Create new ticket
* GET /api/tickets/:id — Get ticket by ID
* PATCH /api/tickets/:id/status — Update ticket status

---

## 🧪 Demo Accounts

| Role          | Email                                             | Password |
| ------------- | ------------------------------------------------- | -------- |
| End User      | [user@quickdesk.com](mailto:user@quickdesk.com)   | demo123  |
| Support Agent | [agent@quickdesk.com](mailto:agent@quickdesk.com) | demo123  |
| Admin         | [admin@quickdesk.com](mailto:admin@quickdesk.com) | demo123  |

---

## 🤝 Contributing

bash
# Steps to contribute
1. Fork the repo
2. Create your feature branch: git checkout -b feature/amazing-feature
3. Commit your changes: git commit -m "Add amazing feature"
4. Push to the branch: git push origin feature/amazing-feature
5. Open a pull request


---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

Your Name

* GitHub: [Shivendu0103](https://github.com/Shivendu0103)
* Email: [shivendu0103@gmail.com](mailto:shivendu0103@gmail.com)

---

## ⭐ Support

If you find this project useful, give it a ⭐ on GitHub and share it!

> Built with ❤ using React & Node.js

---
