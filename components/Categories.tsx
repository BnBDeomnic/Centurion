// components/Categories.tsx
"use client";
import React, { useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import BookCard from "./card";
import { motion } from "framer-motion";

type Category = { id: string; label: string; icon?: string };
type Book = {
  id: string;
  title: string;
  author: string;
  image: string;
  badge?: string;
  synopsis?: string;
  categories: string[]; // list kategori book belongs to
};

const CATEGORIES: Category[] = [
  { id: "all", label: "Semua", icon: "📚" },
  { id: "fiction", label: "Fiksi", icon: "📖" },
  { id: "nonfiction", label: "Non-Fiksi", icon: "📚" },
  { id: "sci", label: "Sains", icon: "🔬" },
  { id: "business", label: "Bisnis", icon: "💼" },
  { id: "self", label: "Pengembangan Diri", icon: "🌱" },
  { id: "kids", label: "Anak", icon: "🧸" },
];

// contoh data buku (ganti path image sesuai /public/books/* atau URL)
const BOOKS: Book[] = [
  {
    id: "b1",
    title: "Atomic Habits",
    author: "James Clear",
    image: "/cover_buku/atomic habits.jpg",
    badge: "Best Seller",
    synopsis: "Prinsip perubahan kecil yang menghasilkan hasil luar biasa.",
    categories: ["self", "business"],
  },
  {
    id: "b2",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    image: "/cover_buku/sapiens.jpg",
    badge: "Top Pick",
    synopsis: "Sejarah singkat umat manusia dari masa ke masa.",
    categories: ["nonfiction", "sci"],
  },
  {
    id: "b3",
    title: "The Lean Startup",
    author: "Eric Ries",
    image: "/cover_buku/The_Lean_Startup.jpg",
    badge: "Populer",
    synopsis: "Metode validasi produk dan startup yang efisien.",
    categories: ["business", "nonfiction"],
  },
  {
    id: "b4",
    title: "Deep Work",
    author: "Cal Newport",
    image: "/cover_buku/deepwork.jpg",
    badge: "Recommended",
    synopsis: "Cara kerja fokus dalam era distraksi.",
    categories: ["self", "nonfiction"],
  },
  {
    id: "b5",
    title: "Harry Potter",
    author: "J.K. Rowling",
    image: "/cover_buku/harrypotter.jpg",
    badge: "Favorit",
    synopsis: "Petualangan si penyihir muda di Hogwarts.",
    categories: ["fiction", "kids"],
  },
  {
    id: "b6",
    title: "Little Explorers",
    author: "A. Penulis",
    image: "/cover_buku/littleexplorer.jpg",
    badge: "Anak",
    synopsis: "Buku edukatif untuk anak usia dini.",
    categories: ["kids", "nonfiction"],
  },
];

export default function Categories() {
  const { darkMode } = useTheme();
  const [selected, setSelected] = useState<string>("all");

  // filter buku berdasarkan kategori yang dipilih
  const filtered = useMemo(() => {
    if (selected === "all") return BOOKS;
    return BOOKS.filter((b) => b.categories.includes(selected));
  }, [selected]);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Kategori
        </h3>
      </div>

      {/* pills kategori horizontal */}
      <div className="flex gap-3 overflow-x-auto pb-3 -mx-1">
        {CATEGORIES.map((c) => {
          const active = c.id === selected;
          return (
            <motion.button
              key={c.id}
              onClick={() => setSelected(c.id)}
              whileTap={{ scale: 0.98 }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm transition-all duration-150 focus:outline-none
                ${active
                  ? darkMode
                    ? "bg-purple-600 text-white ring-1 ring-purple-400/30"
                    : "bg-yellow-300 text-gray-900 ring-1 ring-yellow-400/40"
                  : darkMode
                  ? "bg-white/4 text-white/90 ring-1 ring-white/6 hover:bg-white/6"
                  : "bg-white text-gray-800 ring-1 ring-yellow-100 hover:brightness-98"
                }`}
              aria-pressed={active}
              aria-label={`Filter ${c.label}`}
            >
              <span className="text-sm">{c.icon}</span>
              <span className="text-sm font-medium">{c.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* hasil filter: jumlah dan grid */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Menampilkan <span className="font-semibold">{filtered.length}</span> buku{" "}
            {selected !== "all" && (
              <>
                untuk kategori <span className="font-semibold">{CATEGORIES.find(c => c.id === selected)?.label}</span>
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filtered.map((b) => (
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

          {filtered.length === 0 && (
            <div className={`col-span-full p-6 rounded-lg ${darkMode ? "bg-white/4 text-white/90" : "bg-white text-gray-700"}`}>
              Tidak ada buku pada kategori ini.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
