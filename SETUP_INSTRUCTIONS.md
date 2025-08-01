# 🎓 Online Course Registration System - Complete Setup Guide

## 🚀 Quick Start

This is a **fully functional** online course registration system with all the features you requested:

✅ **Google OAuth Authentication** with multi-device support  
✅ **Department-based Course Browsing** (Engineering, Computer Science, IT, etc.)  
✅ **Course Categories** (Cloud Computing, AI/ML, Cybersecurity, Web Development, etc.)  
✅ **Student Registration & Enrollment** with profile management  
✅ **Admin Portal** with comprehensive management tools  
✅ **Excel Export** functionality for student registration data  
✅ **Responsive Modern UI** with Material-UI components  

## 🛠️ Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
3. **Google Cloud Account** - For OAuth setup

## 📦 Installation

### Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### Step 2: Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/course_registration

# Google OAuth Configuration (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Security Keys (Generate secure random strings)
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here

# URLs
CLIENT_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=your-admin-email@gmail.com
```

### Step 3: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set Application type to **Web application**
6. Add these Authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `https://yourdomain.com/api/auth/google/callback` (for production)
7. Copy the **Client ID** and **Client Secret** to your `.env` file

### Step 4: Database Setup

```bash
# Make sure MongoDB is running, then seed the database
node scripts/seedData.js
```

This will create **16 sample courses** across all departments:
- **Computer Science**: Programming, Web Development, AI/ML, Data Science
- **Engineering**: Project Management, Cloud Computing with AWS
- **Information Technology**: Cybersecurity, DevOps, Network Security
- **Electronics**: Digital Electronics, Embedded Systems
- **Mechanical**: Design, Thermodynamics
- **Civil**: Structural Engineering, Environmental Engineering

### Step 5: Run the Application

**Option 1: Development Mode (Recommended)**
```bash
# Terminal 1 - Backend Server
npm run dev

# Terminal 2 - Frontend Development Server
cd client && npm start
```

**Option 2: Production Mode**
```bash
npm run build
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin (login with admin email)

## 👤 User Roles & Features

### 🎓 Student Features
- **Google OAuth Login** with automatic account creation
- **Multi-Device Support** - Login from any device with same Google account
- **Course Browsing** with filters by department, category, and level
- **Department Selection**: Engineering, Computer Science, IT, Electronics, Mechanical, Civil
- **Course Categories**: Cloud Computing, AI/ML, Cybersecurity, Web Development, DevOps, etc.
- **Easy Enrollment** with capacity management
- **Student Dashboard** showing enrolled courses and progress
- **Complete Profile Management** with academic information
- **Responsive Design** - works on mobile, tablet, and desktop

### 👨‍💼 Admin Features
- **Admin Dashboard** with comprehensive statistics
- **Student Management** - view all student registrations
- **Excel Export** - download student registration data in Excel format
- **Course Export** - download course enrollment data
- **Student Details** - view complete student profiles
- **Analytics** - department distribution and enrollment statistics
- **Multi-Device Tracking** - see which devices students use

## 📊 Sample Data Overview

The system comes pre-loaded with:
- **16 Courses** across 6 departments
- **Multiple Categories**: Cloud Computing, AI/ML, Cybersecurity, Web Development, DevOps, etc.
- **All Skill Levels**: Beginner, Intermediate, Advanced
- **Realistic Data**: Instructors, schedules, prerequisites, syllabi
- **Capacity Management**: Each course has enrollment limits

## 🔧 Key Features Explained

### 1. **Google OAuth with Multi-Device Support**
- Users can sign in with Google from any device
- System tracks and manages multiple device logins
- "Already have account" detection works automatically

### 2. **Department-Based Course Organization**
- **Engineering**: Includes Cloud Computing courses and project management
- **Computer Science**: Programming, Web Development, AI/ML
- **Information Technology**: Cybersecurity, DevOps, Networking
- **Electronics**: Digital circuits, Embedded systems
- **Mechanical**: Design, Thermodynamics
- **Civil**: Structural and Environmental engineering

### 3. **Admin Excel Export**
- Export all student registration data
- Filter by department before export
- Includes personal info, academic details, and enrolled courses
- Professional Excel formatting with auto-sized columns

### 4. **Modern UI/UX**
- Material-UI components for professional look
- Responsive design for all screen sizes
- Intuitive navigation and user flows
- Toast notifications for user feedback

## 🚨 Troubleshooting

### Common Issues:

**1. MongoDB Connection Error**
```bash
# Make sure MongoDB is running
# On macOS with Homebrew:
brew services start mongodb-community

# On Ubuntu/Debian:
sudo systemctl start mongod

# On Windows: Start MongoDB service from Services panel
```

**2. Google OAuth Error**
- Verify Client ID and Secret in `.env`
- Check redirect URI in Google Cloud Console
- Make sure Google+ API is enabled

**3. Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env file
```

**4. "Course Registration" shows blank**
- Make sure you've run the seed script: `node scripts/seedData.js`
- Check MongoDB connection
- Verify frontend is connecting to backend

## 📱 Testing the Application

### Student Flow:
1. Go to http://localhost:3000
2. Click "Get Started" or "Sign In"
3. Sign in with Google
4. Complete your profile (department, year, etc.)
5. Browse courses by department
6. Enroll in courses (e.g., "Cloud Computing with AWS" in Engineering)
7. View your dashboard with enrolled courses

### Admin Flow:
1. Sign in with the email you set as `ADMIN_EMAIL` in `.env`
2. Navigate to Admin Panel from the menu
3. View student registrations
4. Export data to Excel
5. View analytics and statistics

## 🔐 Security Features

- **Google OAuth 2.0** for secure authentication
- **Session management** with secure cookies
- **JWT tokens** for API authentication
- **Role-based access control** (Student/Admin)
- **Input validation** and sanitization
- **CORS protection** configured

## 🚀 Production Deployment

### Environment Variables for Production:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/course_registration
CLIENT_URL=https://yourdomain.com
# Update Google OAuth redirect URIs accordingly
```

### Deployment Platforms:
- **Heroku**: Includes `heroku-postbuild` script
- **Vercel**: For frontend deployment
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment

## 📞 Support

If you encounter any issues:

1. **Check the console** for error messages
2. **Verify all environment variables** are set correctly
3. **Ensure MongoDB is running** and accessible
4. **Check Google OAuth configuration**
5. **Make sure ports 3000 and 5000 are available**

## 🎉 Success Indicators

When everything is working correctly, you should see:

✅ **Home page** loads with course categories  
✅ **Google OAuth** login works smoothly  
✅ **Course browsing** shows all departments and categories  
✅ **Student enrollment** updates course capacity  
✅ **Admin panel** shows student data  
✅ **Excel export** downloads properly formatted files  
✅ **Multi-device login** works from different browsers/devices  

---

## 🏆 Congratulations!

You now have a **fully functional course registration system** with:
- Complete authentication system
- Department-based course management
- Student registration and enrollment
- Admin portal with Excel export
- Modern, responsive UI
- Multi-device support

The system is ready for production use! 🚀