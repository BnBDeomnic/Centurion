"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";

export default function NotFound() {
    const router = useRouter();
    const { darkMode } = useTheme();

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center px-4 ${darkMode
                ? "bg-gradient-to-b from-gray-900 via-[#2C034A] to-[#4B1C6B] text-white"
                : "bg-gradient-to-t from-white to-yellow-100 text-gray-900"
                }`}
        >
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className={`text-xl mb-8 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Halaman tidak ditemukan
            </p>
            <button
                onClick={() => router.push("/")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode
                    ? "bg-yellow-400 text-black hover:bg-yellow-300"
                    : "bg-purple-700 text-white hover:bg-purple-600"
                    }`}
            >
                Kembali ke Beranda
            </button>
        </div>
    );
}
