"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, BookOpen, ArrowLeft } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { useBookmarks } from "@/store/bookmarkStore";
import Header from "../../../components/header";
import Footer from "../../../components/footer";

export default function BookmarksPage() {
    const router = useRouter();
    const { darkMode } = useTheme();
    const { user, loading: authLoading } = useAuth();
    const { bookmarks, fetchBookmarks, removeBookmark } = useBookmarks();
    const hasFetched = useRef(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }
        if (user && !hasFetched.current) {
            hasFetched.current = true;
            fetchBookmarks().finally(() => {
                setIsLoading(false);
            });
            // Timeout fallback in case fetch hangs
            const timeout = setTimeout(() => {
                setIsLoading(false);
            }, 5000);
            return () => clearTimeout(timeout);
        }
        if (!authLoading && user) {
            // If auth is done and we have user, stop loading after brief delay
            const timeout = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [user, authLoading, router, fetchBookmarks]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleRemoveBookmark = async (bookId: string) => {
        await removeBookmark(bookId);
    };

    if (authLoading || isLoading) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center ${darkMode
                    ? "bg-gradient-to-b from-gray-900 via-[#2C034A] to-[#4B1C6B] text-white"
                    : "bg-gradient-to-t from-white to-yellow-100 text-gray-900"
                    }`}
            >
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>Memuat bookmark...</p>
                </div>
            </div>
        );
    }


    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${darkMode
                ? "bg-gradient-to-b from-gray-900 via-[#2C034A] to-[#4B1C6B] text-white"
                : "bg-gradient-to-t from-white to-yellow-100 text-gray-900"
                }`}
        >
            <Header />

            <main className="container mx-auto px-4 py-8 pt-28">
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-all ${darkMode
                        ? "bg-white/10 hover:bg-white/20 text-white"
                        : "bg-white hover:bg-gray-100 text-gray-800 shadow-sm"
                        }`}
                >
                    <ArrowLeft size={18} />
                    Kembali
                </button>

                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <BookOpen size={32} />
                    Bookmark Saya
                </h1>

                {bookmarks.length === 0 ? (
                    <div
                        className={`text-center p-12 rounded-2xl ${darkMode ? "bg-white/5" : "bg-white shadow-lg"
                            }`}
                    >
                        <p className="text-6xl mb-4">📚</p>
                        <h2 className="text-2xl font-bold mb-2">Belum Ada Bookmark</h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Mulai simpan buku favorit Anda dengan mengklik ikon ❤️ pada halaman buku.
                        </p>
                        <Link
                            href="/"
                            className={`inline-block px-6 py-3 rounded-xl font-semibold ${darkMode
                                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                                : "bg-purple-700 text-white hover:bg-purple-600"
                                }`}
                        >
                            Jelajahi Buku
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {bookmarks.map((bookmark) => (
                            <div
                                key={bookmark.id}
                                className={`group relative rounded-xl overflow-hidden transition-all hover:scale-105 ${darkMode ? "bg-white/5" : "bg-white shadow-lg"
                                    }`}
                            >
                                {/* Remove button */}
                                <button
                                    onClick={() => handleRemoveBookmark(bookmark.book_id)}
                                    className="absolute top-2 right-2 z-10 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>

                                {/* Book cover */}
                                <Link href={`/book/${bookmark.book_id}`}>
                                    <div className="relative aspect-[3/4] w-full">
                                        <Image
                                            src={bookmark.book_image || "/placeholder-book.jpg"}
                                            alt={bookmark.book_title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                        />
                                    </div>

                                    {/* Book info */}
                                    <div className="p-3">
                                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                                            {bookmark.book_title}
                                        </h3>
                                        <p
                                            className={`text-xs mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"
                                                }`}
                                        >
                                            {bookmark.book_author || "Unknown Author"}
                                        </p>
                                        <p
                                            className={`font-bold text-sm ${darkMode ? "text-yellow-400" : "text-purple-700"
                                                }`}
                                        >
                                            {formatPrice(bookmark.book_price || 75000)}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
