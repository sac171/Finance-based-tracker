import { useState, useEffect } from "react";
import { loginUser, signupUser } from "../api/authApi";

const FAKE_DOMAINS = [
  "mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email",
  "yopmail.com", "sharklasers.com", "trashmail.com", "fakeinbox.com",
  "maildrop.cc", "dispostable.com", "spamgourmet.com", "getairmail.com",
];

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return "Enter a valid email address";
  if (email.includes("..")) return "Email cannot have consecutive dots";
  const domain = email.split("@")[1];
  if (!domain || domain.length < 4) return "Invalid email domain";
  if (FAKE_DOMAINS.includes(domain.toLowerCase())) return "Temporary emails not allowed";
  const local = email.split("@")[0];
  if (local.startsWith(".") || local.endsWith(".")) return "Invalid email format";
  if (local.length < 2) return "Email username too short";
  return null;
};

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return [
    { score: 0, label: "", color: "" },
    { score: 1, label: "Weak", color: "#ef4444" },
    { score: 2, label: "Fair", color: "#f97316" },
    { score: 3, label: "Good", color: "#eab308" },
    { score: 4, label: "Strong", color: "#22c55e" },
  ][score];
};

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const passwordStrength = getPasswordStrength(form.password);

  useEffect(() => {
    if (isOpen) {
      setForm({ name: "", email: "", password: "" });
      setErrors({});
      setApiError("");
      setTouched({});
      setShowPassword(false);
      setIsLogin(true);
    }
  }, [isOpen]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Min 2 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Letters only";
        return null;
      case "email":
        if (!value) return "Email is required";
        return validateEmail(value);
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Min 8 characters";
        if (!/[A-Z]/.test(value)) return "Add at least one uppercase letter";
        if (!/[0-9]/.test(value)) return "Add at least one number";
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const fields = isLogin ? ["email", "password"] : ["name", "email", "password"];
    const newErrors = {};
    fields.forEach((f) => {
      const err = validateField(f, form[f]);
      if (err) newErrors[f] = err;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, password: true });
      return;
    }
    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await loginUser({ email: form.email, password: form.password });
      } else {
        data = await signupUser(form);
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } catch (err) {
      setApiError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = () => {
    setIsLogin(!isLogin);
    setForm({ name: "", email: "", password: "" });
    setErrors({});
    setApiError("");
    setTouched({});
    setShowPassword(false);
  };

  if (!isOpen) return null;

  return (
    // ✅ FIX: Full screen overlay, scrollable, modal never overflows
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ✅ FIX: max-h with overflow-y-auto so content scrolls inside modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden">
        
        {/* Top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        {/* ✅ FIX: Scrollable inner content */}
        <div className="overflow-y-auto max-h-[85vh] p-6">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition text-sm"
          >
            ✕
          </button>

          {/* Header — compact */}
          <div className="text-center mb-4">
            <div className="text-3xl mb-1">{isLogin ? "👋" : "🚀"}</div>
            <h2 className="text-xl font-bold text-gray-800">
              {isLogin ? "Welcome back!" : "Create account"}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              {isLogin ? "Login to manage your finances" : "Start tracking expenses today"}
            </p>
          </div>

          {/* Tab Switch */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            <button
              onClick={() => !isLogin && handleTabSwitch()}
              className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => isLogin && handleTabSwitch()}
              className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                !isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 mb-3 text-xs flex items-center gap-2">
              <span>⚠️</span> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>

            {/* Name */}
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm transition-all outline-none ${
                    errors.name
                      ? "border-red-400 bg-red-50"
                      : touched.name && !errors.name
                      ? "border-green-400 bg-green-50"
                      : "border-gray-200 focus:border-blue-400"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">✗ {errors.name}</p>
                )}
                {touched.name && !errors.name && form.name && (
                  <p className="text-green-500 text-xs mt-0.5 flex items-center gap-1">✓ Looks good!</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@gmail.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
                className={`w-full px-3 py-2.5 border-2 rounded-xl text-sm transition-all outline-none ${
                  errors.email
                    ? "border-red-400 bg-red-50"
                    : touched.email && !errors.email
                    ? "border-green-400 bg-green-50"
                    : "border-gray-200 focus:border-blue-400"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">✗ {errors.email}</p>
              )}
              {touched.email && !errors.email && form.email && (
                <p className="text-green-500 text-xs mt-0.5 flex items-center gap-1">✓ Valid email</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={isLogin ? "Your password" : "Min 8 chars, 1 uppercase, 1 number"}
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className={`w-full px-3 py-2.5 pr-10 border-2 rounded-xl text-sm transition-all outline-none ${
                    errors.password
                      ? "border-red-400 bg-red-50"
                      : touched.password && !errors.password
                      ? "border-green-400 bg-green-50"
                      : "border-gray-200 focus:border-blue-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-base"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password strength — signup only */}
              {!isLogin && form.password && (
                <div className="mt-1.5">
                  <div className="flex gap-1 mb-0.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            i <= passwordStrength.score ? passwordStrength.color : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <p className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label} password
                    </p>
                  )}
                </div>
              )}

              {errors.password && (
                <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">✗ {errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-blue-200 mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Please wait...
                </span>
              ) : isLogin ? "Login to FinTrack" : "Create My Account"}
            </button>
          </form>

          <p className="text-center mt-3 text-xs text-gray-400">
            🔒 Your data is encrypted & secure
          </p>
        </div>
      </div>
    </div>
  );
}