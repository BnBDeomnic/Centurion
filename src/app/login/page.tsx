"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { darkMode } = useTheme();
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error: signInError } = await signIn(email, password);

        if (signInError) {
            setError(signInError.message);
            setLoading(false);
            return;
        }

        router.push("/");
    };

    return (
        <div
            className={`min-h-screen flex items-center justify-center px-4 ${darkMode
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
                    <h1 className="text-3xl font-bold mb-2">Masuk</h1>
                    <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                        Selamat datang kembali! Silakan masuk ke akun Anda.
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
                                placeholder="••••••••"
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

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-semibold transition-all ${loading
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                            } ${darkMode
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                                : "bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:opacity-90"
                            }`}
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                {/* Register link */}
                <p className={`text-center mt-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Belum punya akun?{" "}
                    <Link
                        href="/register"
                        className={`font-semibold ${darkMode ? "text-yellow-400 hover:text-yellow-300" : "text-purple-700 hover:text-purple-600"
                            }`}
                    >
                        Daftar
                    </Link>
                </p>
            </div>
        </div>
    );
}
