"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, Heart, Share2 } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";
import { getBookByWorkId } from "@/lib/openLibrary";
import { useCart } from "@/store/cartStore";
import type { Book } from "@/types/book";
import Header from "../../../../components/header";
import Footer from "../../../../components/footer";

export default function BookDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { darkMode } = useTheme();
    const { addItem } = useCart();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        async function fetchBook() {
            if (typeof id !== "string") return;
            setLoading(true);
            const data = await getBookByWorkId(id);
            setBook(data);
            setLoading(false);
        }
        fetchBook();
    }, [id]);

    const handleAddToCart = () => {
        if (book) {
            addItem(book);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                    }`}
            >
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>Memuat detail buku...</p>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div
                className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                    }`}
            >
                <p className="text-xl mb-4">Buku tidak ditemukan</p>
                <button
                    onClick={() => router.back()}
                    className={`px-4 py-2 rounded-lg ${darkMode ? "bg-purple-600 text-white" : "bg-yellow-400 text-black"
                        }`}
                >
                    Kembali
                </button>
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

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Book Cover */}
                    <div className="flex justify-center">
                        <div
                            className={`relative aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl ${darkMode ? "ring-1 ring-white/10" : "ring-1 ring-gray-200"
                                }`}
                        >
                            <Image
                                src={book.image}
                                alt={book.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 400px"
                                priority
                            />
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="flex flex-col">
                        {/* Categories */}
                        {book.categories && book.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {book.categories.slice(0, 3).map((cat, idx) => (
                                    <span
                                        key={idx}
                                        className={`px-3 py-1 text-xs rounded-full ${darkMode
                                                ? "bg-purple-600/30 text-purple-200"
                                                : "bg-yellow-200 text-yellow-800"
                                            }`}
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            {book.title}
                        </h1>
                        <p
                            className={`text-lg mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                        >
                            oleh <span className="font-medium">{book.author}</span>
                        </p>

                        {/* Price */}
                        <div
                            className={`text-3xl font-bold mb-6 ${darkMode ? "text-yellow-400" : "text-purple-700"
                                }`}
                        >
                            {formatPrice(book.price || 75000)}
                        </div>

                        {/* Synopsis */}
                        <div className="mb-8">
                            <h3
                                className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                Sinopsis
                            </h3>
                            <p
                                className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"
                                    }`}
                            >
                                {book.synopsis}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-auto">
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${added
                                        ? "bg-green-500 text-white"
                                        : darkMode
                                            ? "bg-yellow-400 text-black hover:bg-yellow-300"
                                            : "bg-purple-700 text-white hover:bg-purple-600"
                                    }`}
                            >
                                <ShoppingCart size={20} />
                                {added ? "Ditambahkan!" : "Tambah ke Keranjang"}
                            </button>

                            <button
                                className={`p-3 rounded-xl transition-all ${darkMode
                                        ? "bg-white/10 text-white hover:bg-white/20"
                                        : "bg-white text-gray-800 hover:bg-gray-100 shadow-sm"
                                    }`}
                            >
                                <Heart size={20} />
                            </button>

                            <button
                                className={`p-3 rounded-xl transition-all ${darkMode
                                        ? "bg-white/10 text-white hover:bg-white/20"
                                        : "bg-white text-gray-800 hover:bg-gray-100 shadow-sm"
                                    }`}
                            >
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Buy Now */}
                        <button
                            onClick={() => {
                                handleAddToCart();
                                router.push("/checkout");
                            }}
                            className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all ${darkMode
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                                    : "bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:opacity-90"
                                }`}
                        >
                            Beli Sekarang
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
