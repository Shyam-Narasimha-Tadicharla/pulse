import { LogOut } from "lucide-react";

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <header className="border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-white font-bold text-lg tracking-tight">
            pulse<span className="text-orange-500">.</span>
          </span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </header>
  );
}
