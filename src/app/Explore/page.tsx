"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import BookCard from "../../../components/card";
import Swiper from "../../../components/swiper";

export default function Page() {
  
  const { darkMode } = useTheme();

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-500
        ${
          darkMode
            ? "bg-gradient-to-b from-gray-900 via-[#2C034A] to-[#4B1C6B] text-white"
            : "bg-gradient-to-t from-white to-yellow-200 text-gray-900"
        }`}
    >
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-grow px-6 md:px-8 lg:px-12 py-12 pt-28">
        <div className="container mx-auto space-y-12">
          {/* Swiper Section */}
          <div className="w-full">
            <Swiper />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <BookCard
              title="The Art of War"
              author="Sun Tzu"
              image="/books/art-of-war.jpg"
              synopsis="An ancient Chinese military treatise dating from the Late Spring and Autumn Period."
            />
            <BookCard
              title="Atomic Habits"
              author="James Clear"
              image="/books/atomic-habits.jpg"
            />
            <BookCard
              title="Meditations"
              author="Marcus Aurelius"
              image="/books/meditations.jpg"
            />
            <BookCard
              title="Sapiens"
              author="Yuval Noah Harari"
              image="/books/sapiens.jpg"
            />
            <BookCard
              title="Deep Work"
              author="Cal Newport"
              image="/books/deep-work.jpg"
            />
            <BookCard
              title="The Prince"
              author="Niccolò Machiavelli"
              image="/books/the-prince.jpg"
            />
            <BookCard
              title="Deep Work"
              author="Cal Newport"
              image="/books/deep-work.jpg"
            />
            <BookCard
              title="The Prince"
              author="Niccolò Machiavelli"
              image="/books/the-prince.jpg"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
