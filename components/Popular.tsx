"use client";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import BookCard from "./card";

type Book = {
  id: string;
  title: string;
  author: string;
  image: string;
  badge?: string;
  synopsis?: string;
};

const popular: Book[] = [
  {
    id: "b1",
    title: "Atomic Habits",
    author: "James Clear",
    image: "/cover_buku/atomic habits.jpg",
    badge: "Best Seller",
    synopsis:
      "Prinsip perubahan kecil yang menghasilkan hasil luar biasa.",
  },
  {
    id: "b2",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    image: "/cover_buku/sapiens.jpg",
    badge: "Top Pick",
    synopsis: "Sejarah singkat umat manusia dari masa ke masa.",
  },
  {
    id: "b3",
    title: "The Lean Startup",
    author: "Eric Ries",
    image: "/cover_buku/The_Lean_Startup.jpg",
    badge: "Populer",
    synopsis: "Metode validasi produk dan startup yang efisien.",
  },
  {
    id: "b4",
    title: "Deep Work",
    author: "Cal Newport",
    image: "/cover_buku/deepwork.jpg",
    badge: "Recommended",
    synopsis: "Cara kerja fokus dalam era distraksi.",
  },
];

export default function PopularBooks() {
  const { darkMode } = useTheme();

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Buku Populer
        </h3>
        <a
          href="/popular"
          className={`text-sm font-medium px-3 py-1 rounded-md transition-all duration-150 ${
            darkMode ? "bg-white/6 text-white hover:bg-white/10" : "bg-white border border-yellow-300 text-gray-800 hover:brightness-95"
          }`}
        >
          Lihat semua
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {popular.map((b) => (
          <div key={b.id} className="w-full">
            <BookCard
              title={b.title}
              author={b.author}
              image={b.image}
              badge={b.badge}
              synopsis={b.synopsis}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
