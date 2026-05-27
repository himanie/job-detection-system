# JobShield.AI — Free Deployment Guide

Ye project 2 parts mein hai:
- **Backend** (Python Flask API) → `backend/` folder → **Render.com** par deploy hoga (free)
- **Frontend** (HTML/CSS/JS) → `frontend/` folder → **Netlify** par deploy hoga (free)

Dono free hain. Sirf ek GitHub account chahiye.

---

## STEP 0 — Code ko GitHub par daalo

Render aur Netlify dono GitHub se code uthate hain.

1. https://github.com par account banao (agar nahi hai).
2. Ek naya repository banao, naam: `jobshield`
3. Apne project folder mein terminal kholo aur ye chalao:

```bash
cd /Applications/MAMP/htdocs/Glin/Fake_internship_and_Job_Detection_system
git add .
git commit -m "deploy ready"
git remote add origin https://github.com/<TUMHARA_USERNAME>/jobshield.git
git branch -M main
git push -u origin main
```

(Agar `remote add origin` error de — "already exists" — to `git remote set-url origin ...` use karo.)

---

## STEP 1 — Backend deploy karo (Render.com)

1. https://render.com par GitHub se sign up karo (free).
2. Dashboard → **New +** → **Web Service**.
3. Apna `jobshield` repo connect karo.
4. Settings bharo:
   - **Root Directory:** `jobshield_java/backend`
   - **Runtime / Language:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Instance Type:** `Free`
5. **Create Web Service** dabao. 2-4 minute build hoga.
6. Ho jane par tumhe ek URL milega, jaise:
   `https://jobshield-xxxx.onrender.com`
7. Browser mein wo URL kholo — `{"status":"JobShield API is running"}` dikhna chahiye. ✅

   👉 Is URL ko **copy** karke rakho — agle step mein chahiye.

> Note: Free tier par 15 min koi use na kare to server "so" jata hai. Pehli request par 30-50 sec lagte hain jaagne mein. Demo se pehle ek baar URL khol kar jaga lena.

---

## STEP 2 — Frontend mein backend URL daalo

In **3 files** mein `const API_BASE = "http://127.0.0.1:5000";` ko apni Render URL se badlo:

- `frontend/analyze.html`
- `frontend/login.html`
- `frontend/reports.html`

Naya value (example):
```js
const API_BASE = "https://jobshield-xxxx.onrender.com";
```
(Aakhir mein slash `/` mat lagana.)

Phir badlav GitHub par push karo:
```bash
git add .
git commit -m "set backend url"
git push
```

---

## STEP 3 — Frontend deploy karo (Netlify)

1. https://app.netlify.com par GitHub se sign up karo (free).
2. **Add new site** → **Import an existing project** → GitHub → `jobshield` repo.
3. Settings:
   - **Base directory:** `jobshield_java/frontend`
   - **Build command:** *(khaali chhod do — ye plain HTML hai)*
   - **Publish directory:** `jobshield_java/frontend`
4. **Deploy** dabao. Tumhe ek live URL milega, jaise:
   `https://jobshield-demo.netlify.app`

Bas! Ye link kisi ko bhi bhej sakte ho. 🎉

---

## Login details (demo)
- Email: `admin@gmail.com`
- Password: `1234`

(Ye `backend/app.py` mein hardcoded hai — chaaho to badal sakte ho.)

---

## Agar kuch kaam na kare
- Frontend khulta hai par "Server error" aata hai → backend URL galat hai ya server so gaya hai. Render URL browser mein khol kar jaga lo.
- Login na ho → `API_BASE` URL ke aakhir mein extra `/` to nahi? Hata do.
- Render build fail → `requirements.txt` `jobshield_java/backend/` ke andar hai ya nahi check karo.
