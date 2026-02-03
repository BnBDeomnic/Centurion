"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import BookCard from "./card";
import { getBooksBySubject } from "@/lib/openLibrary";
import type { Book } from "@/types/book";

export default function PopularBooks() {
  const { darkMode } = useTheme();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const data = await getBooksBySubject("popular", 8);
        setBooks(data);
      } catch (error) {
        console.error("Error fetching popular books:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPopular();
  }, []);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
          📚 Buku Populer
        </h3>
        <a
          href="/Explore"
          className={`text-sm font-medium px-3 py-1 rounded-md transition-all duration-150 ${darkMode ? "bg-white/6 text-white hover:bg-white/10" : "bg-white border border-yellow-300 text-gray-800 hover:brightness-95"
            }`}
        >
          Lihat semua
        </a>
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
          books.slice(0, 4).map((book) => (
            <div key={book.id} className="w-full">
              <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                image={book.image || book.coverUrl || "/cover_buku/default.jpg"}
                badge="Populer"
                synopsis={book.synopsis || book.description}
                price={book.price}
              />
            </div>
          ))
        ) : (
          <div className={`col-span-full text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Tidak dapat memuat buku populer
          </div>
        )}
      </div>
    </section>
  );
}

