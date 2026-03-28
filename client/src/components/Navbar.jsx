// components/Navbar.jsx
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md px-6 py-3 flex justify-between items-center">
      <h1 className="font-bold text-xl text-blue-600">FinTrack</h1>
      <div className="flex items-center gap-4">
        <p className="text-gray-700">Hi, {user?.name}</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}