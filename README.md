# 🚀 EthioJobFinder

A full-stack job platform connecting Ethiopian job seekers with employers. Built with MERN stack + Cloudinary.

## ✨ Features

### For Job Seekers
- 🔐 JWT Authentication (Register/Login)
- 🔍 Advanced Job Search (category, type, location, salary, experience)
- 📄 Resume Upload (PDF/DOC via Cloudinary)
- 💼 Apply for Jobs with Cover Letter
- 📊 Track Application Status
- 👤 Profile Management with Multiple Resumes

### For Employers
- 🏢 Company Profile with Logo
- ✔️ Verification Badge (Admin-approved)
- 📝 Post Jobs with Rich Details
- 📨 Review Applications
- 📈 Application Statistics

### Admin Panel
- 📊 Dashboard Statistics
- ✔️ Verify Employers
- 👥 Manage Users (Ban/Delete)
- 🗑️ Moderate Jobs
- 📧 Email Notifications

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas + Mongoose |
| Storage | Cloudinary |
| Auth | JWT |
| Email | Console logging (ready for SendGrid/AWS SES) |

## 🚀 Deployment Guide

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Vercel account (frontend)
- Render account (backend)

### 1. MongoDB Atlas Setup

1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create new cluster (free tier available)
3. Add your IP to whitelist
4. Create database user
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/ethiojobfinder`

### 2. Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

### 3. Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Root Directory:** `backend`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ethiojobfinder
   JWT_SECRET=your-super-secret-key-change-this
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
6. Deploy!

### 4. Frontend Deployment (Vercel)

1. Push frontend code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Settings:
   - **Framework:** Create React App
   - **Root Directory:** `frontend`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-render-app.onrender.com/api
   ```
5. Deploy!

### 5. Create Admin User

After deployment, create an admin user via MongoDB Compass or Atlas:

```javascript
// In MongoDB shell or Compass
db.users.insertOne({
  name: "Admin",
  email: "admin@ethiojobs.com",
  password: "$2a$12$...", // bcrypt hashed: "admin123"
  role: "admin",
  isVerified: true
})
```

Or register normally then update role:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## 📁 Project Structure

```
Ethio-Job-Finder/
├── backend/
│   ├── config/           # Database config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & error handlers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Email & Cloudinary
│   └── server.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Page components
│   │   └── services/     # API services
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobs | Get all jobs (with filters) |
| GET | /api/jobs/:id | Get single job |
| POST | /api/jobs | Create job (employer) |
| PUT | /api/jobs/:id | Update job |
| DELETE | /api/jobs/:id | Delete job |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/applications | Apply for job |
| GET | /api/applications/my-applications | Get my applications |
| GET | /api/applications/received | Get received applications |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/stats | Dashboard stats |
| GET | /api/admin/users | List all users |
| PUT | /api/admin/verify-employer/:id | Verify employer |
| DELETE | /api/admin/users/:id | Delete user |

## 🌐 Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-api.com/api
```

## 📱 LinkedIn Post Template

```
🚀 I Built EthioJobFinder – A Job Platform for Ethiopia

Finding jobs and trusted workers in Ethiopia is still very manual and inefficient.

So I built EthioJobFinder — a full-stack MERN application that connects job seekers and employers.

🔹 Features:
• JWT Authentication (Role-based)
• Job Posting & Application System
• Resume Upload (Cloud Storage)
• Employer Verification System
• Admin Dashboard
• Job Filtering by Location

🛠 Tech Stack:
React, Node.js, Express, MongoDB Atlas, Cloudinary, Tailwind CSS

🌍 Live Demo:
[Your Vercel Link]

💻 GitHub:
[Your Repo Link]

This project is designed to solve real-world hiring challenges in Ethiopia.

I'm open to opportunities and collaborations.

#MERN #FullStack #Ethiopia #SoftwareDeveloper #OpenToWork #React #NodeJS
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for your portfolio or startup!

## 🙏 Acknowledgments

- Built as a portfolio project demonstrating full-stack development
- Designed specifically for the Ethiopian job market
- Focus on trust and verification for safety

---

**Ready to deploy?** Follow the steps above and you'll have a production-ready job platform in minutes!

For issues or questions, open a GitHub issue or reach out on LinkedIn.
