# লেকচার ট্রান্সক্রাইবার — Deploy Guide

## ✅ Render.com এ Deploy করুন (বিনামূল্যে, ৫ মিনিট)

### Step 1: GitHub এ Upload করুন
1. https://github.com এ যান → Sign Up (বিনামূল্যে)
2. "New repository" → নাম দিন: `lecture-transcriber`
3. "uploading an existing file" ক্লিক করুন
4. এই সব ফাইল drag করে upload করুন:
   - `server.js`
   - `package.json`
   - `public/` folder (সব ফাইল সহ)
5. "Commit changes" চাপুন

### Step 2: Render.com এ Deploy করুন
1. https://render.com এ যান → Sign Up with GitHub
2. "New +" → "Web Service"
3. আপনার `lecture-transcriber` repo বেছে নিন
4. Settings:
   - **Name:** lecture-transcriber
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. "Environment Variables" section এ যান:
   - Key: `ANTHROPIC_API_KEY`
   - Value: আপনার Anthropic API key (https://console.anthropic.com)
6. "Create Web Service" চাপুন

### Step 3: Deploy হওয়ার পর
- Render আপনাকে একটি URL দেবে: `https://lecture-transcriber-xxxx.onrender.com`
- ফোনে Chrome দিয়ে সেই URL খুলুন
- Chrome মেনু (⋮) → **"Add to Home Screen"** → Install!

---

## 📁 File Structure
```
lecture-transcriber/
├── server.js          ← Node.js proxy server
├── package.json       ← Dependencies
└── public/
    ├── index.html     ← PWA app
    ├── manifest.json  ← PWA config
    ├── sw.js          ← Service Worker
    └── icons/
        ├── icon-192.png
        └── icon-512.png
```

## 🔑 Anthropic API Key পাওয়ার নিয়ম
1. https://console.anthropic.com এ যান
2. Sign Up করুন
3. "API Keys" → "Create Key"
4. Key টি copy করে Render এর Environment Variable এ paste করুন

## ⚠️ Important
- Render এর Free tier প্রথম request এ 30-60 সেকেন্ড লাগতে পারে (cold start)
- তারপর normal speed এ কাজ করবে
- API key কখনো public করবেন না
