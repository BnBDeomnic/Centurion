// components/Categories.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import BookCard from "./card";
import { motion } from "framer-motion";
import { getBooksBySubject } from "@/lib/openLibrary";
import type { Book } from "@/types/book";

type Category = { id: string; label: string; icon?: string; subject: string };

const CATEGORIES: Category[] = [
  { id: "all", label: "Semua", icon: "📚", subject: "bestseller" },
  { id: "fiction", label: "Fiksi", icon: "📖", subject: "fiction" },
  { id: "nonfiction", label: "Non-Fiksi", icon: "📚", subject: "nonfiction" },
  { id: "sci", label: "Sains", icon: "🔬", subject: "science" },
  { id: "business", label: "Bisnis", icon: "💼", subject: "business" },
  { id: "self", label: "Pengembangan Diri", icon: "🌱", subject: "self_help" },
  { id: "kids", label: "Anak", icon: "🧸", subject: "children" },
];

export default function Categories() {
  const { darkMode } = useTheme();
  const [selected, setSelected] = useState<string>("all");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch books when category changes
  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      const category = CATEGORIES.find((c) => c.id === selected);
      const subject = category?.subject || "bestseller";

      try {
        const data = await getBooksBySubject(subject, 8);
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
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
            {loading ? (
              "Memuat..."
            ) : (
              <>
                Menampilkan <span className="font-semibold">{books.length}</span> buku{" "}
                {selected !== "all" && (
                  <>
                    untuk kategori <span className="font-semibold">{CATEGORIES.find(c => c.id === selected)?.label}</span>
                  </>
                )}
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton loading
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-[3/4] rounded-xl animate-pulse ${darkMode ? "bg-white/10" : "bg-gray-200"}`}
              />
            ))
          ) : books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="w-full">
                <BookCard
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  image={book.image || book.coverUrl || "/cover_buku/default.jpg"}
                  synopsis={book.synopsis || book.description}
                  price={book.price}
                />
              </div>
            ))
          ) : (
            <div className={`col-span-full p-6 rounded-lg ${darkMode ? "bg-white/4 text-white/90" : "bg-white text-gray-700"}`}>
              Tidak ada buku pada kategori ini.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

