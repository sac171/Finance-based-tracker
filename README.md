# 💰 FinTrack — Personal Finance Tracker

A full-stack personal expense tracking web app built with **React**, **Node.js**, **Express**, and **MongoDB**. Track your expenses, set budgets, visualize spending, and get AI-powered smart tips.

---

## 🚀 Live Demo

> Run locally at `http://localhost:5173`

---

## ✨ Features

- 🔐 **Auth System** — Signup / Login with JWT authentication
- 📊 **Dashboard** — Full expense overview with stats cards
- ➕ **Add / Edit / Delete Expenses** — Full CRUD with category support
- 💵 **Income Tracker** — Set your monthly income
- 🎯 **Budget Planner** — Set per-category budgets
- 📈 **Smart Charts** — Pie, Bar & animated Progress Bar views
- 💡 **AI Smart Tips** — Auto-generated saving suggestions
- 🔍 **Insights** — Monthly trends & budget alerts
- ✅ **Form Validation** — Real email validation, password strength meter, fake email blocking
- 📱 **Responsive** — Works on mobile, tablet & desktop

---

## 🛠️ Tech Stack

### Frontend
| Tech | Usage |
|------|-------|
| React 18 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Recharts | Charts & Graphs |
| Framer Motion | Animations |
| Axios | HTTP Requests |
| React Router DOM | Routing |

### Backend
| Tech | Usage |
|------|-------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| CORS | Cross-Origin Requests |
| dotenv | Environment Variables |

---

## 📁 Project Structure

```
fintrack/
│
├── frontend/                   # React App (Vite)
│   ├── public/
│   └── src/
│       ├── api/
│       │   ├── authApi.js       # Login / Signup API calls
│       │   └── expenseApi.js    # Expense CRUD API calls
│       ├── components/
│       │   ├── AuthModal.jsx    # Login/Signup popup with validation
│       │   ├── BudgetForm.jsx   # Set budget per category
│       │   ├── CategoryChart.jsx# Pie, Bar & Progress charts
│       │   ├── ExpenseForm.jsx  # Add/Edit expense form
│       │   ├── ExpenseList.jsx  # List of all expenses
│       │   ├── Footer.jsx       # Footer
│       │   ├── IncomeForm.jsx   # Set monthly income
│       │   ├── Insights.jsx     # Spending insights
│       │   ├── Navbar.jsx       # Top navigation
│       │   └── SmartTips.jsx    # AI-generated tips
│       ├── pages/
│       │   └── Dashboard.jsx    # Main dashboard page
│       ├── utils/
│       │   ├── aiTips.js        # Smart tip generator logic
│       │   └── analytics.js     # Insights/analytics logic
│       └── App.jsx              # App routes
│
└── backend/                    # Node.js + Express API
    ├── controllers/
    │   ├── authController.js    # Signup & Login logic
    │   └── expenseController.js # Expense CRUD logic
    ├── middleware/
    │   └── authMiddleware.js    # JWT protect middleware
    ├── models/
    │   ├── User.js              # User schema
    │   └── Expense.js           # Expense schema
    ├── routes/
    │   ├── authRoutes.js        # /api/auth routes
    │   └── expenseRoutes.js     # /api/expenses routes
    ├── .env                     # Environment variables
    └── server.js                # Express entry point
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fintrack.git
cd fintrack
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fintrack
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

Start the backend server:

```bash
node server.js
# or with nodemon (auto-restart)
npx nodemon server.js
```

> ✅ You should see: `Server running on port 5000` and `MongoDB Connected`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> ✅ Open `http://localhost:5173` in your browser

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login existing user | ❌ |

**Signup Request Body:**
```json
{
  "name": "Sachin yadav",
  "email": "sachin@gmail.com",
  "password": "SecurePass1"
}
```

**Login Request Body:**
```json
{
  "email": "sachin@gmail.com",
  "password": "SecurePass1"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f...",
    "name": "Sachin yadav",
    "email": "sachin@gmail.com"
  }
}
```

---

### Expense Routes — `/api/expenses`

> All routes require `Authorization: Bearer <token>` header

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses for logged-in user |
| POST | `/api/expenses` | Add a new expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

**Expense Object:**
```json
{
  "title": "Grocery Shopping",
  "amount": 1500,
  "category": "Food",
  "date": "2026-03-30"
}
```

---

## 🔒 Authentication Flow

```
User clicks "Add Expense"
        │
        ▼
   Logged in? ──No──▶ Auth Modal (Login/Signup Popup)
        │                        │
       Yes                  Login Success
        │                        │
        ▼                        ▼
  Save to MongoDB ◀─── JWT Token stored in localStorage
```

---

## ✅ Form Validation Rules

### Email
- Must match standard email format
- No consecutive dots (`user..name@`)
- Blocks fake/temp domains: `mailinator.com`, `tempmail.com`, `yopmail.com`, etc.

### Password
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- Visual strength meter: Weak → Fair → Good → Strong

### Name
- Letters only (no numbers or symbols)
- Minimum 2 characters

---

## 📊 Chart Types

| Chart | Description |
|-------|-------------|
| 🥧 Pie Chart | Donut chart with % labels, no text overlap |
| 📊 Bar Chart | Spent vs Budget side-by-side bars |
| 📈 Progress Bars | Animated per-category budget progress with alerts |

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `404 /api/auth/login` | Make sure `app.use("/api/auth", authRoutes)` is in `server.js` |
| `401 Unauthorized` | Check that `Authorization: Bearer <token>` header is sent |
| CORS error | Add `app.use(cors({ origin: "http://localhost:5173" }))` in `server.js` |
| MongoDB not connecting | Check your `MONGO_URI` in `.env` file |
| Blank page at `/login` | Navigate to `/` — login is a modal, not a separate page |

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sachin**

> Built with ❤️ using React + Node.js
