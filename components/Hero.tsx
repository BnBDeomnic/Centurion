// components/Hero.tsx
"use client";
import React from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import { Search } from "lucide-react";
import BookCard from "./card";

export default function Hero() {
  const { darkMode } = useTheme();

  // contoh featured book (ganti gambar/nama sesuai kebutuhan)
  const featured = {
    title: "Atomic Habits",
    author: "James Clear",
    image: "/cover_buku/atomic habits.jpg",
    badge: "Best Seller",
    synopsis: "Prinsip perubahan kecil yang menghasilkan hasil luar biasa.",
  };

  return (
    <section
      aria-label="Hero"
      className={`relative w-full overflow-hidden rounded-2xl mb-8 transition-colors duration-300
        ${darkMode ? "bg-gradient-to-r from-[#130018] via-[#2C034A] to-[#3a0b4f]" : "bg-gradient-to-br from-white to-yellow-200"}`}
      style={{ padding: "28px" }}
    >
      {/* background subtle blur / pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            darkMode
              ? "radial-gradient(600px 300px at 10% 10%, rgba(255,255,255,0.03), transparent), radial-gradient(500px 250px at 90% 90%, rgba(255,255,255,0.02), transparent)"
              : "radial-gradient(600px 300px at 10% 10%, rgba(255,200,60,0.06), transparent)",
          mixBlendMode: "overlay",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8">
        {/* Left: Text + search + CTA */}
        <div className="flex-1 min-w-0">
          <p className={`mb-2 text-sm font-medium ${darkMode ? "text-yellow-300" : "text-purple-700"}`}>
            Pilihan Editor
          </p>

          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Temukan buku yang mengubah cara pandangmu.
          </h1>

          <p className={`mb-6 max-w-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Koleksi curated & rekomendasi harian — dari pengembangan diri, bisnis, sains sampai cerita untuk anak.
            Jelajahi, simpan, dan beli langsung dari toko.
          </p>

          {/* Search */}
          <div className={`flex items-center gap-3 rounded-full px-3 py-2 mb-4 transition-all duration-200
              ${darkMode ? "bg-white/6 ring-1 ring-white/8" : "bg-white shadow-sm ring-1 ring-yellow-100"}`}
            style={{ minWidth: 280, maxWidth: 720 }}
          >
            <Search size={18} className={`${darkMode ? "text-white/80" : "text-gray-600"}`} />
            <input
              type="search"
              placeholder="Cari judul, penulis, atau topik..."
              className={`flex-1 bg-transparent outline-none text-sm ${darkMode ? "text-white placeholder-gray-300" : "text-gray-800 placeholder-gray-500"}`}
              aria-label="Search books"
            />
            <button
              className={`ml-2 px-4 py-1 rounded-full text-sm font-medium transition-all duration-150
                ${darkMode ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-yellow-300 text-gray-900 hover:brightness-95"}`}
            >
              Cari
            </button>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              className={`px-5 py-2 rounded-2xl font-semibold transition-transform duration-150 ${darkMode ? "bg-yellow-400 text-black" : "bg-black text-white"}`}
            >
              Jelajahi Koleksi
            </button>

            <Link
              href="/popular"
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-transform duration-150 ${darkMode ? "bg-white/6 text-white hover:bg-white/10" : "bg-white ring-1 ring-yellow-200 text-gray-800 hover:brightness-98"}`}
            >
              Lihat Populer
            </Link>

            <span className={`ml-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              atau coba filter kategori di bawah
            </span>
          </div>
        </div>

        {/* Right: Featured book card */}
        <div className="w-full max-w-xs shrink-0">
          <div className={`p-3 rounded-2xl shadow-2xl ${darkMode ? "bg-gradient-to-b from-[#2C034A] to-[#3b0a5f]" : "bg-white"}`}>
            <div className="relative w-full h-[320px] rounded-lg overflow-hidden mb-3">
              {/* use BookCard for consistency but keep small */}
              <BookCard
                title={featured.title}
                author={featured.author}
                image={featured.image}
                badge={featured.badge}
                synopsis={featured.synopsis}
              />
            </div>

            <div className="mt-2 text-sm">
              <p className={`${darkMode ? "text-gray-200 font-semibold" : "text-gray-900 font-semibold"}`}>{featured.title}</p>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>{featured.author}</p>
            </div>

            <div className="mt-3 flex gap-2">
              <button className={`flex-1 text-sm py-2 rounded-md font-medium ${darkMode ? "bg-yellow-400 text-black" : "bg-purple-700 text-white"}`}>
                Beli Sekarang
              </button>
              <Link href="/book/atomic-habits" className={`text-sm px-3 py-2 rounded-md ${darkMode ? "bg-white/6 text-white" : "bg-white ring-1 ring-yellow-100 text-gray-800"}`}>
                Detail
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
