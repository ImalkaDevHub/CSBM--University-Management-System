# CSBM Integrated Student Enrollment & Marketing Management System 🎓

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge\&logo=node.js\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![PayHere](https://img.shields.io/badge/PayHere-00A651?style=for-the-badge)

A comprehensive, full-stack web application built with the **MERN stack**, designed to modernize, automate, and digitize the student enrollment and marketing workflows for CSBM.

This platform bridges the gap between prospective students and administrative staff by offering secure application processing, algorithmic prerequisite checking, media offloading, and integrated online payments.

---

## 🚀 Key Features

### 👨‍🎓 For Students

* **Dynamic Program Catalog:** Browse available degrees, diplomas, and certificate programs.
* **Secure Application Portal:** Step-by-step application process with real-time form validation.
* **Protected Routes:** Only authenticated students can apply for courses.
* **Automated Payments:** Secure online application fee payments powered by **PayHere**.
* **Real-time Status Tracking:** Track application and payment statuses through a personalized dashboard.

### 🏢 For Administrators & Staff

* **Automated Eligibility Checker:** A custom Node.js algorithm automatically cross-references submitted student qualifications against program prerequisites, eliminating hours of manual screening.
* **Role-Based Access Control (RBAC):** Distinct dashboards and access levels for Students, Admissions Staff, and Marketing Admins, secured using **Firebase Authentication** JWTs.
* **Document Verification Workflow:** View and approve student documents such as NICs and birth certificates, securely offloaded to **Cloudinary**.
* **Marketing & Workshop Management:** Create promotional events and automatically generate unique **QR Codes** for seamless attendee tracking and check-ins.
* **Automated Payment Verification:** Backend-to-backend **PayHere notification/webhook integration** ensures application payment statuses are updated only after successful payment verification, reducing the risk of client-side manipulation.

---

## 🛠️ Tech Stack

### Frontend (Client)

* **React.js (v18)** - Core UI library (Single Page Application)
* **React Router DOM** - Client-side routing and protected routes
* **Tailwind CSS** - Utility-first styling
* **Ant Design (AntD)** - Enterprise-grade UI components including data tables and modals
* **Axios** - Promise-based HTTP client

### Backend (Server)

* **Node.js & Express.js** - RESTful API architecture
* **MongoDB Atlas & Mongoose** - Cloud-native NoSQL database and Object Data Modeling
* **Firebase Admin SDK** - Secure authentication token verification
* **PayHere API** - Online payment processing and payment notifications
* **Cloudinary API** - Secure media storage and optimization

---

## ⚙️ Local Setup & Installation

This project utilizes a decoupled architecture. You will need to run the `frontend` and `backend` servers concurrently.

### Prerequisites

* Node.js (v16 or higher)
* MongoDB Atlas Account / Local MongoDB URI
* Firebase Project Credentials
* Cloudinary Account
* PayHere Merchant Account

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/csbm-enrollment-system.git
cd csbm-enrollment-system
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

PAYHERE_MERCHANT_ID=your_payhere_merchant_id
PAYHERE_MERCHANT_SECRET=your_payhere_merchant_secret
PAYHERE_NOTIFY_URL=your_payhere_notify_url
```

Start the backend server:

```bash
npm run dev
```

---

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api

REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
```

Start the React development server:

```bash
npm start
```

---

## 📂 Project Structure

```text
📦 csbm-enrollment-system
 ┣ 📂 backend
 ┃ ┣ 📂 controllers
 ┃ ┃ ┗ # Business logic (e.g., Eligibility Checker)
 ┃ ┣ 📂 models
 ┃ ┃ ┗ # Mongoose Schemas (User, Application, Program)
 ┃ ┣ 📂 routes
 ┃ ┃ ┗ # Express API endpoints
 ┃ ┣ 📂 middleware
 ┃ ┃ ┗ # Firebase Auth & Error Handling
 ┃ ┗ 📜 server.js
 ┃   # Backend entry point
 ┃
 ┗ 📂 frontend
   ┣ 📂 src
   ┃ ┣ 📂 components
   ┃ ┃ ┗ # Reusable React components (Cards, Navbar)
   ┃ ┣ 📂 pages
   ┃ ┃ ┗ # Page views (Dashboard, Catalog, Login)
   ┃ ┣ 📂 context
   ┃ ┃ ┗ # React Context (AuthContext)
   ┃ ┗ 📜 App.js
   ┃   # Main routing layout (Protected Routes)
```

---

## 🔐 Security & Integration

* **Firebase Authentication** for secure user authentication.
* **Role-Based Access Control (RBAC)** for managing permissions.
* **PayHere Payment Integration** for secure online payments.
* **PayHere Payment Notifications** for server-side payment status verification.
* **Cloudinary** for secure document and media storage.
* **Protected API Routes** to prevent unauthorized access.
* **Environment Variables** for protecting sensitive credentials and API keys.

---

## 👨‍💻 Developer / Author

**Imalka Madushan**

Full-Stack Developer | IT Undergraduate

**Connect on LinkedIn:**
https://www.linkedin.com/in/imalka-madushan-6954792a0

Developed as part of the **BSc (Hons) Degree in Information Technology**.
