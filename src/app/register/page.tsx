"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";

export default function RegisterPage() {
    const router = useRouter();
    const { darkMode } = useTheme();
    const { signUp } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Password tidak cocok");
            return;
        }

        if (password.length < 6) {
            setError("Password minimal 6 karakter");
            return;
        }

        setLoading(true);

        const { error: signUpError } = await signUp(email, password, name);

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center px-4 ${darkMode
                    ? "bg-gradient-to-b from-gray-900 via-[#2C034A] to-[#4B1C6B] text-white"
                    : "bg-gradient-to-t from-white to-yellow-100 text-gray-900"
                    }`}
            >
                <div
                    className={`w-full max-w-md p-8 rounded-2xl text-center ${darkMode ? "bg-white/10 backdrop-blur-sm" : "bg-white shadow-xl"
                        }`}
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-3xl text-white">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Pendaftaran Berhasil!</h2>
                    <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Silakan cek email Anda untuk verifikasi akun, lalu login.
                    </p>
                    <Link
                        href="/login"
                        className={`inline-block px-6 py-3 rounded-xl font-semibold ${darkMode
                            ? "bg-yellow-400 text-black hover:bg-yellow-300"
                            : "bg-purple-700 text-white hover:bg-purple-600"
                            }`}
                    >
                        Ke Halaman Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen flex items-center justify-center px-4 py-8 ${darkMode
                ? "bg-gradient-to-b from-gray-900 via-[#2C034A] to-[#4B1C6B] text-white"
                : "bg-gradient-to-t from-white to-yellow-100 text-gray-900"
                }`}
        >
            <div
                className={`w-full max-w-md p-8 rounded-2xl ${darkMode ? "bg-white/10 backdrop-blur-sm" : "bg-white shadow-xl"
                    }`}
            >
                {/* Back button */}
                <button
                    onClick={() => router.push("/")}
                    className={`flex items-center gap-2 mb-6 text-sm ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    <ArrowLeft size={16} />
                    Kembali
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Daftar</h1>
                    <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                        Buat akun baru untuk mulai menyimpan bookmark.
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Nama</label>
                        <div className="relative">
                            <User
                                size={18}
                                className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nama lengkap"
                                required
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${darkMode
                                    ? "bg-white/5 border-white/10 focus:border-purple-500"
                                    : "bg-gray-50 border-gray-200 focus:border-purple-500"
                                    } outline-none`}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <Mail
                                size={18}
                                className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@email.com"
                                required
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${darkMode
                                    ? "bg-white/5 border-white/10 focus:border-purple-500"
                                    : "bg-gray-50 border-gray-200 focus:border-purple-500"
                                    } outline-none`}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <Lock
                                size={18}
                                className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimal 6 karakter"
                                required
                                className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all ${darkMode
                                    ? "bg-white/5 border-white/10 focus:border-purple-500"
                                    : "bg-gray-50 border-gray-200 focus:border-purple-500"
                                    } outline-none`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Konfirmasi Password</label>
                        <div className="relative">
                            <Lock
                                size={18}
                                className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Ulangi password"
                                required
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${darkMode
                                    ? "bg-white/5 border-white/10 focus:border-purple-500"
                                    : "bg-gray-50 border-gray-200 focus:border-purple-500"
                                    } outline-none`}
                            />
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-semibold transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""
                            } ${darkMode
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                                : "bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:opacity-90"
                            }`}
                    >
                        {loading ? "Memproses..." : "Daftar"}
                    </button>
                </form>

                {/* Login link */}
                <p className={`text-center mt-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Sudah punya akun?{" "}
                    <Link
                        href="/login"
                        className={`font-semibold ${darkMode ? "text-yellow-400 hover:text-yellow-300" : "text-purple-700 hover:text-purple-600"
                            }`}
                    >
                        Masuk
                    </Link>
                </p>
            </div>
        </div>
    );
}
