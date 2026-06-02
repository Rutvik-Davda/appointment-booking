# 🏥 MediBook – Appointment Booking System

## 🚀 Run karne ka Command (Google Chrome mein):

```bash
# Step 1: Folder mein jao
cd "Appointment Booking"

# Step 2: Packages install karo (sirf pehli baar)
npm install

# Step 3: Project start karo
npm run dev

# Step 4: Chrome mein open karo
http://localhost:5173
```

---

## 🔐 Demo Login (Firebase ke bina bhi chalega):

| Role   | Email               | Password     |
|--------|---------------------|--------------|
| Patient | apna@email.com     | koi bhi (6+) |
| Admin  | admin@medibook.com  | koi bhi (6+) |

---

## 🔥 Firebase Setup (Step by Step):

### Step 1: Firebase Project Banao
1. https://console.firebase.google.com jaao
2. "Add project" click karo
3. Name: `appointment-booking` → Continue → Create

### Step 2: Authentication Enable Karo
1. Left menu → Authentication → Get Started
2. Sign-in method → Email/Password → Enable → Save

### Step 3: Web App Add Karo
1. Project Settings (gear icon) → Your apps → Web (</>) icon
2. App nickname: `medibook-web` → Register App
3. **Config values copy karo**

### Step 4: .env File Banao
Root folder mein `.env` file banao aur paste karo:
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
```

### Step 5: Admin Set Karo
`admin@medibook.com` email se register karo → automatically admin bnega

---

## 🌐 GitHub + Vercel Deploy:

```bash
# GitHub
git init
git add .
git commit -m "MediBook Appointment Booking"
git remote add origin https://github.com/yourusername/appointment-booking.git
git push -u origin main
```

**Vercel:**
1. https://vercel.com → Import GitHub repo
2. Environment Variables mein .env values add karo
3. Deploy!

---

## ✅ Features:
- Firebase Auth (Register/Login/Logout)
- Body-part booking – Male (45 parts) + Female (48 parts)
- Doctor management with images
- Appointment: Pending → Approved (Blue) → Completed
- Payment system
- FullCalendar view
- Dark/Light mode
- Admin dashboard with dynamic stats
- Fully responsive
