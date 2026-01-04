# DriveLocker

**DriveLocker** is a secure, full-stack personal storage application designed to manage files and notes with an extra layer of security. It features a robust Spring Boot backend with JWT authentication and a modern React frontend styled with Tailwind CSS.

---

## 🚀 Live Demo

* **Frontend:** [https://drivelocker-ui.vgcodes.online/](https://drivelocker-ui.vgcodes.online/)
* **Backend API:** [https://drivelocker-apii.vgcodes.online/](https://drivelocker-apii.vgcodes.online/)

---

## ✨ Features

* **Secure Authentication:** JWT-based login, email verification (OTP), and password reset.
* **File Management:** Upload, store, and manage files securely via Cloudinary integration.
* **Encrypted Notes:** Create and manage personal notes.
* **Passkey Security:** Additional security layer using custom passkeys for sensitive data.
* **Responsive UI:** Built with React 19, Framer Motion for animations, and Tailwind CSS.

---

## 🛠️ Tech Stack

### Backend (Spring Boot)

* **Java 21**, Spring Boot 3.5.4
* **Spring Security & JWT** (io.jsonwebtoken)
* **Spring Data JPA** (MySQL Connector)
* **Cloudinary SDK** (Media Storage)
* **Spring Mail** (SMTP for OTP/Verification)
* **SpringDoc OpenAPI** (Swagger UI for API docs)

### Frontend (React)

* **React 19**, Vite, Tailwind CSS 4
* **React Query** (Server state management)
* **Axios** (API communication)
* **React Router Dom** (Navigation)
* **Framer Motion** (UI Animations)

---

## ⚙️ Setup & Installation

### Prerequisites

* JDK 21
* Node.js (v18+)
* MySQL Server
* Cloudinary Account (for file uploads)

### 1. Backend Setup

1. Navigate to the `Server` directory.
2. Create a `.env` file in the root of the server folder:
```env
DB_URL=jdbc:mysql://localhost:3306/drivelocker
DB_USERNAME=your_username
DB_PASSWORD=your_password
CLOUDINARY_URL=your_cloudinary_url
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_app_password
JWT_SECRET=your_super_secret_key

```


3. Run the application:
```bash
mvn clean install
mvn spring-boot:run

```



### 2. Frontend Setup

1. Navigate to the `client` directory.
2. Install dependencies:
```bash
npm install

```


3. Configure the API base URL in `src/Util/constants.js` or your `apiClient.jsx`:
```javascript
// Use localhost for development
export const BASE_URL = "http://localhost:8080";

```


4. Start the development server:
```bash
npm run dev

```



---

## 📂 Project Structure

### Backend Highlights

* **`config/`**: Security and Auth configurations.
* **`controller/`**: REST endpoints for Auth, Files, Notes, and Profile.
* **`models/`**: JPA Entities (User, File, Notes, PassKey).
* **`service/`**: Business logic and Cloudinary integration.
* **`filter/`**: JWT Request filtering for protected routes.

### Frontend Highlights

* **`context/`**: Global state management (Auth, Files, Notes).
* **`Pages/`**: Main views including Login, Files, and CreatePasskey.
* **`services/`**: API wrapper classes using Axios.
* **`Components/`**: Reusable UI elements (UploadModal, FileActions).

---
