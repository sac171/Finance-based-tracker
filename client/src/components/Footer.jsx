export default function Footer() {
  return (
    <footer className="bg-blue-800 text-white mt-10">
      
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold tracking-wide">
            💰 FinTrack
          </h2>
          <p className="text-sm text-blue-100">
            Smart way to manage your money
          </p>
        </div>

        {/* Center */}
        <div className="text-center text-sm text-blue-100">
          © {new Date().getFullYear()} FinTrack. All rights reserved.
        </div>

        {/* Right */}
        <div className="text-center md:text-right">
          <p className="text-sm">
            Built with <span className="font-semibold hover:text-yellow-300 transition">Sachin</span>
          </p>
        </div>

      </div>

    </footer>
  );
}