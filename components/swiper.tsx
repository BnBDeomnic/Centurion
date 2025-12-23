"use client";

import { Swiper as SwiperBase, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useTheme } from "../context/ThemeContext";

export default function Swiper() {
  const { darkMode } = useTheme();

  const slideBg = darkMode
    ? "bg-gradient-to-r from-purple-900 via-purple-600 to-purple-900"
    : "bg-gradient-to-r from-yellow-300 via-yellow-600 to-yellow-300";

  const slides = [
    {
      title: "Welcome to Book Library 📚",
      desc: "Explore and manage your books comfortably, day or night.",
    },
    {
      title: "Discover New Reads ✨",
      desc: "Thousands of titles waiting for you to explore.",
    },
    {
      title: "Build Your Collection 📖",
      desc: "Organize your books in one simple library.",
    },
  ];

  return (
    <div className="w-full mb-10">
      <SwiperBase
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 2000, disableOnInteraction: false }} // 2 detik
        className="w-full rounded-2xl shadow-lg"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className={`${slideBg} text-white rounded-2xl p-10 text-center transition-colors duration-300`}
            >
              <h1 className="text-3xl md:text-4xl font-bold">{slide.title}</h1>
              <p className="mt-4 text-lg">{slide.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </SwiperBase>
    </div>
  );
}
