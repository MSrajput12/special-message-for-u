---

# 💌 Special Message For You — Romantic Proposal Web App

![GitHub stars](https://img.shields.io/github/stars/MSrajput12/special-message-for-u?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/MSrajput12/special-message-for-u?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/MSrajput12/special-message-for-u?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/MSrajput12/special-message-for-u?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge\&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-success?style=for-the-badge\&logo=mongodb)

---

## 💖 What Is This?

A beautifully designed **romantic YES/NO proposal web app** where:

❤️ The girl clicks **YES** → Shows special message
💔 The girl clicks **NO** → NO button runs away + NO clicks counted
📊 Admin panel shows all user responses
🛡️ Admin has secure password login + analytics

Yeh ek fun + emotional project hai made specially for sending **personal romantic proposals**.

---

## ✨ Features

### 🌸 User Side

* Smooth animations
* Floating NO button when user tries to reject
* Records YES & NO click count
* Shows final romantic message
* Mobile responsive design
* Glassmorphism UI

---

### 🛡️ Admin Panel

* Secure Login
* Change Password
* See all user responses
* Shows:

  * ❤️ Total YES
  * 💔 Total NO
  * 👀 Total Views
  * 🔥 Average NO Clicks (Resistance Power)
* Delete single response
* **Delete ALL** responses (Ultra Fast)
* Real-time stats
* Modern table + animations

---

## 🧠 Tech Stack

| Layer      | Tech Used             |
| ---------- | --------------------- |
| Frontend   | HTML, CSS, JavaScript |
| Backend    | Node.js, Express.js   |
| Database   | MongoDB Atlas         |
| Hosting    | Render.com            |
| Versioning | Git + GitHub          |

---

## 📂 Project Structure

```
backend/
│── server.js
│── package.json
│── .env  (ignored)
│
└── public/
    ├── index.html       (User Page)
    ├── admin.html       (Admin Panel)
    ├── style.css        (User CSS)
    ├── admin.css        (Admin CSS)
    ├── script.js        (User Logic)
    └── admin.js         (Admin Logic)
```

---

## 🔌 API Endpoints

### **User Responses**

| Method | Endpoint                  | Description       |
| ------ | ------------------------- | ----------------- |
| POST   | `/api/save-response`      | Save YES/NO click |
| GET    | `/api/responses`          | Get all users     |
| GET    | `/api/response/:userName` | Get one user      |
| DELETE | `/api/response/:id`       | Delete one        |
| DELETE | `/api/responses`          | Delete ALL        |

### **Admin**

| Method | Endpoint                     | Description           |
| ------ | ---------------------------- | --------------------- |
| POST   | `/api/admin/login`           | Admin Login           |
| POST   | `/api/admin/change-password` | Change Admin Password |

---

## 🚀 Setup & Run Locally

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

### 2️⃣ Create `.env`

```
MONGODB_URI=your_mongo_url_here
```

### 3️⃣ Start server

```bash
node server.js
```

Server:
👉 [http://localhost:3000](http://localhost:3000)
👉 [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

## 🌍 Deployment (Render.com)

### Render Settings:

| Setting        | Value            |
| -------------- | ---------------- |
| Root Directory | `backend`        |
| Build Command  | `npm install`    |
| Start Command  | `node server.js` |
| Environment    | Add MONGODB_URI  |


---

## 👨‍💻 Author

Made with ❤️ by **Adi Rajput**

[![Instagram](https://img.shields.io/badge/Instagram-Follow-red?style=for-the-badge\&logo=instagram)](https://instagram.com/_the_manish_rajput_)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?style=for-the-badge\&logo=github)](https://github.com/MSrajput12)

---

## ⭐ If You Loved This Project

Give it a **STAR ⭐** on GitHub. It motivates a lot!

---


