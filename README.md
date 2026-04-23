# 💬 Chat App (MERN + Socket.IO)

```
USER → LOGIN → CONNECT SOCKET → SELECT USER → SEND MESSAGE → REAL-TIME UPDATE
```

---

## 🚀 👉 **LIVE PROJECT**

 https://chat-app-nu-seven-97.vercel.app/
 
## 🚀 👉 **ScreenShots**

<img width="1363" height="646" alt="image" src="https://github.com/user-attachments/assets/154c3a25-88cf-4b3c-bbf8-1eba1e60896b" />
<img width="1365" height="638" alt="image" src="https://github.com/user-attachments/assets/6dbe4770-60b1-4824-b424-afdd1501e6e0" />
<img width="1366" height="646" alt="image" src="https://github.com/user-attachments/assets/e49bcecf-8f8a-4242-a6e6-91a8d10242d9" />




---

## 📦 👉 **TECH STACK**

```
FRONTEND → React + Tailwind + Redux
BACKEND  → Node.js + Express
DATABASE → MongoDB
REALTIME → Socket.IO
AUTH     → Cookies / Session
```

---

## ⚙️ 👉 **FEATURES**

```
✔ AUTH SYSTEM
   → Login / Logout

✔ REAL-TIME CHAT
   → Instant message delivery

✔ ONLINE USERS
   → Live active user list

✔ LAST MESSAGE PREVIEW
   → Shows recent message

✔ IMAGE SUPPORT
   → Send images

✔ AUTO SCROLL
   → Always latest message visible
```

---

## 🧠 👉 **PROJECT FLOW**

```
OPEN APP
   ↓
FETCH USER
   ↓
CONNECT SOCKET
   ↓
LOAD SIDEBAR USERS
   ↓
SELECT USER
   ↓
SEND MESSAGE
   ↓
SOCKET EVENT → RECEIVER UPDATE
```

---

## 📁 👉 **FOLDER STRUCTURE**

```
client/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── redux/
 │   ├── socket/
 │   └── assets/

server/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── socket/
 └── config/
```

---

## 🔧 👉 **INSTALLATION (STEP-BY-STEP)**

### 1️⃣ Clone repo

```
git clone https://github.com/Amit81082/Chat-app.git
cd Chat-app
```

---

### 2️⃣ Setup Backend

```
cd server
npm install
```

👉 Create `.env`

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
```

👉 Run server

```
npm start
```

---

### 3️⃣ Setup Frontend

```
cd client
npm install
```

👉 Create `.env`

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

👉 Run frontend

```
npm start
```

---

## 🔌 👉 **SOCKET FLOW**

```
CLIENT CONNECT
   ↓
SERVER REGISTER USER
   ↓
STORE ONLINE USERS
   ↓
EMIT → onlineUser
   ↓
UI UPDATE
```

---

## 📸 👉 **UI FLOW**

```
┌──────────────┬────────────────────┐
│  SIDEBAR     │     CHAT AREA      │
│ (USERS)      │ (MESSAGES)         │
└──────────────┴────────────────────┘
```

---

## ⚡ 👉 **IMPORTANT LOGIC**

```
✔ Prevent duplicate API calls
✔ Maintain socket connection
✔ Store user in Redux
✔ Handle logout on token expire
```

---

## 🧪 👉 **RUN TEST FLOW**

```
OPEN 2 BROWSERS
   ↓
LOGIN WITH 2 USERS
   ↓
SEND MESSAGE
   ↓
SEE REAL-TIME UPDATE
```

---

## 🚀 👉 **FUTURE IMPROVEMENTS**

```
⬜ Typing indicator
⬜ Message seen status
⬜ Push notifications
⬜ Group chat
⬜ File upload progress
⬜ Dark mode
```

---

## 👨‍💻 👉 **AUTHOR**

```
Amit Maurya
```

---

## ⭐ 👉 **SUPPORT**

```
⭐ Star this repo if useful
🍴 Fork to improve
```

---
