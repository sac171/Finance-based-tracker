import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-xl font-bold text-blue-600">💰 FinTrack</h1>
      <div className="space-x-6 text-gray-700">
        <Link className="hover:text-blue-600 transition" to="/">Dashboard</Link>
        <Link className="hover:text-blue-600 transition" to="/login">Login</Link>
        <Link className="hover:text-blue-600 transition" to="/register">Register</Link>
      </div>
    </nav>
  );
}