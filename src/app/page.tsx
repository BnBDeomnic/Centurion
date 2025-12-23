"use client";

import { useTheme } from "../../context/ThemeContext";
import Hero from "../../components/Hero";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Swiper from "../../components/swiper";
import Categories from "../../components/Categories";
import PopularBooks from "../../components/Popular";

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
      <Header />
      <main className="flex-grow px-6 md:px-8 lg:px-12 py-12 pt-28">
        <div className="container mx-auto space-y-12">
          <div className="w-full">
            <Swiper />
          </div>
          <div className="container mx-auto space-y-12">
            <Hero />
          </div>
          {/* KATEGORI */}
          <div className="w-full">
            <Categories />
          </div>

          {/* POPULER */}
          <div className="w-full">
            <PopularBooks />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
