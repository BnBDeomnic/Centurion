"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "@/store/cartStore";

type BookCardProps = {
  id?: string;
  title: string;
  author: string;
  image: string;
  badge?: string;
  synopsis?: string;
  price?: number;
};

export default function BookCard({
  id,
  title,
  author,
  image,
  badge,
  synopsis,
  price = 75000,
}: BookCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [added, setAdded] = useState(false);
  const { darkMode } = useTheme();
  const { addItem } = useCart();
  const router = useRouter();

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: id || title.toLowerCase().replace(/\s/g, "-"),
      title,
      author,
      image,
      price,
      synopsis,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleViewDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      router.push(`/book/${id}`);
    }
  };

  return (
    <motion.div
      className="relative w-full aspect-[3/4] cursor-pointer"
      onClick={() => setFlipped(!flipped)}
      style={{ perspective: 1000 }}
    >
      {/* Card wrapper */}
      <motion.div
        className="relative w-full h-full rounded-lg shadow-lg"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front (cover) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden rounded-lg shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
          <div
            className={`absolute inset-0 ${darkMode
                ? "bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                : "bg-gradient-to-t from-white/70 via-white/30 to-transparent"
              }`}
          ></div>

          {badge && (
            <div
              className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded ${darkMode ? "bg-purple-600 text-white" : "bg-orange-500 text-white"
                }`}
            >
              {badge}
            </div>
          )}

          <div className="absolute bottom-12 left-3 right-3">
            <h3
              className={`font-bold text-base drop-shadow-md ${darkMode ? "text-white" : "text-gray-900"
                }`}
            >
              {title}
            </h3>
            <p className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {author}
            </p>
          </div>

          <div className="absolute bottom-2 left-3 right-3 flex gap-2">
            <button
              onClick={handleBuy}
              className={`flex-1 text-xs py-1 rounded transition-all ${added
                  ? "bg-green-500 text-white"
                  : darkMode
                    ? "bg-purple-600 text-white hover:brightness-110"
                    : "bg-orange-500 text-white hover:brightness-110"
                }`}
            >
              {added ? "✓ Added" : "Beli"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(true);
              }}
              className={`flex-1 text-xs py-1 rounded hover:brightness-95 ${darkMode ? "bg-white/10 text-white" : "bg-white/90 text-gray-900"
                }`}
            >
              Info
            </button>
          </div>
        </div>

        {/* Back (sinopsis) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-lg p-4 flex flex-col justify-center items-center shadow-lg ${darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-700"
            }`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <p className="text-sm mb-4">{synopsis ?? "Tidak ada sinopsis tersedia untuk buku ini."}</p>
            <div className="flex gap-2 justify-center">
              {id && (
                <button
                  onClick={handleViewDetail}
                  className={`px-4 py-2 text-sm rounded hover:brightness-95 ${darkMode ? "bg-purple-600 text-white" : "bg-orange-500 text-white"
                    }`}
                >
                  Lihat Detail
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(false);
                }}
                className={`px-4 py-2 text-sm rounded hover:brightness-95 ${darkMode ? "bg-gray-800" : "bg-gray-200"
                  }`}
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
