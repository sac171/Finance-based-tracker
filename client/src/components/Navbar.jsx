// ✅ Navbar receives user, setUser, and onLoginClick from Dashboard
// AuthModal is now handled globally in Dashboard — not here
export default function Navbar({ user, setUser, onLoginClick }) {

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-xl font-bold text-blue-600">💰 FinTrack</h1>

      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Hi, {user.name} 👋</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Login / Register
          </button>
        )}
      </div>
    </nav>
  );
}