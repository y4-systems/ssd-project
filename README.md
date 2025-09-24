# SSD Project — Securing the App

## 👥 Team Members  
- **Fonseka S.A.N.P (IT22192400)** — Implemented **Google OAuth (SSO)** & fixed **Denial of Service (ReDoS)**
- **Tiny H.D.K (IT22060976)** — Fixed **Sensitive Data Exposure** & implemented **Rate Limiting**
- **Perera R.L.S.B (IT22256164)** — Fixed **CSRF vulnerabilities** & removed **Hardcoded URLs** 
- **Rangika G.K.H (IT22178336)** — Fixed **SQL Injection** & performed **Dependency Updates**  
 


---

## 📂 Original Project  
- **Source (pre-fixes):** [🔗 Original GitHub Repository](https://github.com/SadeeshaPerera/Blissify--Wedding-Management-System)  
> *Note:* The original repository commit history predates the semester start date (as required in the assignment brief).  

---

## 🔐 Secured Project (After Fixes)  
- **Modified Project (with fixes):** [🔗 Secured GitHub Repository](https://github.com/y4-systems/ssd-project)  
- **Key Branches:**  
  - `main` → Stable branch (final secured version)  
  - `nuwani-oauth` → OAuth + DoS (ReDoS) work branch  
  - `tiny-rate-limit` → Sensitive Data Exposure + Rate Limiting  
  - `hasindu-sql` → SQL Injection + Dependency updates  
  - `sadeesha-csrf` → CSRF + Hardcoded URL fixes  

---

## ▶️ Demo Video  
📽️ [YouTube Walkthrough of Vulnerabilities, Fixes & OAuth Implementation](https://youtu.be/Av0_Wh0vVus?si=iAx-ppeluQPtXloV)  
- Duration: ≤ 10 minutes  
- Each member explains **their 2 vulnerabilities** (or OAuth work)  
- Shows both **before & after fixes** with code + tool screenshots  

---

## 🔎 Identified Vulnerabilities  
Across the application, we identified **12 major vulnerabilities** using **SonarQube** and **GitHub Security**:  

1. Lack of OAuth (implemented via Google)  
2. Regex Injection → DoS (ReDoS)  
3. SQL Injection  
4. Missing Rate Limiting  
5. CSRF (Cross-Site Request Forgery)  
6. Stack Trace Exposure  
7. Double Escaping  
8. Weak Authentication Implementation  
9. Outdated Dependencies  
10. Denial of Service (DoS via resource exhaustion)  
11. Sensitive Data Exposure  
12. Hardcoded URLs  

Each of these was **fixed** or mitigated with secure coding practices, validated through **SonarQube Quality Gates**, **Postman tests**, and GitHub’s dependency scans.  

---

## 🚀 How to Run the Secured App  
```bash
# Clone repository
git clone <INSERT MODIFIED REPO LINK>
cd mainapp/backend

# Setup environment variables
cp .env
# Required fields in .env:
# PORT=5003
# MONGO_URI=mongodb+srv://<...>
# SESSION_SECRET=<your-secret>
# FRONTEND_URL=http://localhost:3003
# GOOGLE_CLIENT_ID=<your-client-id>
# GOOGLE_CLIENT_SECRET=<your-client-secret>
# GOOGLE_CALLBACK_URL=http://localhost:5003/auth/google/callback

# Install dependencies
npm install

# Start frontend & backend
npm start

## How to run
```bash
cd mainapp/backend
cp .env
# .env requires:
# PORT=5003
# MONGO_URI=mongodb+srv://<...>

