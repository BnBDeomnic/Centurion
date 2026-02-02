"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { searchBooks, getBooksBySubject } from "@/lib/openLibrary";
import { Book } from "@/types/book";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import BookCard from "../../../components/card";

// Categories to display
const CATEGORIES = [
  { key: "fiction", label: "Fiction", emoji: "📖" },
  { key: "science", label: "Science", emoji: "🔬" },
  { key: "history", label: "History", emoji: "🏛️" },
  { key: "philosophy", label: "Philosophy", emoji: "🧠" },
  { key: "biography", label: "Biography", emoji: "👤" },
  { key: "technology", label: "Technology", emoji: "💻" },
];

// Quick search tags
const QUICK_TAGS = ["Fiction", "Science", "History", "Self-Help", "Business", "Fantasy"];

// Book Carousel Component
function BookCarousel({
  title,
  emoji,
  books,
  loading,
  darkMode
}: {
  title: string;
  emoji: string;
  books: Book[];
  loading: boolean;
  darkMode: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
          <span>{emoji}</span> {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className={`p-2 rounded-full transition-all ${darkMode ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`p-2 rounded-full transition-all ${darkMode ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {loading ? (
          // Skeleton Loading
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-48 aspect-[3/4] rounded-xl animate-pulse ${darkMode ? "bg-white/10" : "bg-gray-200"
                }`}
            />
          ))
        ) : books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="flex-shrink-0 w-48">
              <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                image={book.coverUrl || "/cover_buku/default.jpg"}
                synopsis={book.description}
                price={book.price}
              />
            </div>
          ))
        ) : (
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No books found for this category
          </p>
        )}
      </div>
    </section>
  );
}

export default function ExplorePage() {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Category books state
  const [categoryBooks, setCategoryBooks] = useState<Record<string, Book[]>>({});
  const [categoryLoading, setCategoryLoading] = useState<Record<string, boolean>>({});

  // Fetch books for each category on mount
  useEffect(() => {
    CATEGORIES.forEach(async (category) => {
      setCategoryLoading(prev => ({ ...prev, [category.key]: true }));
      try {
        const books = await getBooksBySubject(category.key, 12);
        setCategoryBooks(prev => ({ ...prev, [category.key]: books }));
      } catch (error) {
        console.error(`Error fetching ${category.key}:`, error);
        setCategoryBooks(prev => ({ ...prev, [category.key]: [] }));
      } finally {
        setCategoryLoading(prev => ({ ...prev, [category.key]: false }));
      }
    });
  }, []);

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(true);
    try {
      const results = await searchBooks(searchQuery, 20);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle quick tag click
  const handleTagClick = async (tag: string) => {
    setSearchQuery(tag);
    setIsSearching(true);
    setShowResults(true);
    try {
      const results = await searchBooks(tag, 20);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-500 ${darkMode
        ? "bg-gradient-to-b from-gray-900 via-[#2C034A] to-[#4B1C6B] text-white"
        : "bg-gradient-to-t from-white to-yellow-100 text-gray-900"
        }`}
    >
      <Header />

      <main className="flex-grow px-4 md:px-8 lg:px-12 py-8 pt-28">
        <div className="container mx-auto max-w-7xl">

          {/* Hero Search Section */}
          <section className={`rounded-3xl p-8 md:p-12 mb-12 ${darkMode
            ? "bg-gradient-to-r from-purple-900/50 to-pink-900/30 border border-purple-500/20"
            : "bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200"
            }`}>
            <div className="text-center max-w-2xl mx-auto">
              <h1 className={`text-3xl md:text-4xl font-extrabold mb-4 ${darkMode ? "text-white" : "text-gray-900"
                }`}>
                🔍 Temukan Buku Favoritmu
              </h1>
              <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Jelajahi ribuan buku dari berbagai kategori
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl ${darkMode ? "bg-white/10 border border-white/10" : "bg-white border border-gray-200 shadow-sm"
                  }`}>
                  <Search size={20} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari judul, penulis, atau topik..."
                    className={`flex-1 bg-transparent outline-none ${darkMode ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"
                      }`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className={`text-sm px-2 py-1 rounded ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode
                    ? "bg-yellow-400 text-black hover:bg-yellow-300"
                    : "bg-purple-700 text-white hover:bg-purple-600"
                    }`}
                >
                  {isSearching ? <Loader2 className="animate-spin" size={20} /> : "Cari"}
                </button>
              </form>

              {/* Quick Tags */}
              <div className="flex flex-wrap justify-center gap-2">
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Popular:
                </span>
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`text-sm px-3 py-1 rounded-full transition-all ${darkMode
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Search Results */}
          {showResults && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  🔎 Hasil Pencarian: &quot;{searchQuery}&quot;
                </h2>
                <button
                  onClick={clearSearch}
                  className={`text-sm px-4 py-2 rounded-lg ${darkMode ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  Tutup Pencarian
                </button>
              </div>

              {isSearching ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-[3/4] rounded-xl animate-pulse ${darkMode ? "bg-white/10" : "bg-gray-200"
                        }`}
                    />
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {searchResults.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      image={book.coverUrl || "/cover_buku/default.jpg"}
                      synopsis={book.description}
                      price={book.price}
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 rounded-xl ${darkMode ? "bg-white/5" : "bg-gray-50"
                  }`}>
                  <p className="text-4xl mb-4">📚</p>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    Tidak ada buku ditemukan untuk &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Category Carousels */}
          {!showResults && (
            <>
              {CATEGORIES.map((category) => (
                <BookCarousel
                  key={category.key}
                  title={category.label}
                  emoji={category.emoji}
                  books={categoryBooks[category.key] || []}
                  loading={categoryLoading[category.key] || false}
                  darkMode={darkMode}
                />
              ))}
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
