"use client";

import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");

      toast.success("Logged out successfully");

      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-900">
          Ticketing
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-black transition">
            Home
          </Link>

          <Link
            href="/profile"
            className="text-gray-600 hover:text-black transition"
          >
            Profile
          </Link>

          <Link
            href="/login"
            className="text-gray-600 hover:text-black transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="text-gray-600 hover:text-black transition"
          >
            Register
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
