# ប្រព័ន្ធរៀបចំកិច្ចតែងការបង្រៀនស្វ័យប្រវត្តិតាមស្តង់ដារក្រសួងអប់រំ (Gemini AI Web App)

ប្រព័ន្ធ Web Application សម្រាប់ជួយលោកគ្រូ-អ្នកគ្រូក្នុងការរៀបចំកិច្ចតែងការបង្រៀនស្របតាម **ស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡានៃព្រះរាជាណាចក្រកម្ពុជា** (ជាពិសេសកម្មវិធីសាលារៀនជំនាន់ថ្មី NGS) ដោយស្វ័យប្រវត្តិជាមួយ **Google Gemini AI (gemini-2.5-flash)**។

---

## 🌟 លក្ខណៈពិសេសចម្បងៗ (Key Features)

1. **ស្ដង់ដារគរុកោសល្យខ្មែរ ១០០%**៖
   - បែងចែក **វត្ថុបំណង ៣ ប្រការ** (ចំណេះដឹង បំណិន ឥរិយាបថ)
   - អនុវត្ត **ដំណាក់កាលបង្រៀន ៥ ជំហាន** (រដ្ឋបាលថ្នាក់, រំលឹកមេរៀនចាស់, ទំនាក់ទំនងមេរៀនថ្មី, ពង្រឹងចំណេះដឹង, និងបណ្ដាំផ្ញើ) ក្នុងតារាងសកម្មភាពគ្រូ-សិស្ស
2. **AI Structured Output**៖ ប្រើប្រាស់ JSON Schema ដើម្បីធានាថា AI ឆ្លើយត្រង់ក្រឡាតារាង មិនរាយប៉ាយ
3. **Live Preview**៖ បង្ហាញកិច្ចតែងការភ្លាមៗលើផ្ទាំងអេក្រង់មុនពេលទាញយក
4. **Export ជា Word (.docx)**៖ ទាញយកជាឯកសារ Word ផ្លូវការដែលមានពុម្ពអក្សរខ្មែរ (Khmer OS Muol Light & Khmer OS Siemreap) ត្រឹមត្រូវតាមទម្រង់ក្រសួង
5. **Print & PDF Ready**៖ អាចចុច Print ឬ Save as PDF បានភ្លាមៗ
6. **Vercel Ready**៖ រៀបចំឡើងសម្រាប់ Serverless Deployment លើ Vercel ដោយឥតគិតថ្លៃ។

---

## 📁 រចនាសម្ព័ន្ធគម្រោង (Project Structure)

```
ប្រព័ន្ធរៀបចំកិច្ចតែងការបង្រៀន/
├── api/
│   ├── generate.js        # Serverless Function: ហៅទៅ Gemini 2.5 Flash ជាមួយ JSON Schema
│   └── export-docx.js     # Serverless Function: បង្កើតឯកសារ Word (.docx) ផ្លូវការ
├── public/
│   ├── index.html         # ផ្ទាំង Frontend (Tailwind CSS, Kantumruy Pro, Moul)
│   ├── app.js             # Logic នៃ Form, Preview, និង Download Word
│   └── style.css          # Styling និង Print Stylesheet
├── package.json           # Node.js dependencies (docx, express, dotenv)
├── vercel.json            # ការកំណត់សម្រាប់ Vercel Deployment
├── server.js              # Express Server សម្រាប់រត់សាកល្បងលើ Localhost
├── .env.example           # គំរូ Environment Variables
└── README.md              # ឯកសារណែនាំ
```

---

## 🚀 របៀបរត់សាកល្បងលើកុំព្យូទ័រផ្ទាល់ខ្លួន (Local Development)

១. បើក Terminal ក្នុង Folder នេះ រួចដំឡើង Dependencies៖
```bash
npm install
```

២. បង្កើត File `.env` ដោយចម្លងពី `.env.example`៖
```bash
cp .env.example .env
```
រួចបញ្ចូល Gemini API Key របស់អ្នក (ទទួលបានពី [Google AI Studio](https://aistudio.google.com/))៖
```env
GEMINI_API_KEY=AIzaSy...
```

៣. ចាប់ផ្ដើមដំណើរការ Server៖
```bash
npm start
```
៤. បើក Browser ហើយចូលទៅកាន់៖ `http://localhost:3000`

---

## ☁️ របៀប Hosting ទៅកាន់ Vercel (Step-by-Step Guide)

អ្នកអាចជ្រើសរើសតាមវិធីណាមួយក្នុងចំណោម ២ វិធីខាងក្រោម៖

### វិធីទី១៖ តាម Vercel Web Dashboard (ងាយស្រួល និងពេញនិយមបំផុត)

១. **Push កូដនេះទៅកាន់ GitHub Account របស់អ្នក**៖
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Khmer Lesson Plan AI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/khmer-lesson-plan-ai.git
   git push -u origin main
   ```
២. ចូលទៅកាន់ [vercel.com](https://vercel.com/) ហើយចុច **Log in**
៣. ចុចប៊ូតុង **"Add New..."** ➡️ ជ្រើសរើស **"Project"**
៤. ជ្រើសរើស GitHub Repository `khmer-lesson-plan-ai` រួចចុច **"Import"**
៥. នៅត្រង់ផ្នែក **"Environment Variables"** បញ្ចូល៖
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `API Key របស់អ្នកពី Google AI Studio`
៦. ចុច **"Deploy"** ➡️ រង់ចាំប្រហែល ៣០ វិនាទី អ្នកនឹងទទួលបាន URL ផ្លូវការ (ឧ. `https://khmer-lesson-plan-ai.vercel.app`) ដែលអាចប្រើប្រាស់ និងចែករំលែកដល់លោកគ្រូ-អ្នកគ្រូទូទាំងប្រទេស!

---

### វិធីទី២៖ តាម Vercel CLI (តាមរយៈ Terminal)

១. បើក Terminal ក្នុង Folder នេះ
២. Login ចូល Vercel Account៖
   ```bash
   npx vercel login
   ```
   (ប្រព័ន្ធនឹងសួរ Email ឬបើក Browser ឱ្យអ្នកចុច Verify)
៣. Deploy ទៅ Vercel៖
   ```bash
   npx vercel
   ```
   (ជ្រើសរើស Yes លើគ្រប់សំណួរ ដើម្បីបង្កើត Project ថ្មី)
៤. បញ្ចូល Environment Variable `GEMINI_API_KEY` លើ Vercel Project Settings ឬតាម Command៖
   ```bash
   npx vercel env add GEMINI_API_KEY production
   ```
៥. Deploy ឡើង Production ជាផ្លូវការ៖
   ```bash
   npx vercel --prod
   ```
