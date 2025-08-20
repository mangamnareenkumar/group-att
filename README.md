# 🎓 Group Attendance Viewer

A modern, secure web application for tracking attendance data in groups. Built with React, Node.js, and featuring a beautiful dark mode interface with smooth animations.

## ✨ Features

- **🔐 Secure**: Input validation, rate limiting, CORS protection
- **🎨 Modern UI**: Dark mode, smooth animations, responsive design
- **⚡ Fast**: Async operations, caching, optimized performance
- **📱 Responsive**: Works perfectly on all devices
- **🛡️ Error Handling**: Comprehensive error handling and user feedback

## 🚀 Quick Start

### Backend Setup
```bash
cd server
npm install
npm run dev
```

### Frontend Setup
```bash
cd web
npm install
npm run dev
```

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- Helmet (Security)
- Rate Limiting
- Input Validation (Joi)
- Async File Operations

**Frontend:**
- React 18
- Tailwind CSS
- Framer Motion (Animations)
- Lucide Icons
- Axios

## 🔧 Environment Variables

Create `.env` files:

**Server (.env):**
```
NODE_ENV=development
PORT=3001
```

**Web (.env):**
```
VITE_API_URL=http://localhost:3001/api
```

## 📁 Project Structure

```
group-attendance/
├── server/
│   ├── utils/
│   │   ├── parseAttendance.js
│   │   ├── validation.js
│   │   ├── attendanceService.js
│   │   └── storage.js
│   ├── server.js
│   └── package.json
└── web/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── GroupForm.jsx
    │   │   ├── GroupCard.jsx
    │   │   ├── AttendanceTable.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Error message sanitization
- Path traversal protection

## 🎨 UI Features

- Dark/Light mode toggle
- Smooth page transitions
- Loading animations
- Responsive design
- Glass morphism effects
- Gradient backgrounds

## 📊 API Endpoints

- `GET /api/health` - Health check
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create group
- `DELETE /api/groups/:name` - Delete group
- `GET /api/attendance/:roll` - Get single attendance
- `GET /api/groups/:name/attendance` - Get group attendance

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own purposes!

---

**Made with ❤️ for students by students**