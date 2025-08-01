# 📝 Notes MERN Project

A robust and secure full-stack **notes management application** built with **MongoDB**, **Express.js**, **React.js**, and **Node.js**, allowing users to create, manage, and organize their personal notes. It includes **JWT authentication**, **user profiles**, and supports **CRUD operations** for notes with rich text editing capabilities.

---

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── controller/
│   ├── modal/
│   ├── router/
│   ├── middleware/
│   ├── index.js
│   ├── db/
│   │   └── db.js
│   └── .env
│
└── README.md
```

---

## 🛠️ Technologies Used

### 🔹 Frontend (React)

- React Router DOM
- Axios
- Bootstrap 5
- React Toastify
- React Icons
- JWT Decode
- TinyMCE (Rich Text Editor)
- SASS/SCSS
- Protected Routes with JWT
- Vite

### 🔹 Backend (Node.js + Express)

- JWT (Authentication)
- Bcrypt (Password Hashing)
- Mongoose (ORM)
- Express.js
- CORS
- Multer
- Cloudinary
- Nodemailer
- Joi (Validation)
- dotenv

### 🔹 Database

- MongoDB

---

## 🔐 Authentication Features

- ✅ User Registration
- ✅ User Login with JWT
- ✅ Forgot Password (email with reset token)
- ✅ Reset Password
- ✅ Change Password
- ✅ Protected Routes using Middleware
- ✅ Token Storage in LocalStorage
- ✅ User Profile Management

---

## 📝 Notes Management Functionalities

### 📄 Note Operations

- Create new notes with rich text editing
- Edit existing notes
- Delete notes
- View note details
- Search and filter notes
- Organize notes by user

### 👤 User Profile Management

- View user profile
- Update profile information
- Change password
- Profile picture management

### 🔒 Security Features

- Password protection for individual notes
- JWT token authentication
- Secure password reset flow
- Input validation and sanitization

---

## 🚀 Key Features

- 🔍 Search and filter notes
- ✏️ Rich text editing with TinyMCE
- ☁️ Image upload using Cloudinary
- 🔒 User authentication and authorization
- 📱 Responsive design
- 🔔 Toast notifications for user actions
- 🧼 Clean UI with modern design
- 📧 Email notifications for password reset
- 🎨 Custom styling with SASS

---

## 📦 Installation & Setup

### 1️⃣ Setup Backend

```bash
cd backend
npm install
npm start
```

#### ➕ Create `.env` file

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

### 2️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License

This project is licensed under the **ISC License**.

---
