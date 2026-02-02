// Header.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, User, Search, ShoppingBag } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "@/store/cartStore";

export default function Header() {
  const { darkMode, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { getTotalItems } = useCart();
  const [cartCount, setCartCount] = useState(0);

  // Hydration-safe cart count
  useEffect(() => {
    setCartCount(getTotalItems());
  }, [getTotalItems]);

  // Subscribe to cart changes
  useEffect(() => {
    const unsubscribe = useCart.subscribe(() => {
      setCartCount(useCart.getState().getTotalItems());
    });
    return unsubscribe;
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/Explore" },
    { name: "Bookmark", href: "/Bookmark" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl rounded-2xl z-50
                  transition-all duration-300 border backdrop-blur-xl backdrop-saturate-150
                  ${darkMode ? "bg-black/30 border-purple-600/20 shadow-lg" : "bg-white/30 border-yellow-300/20 shadow-lg"}`}
      style={{ padding: "0.5rem 1.25rem" }}
    >
      <div className="flex items-center gap-4">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 relative rounded-full overflow-hidden ring-1 ring-white/20">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" />
          </div>
          <span className={`${darkMode ? "text-white" : "text-gray-900"} font-semibold hidden sm:inline`}>Centurion</span>
        </div>

        {/* CENTER: nav + search */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-8">
            <nav className="hidden sm:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200
                      ${isActive(link.href)
                      ? darkMode ? "text-yellow-400" : "text-purple-700"
                      : darkMode ? "text-white/90 hover:text-white" : "text-gray-800 hover:text-gray-900"}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className={`flex items-center rounded-full px-3 py-1 border transition-all duration-200
                             ${darkMode ? "bg-white/6 border-white/10" : "bg-white/70 border-gray-200"}`}
              style={{ minWidth: 240, maxWidth: 420 }}>
              <Search size={16} className={`${darkMode ? "text-white/90" : "text-gray-600"} mr-2`} />
              <input
                type="text"
                placeholder="Search..."
                className={`w-full bg-transparent outline-none text-sm ${darkMode ? "text-white placeholder-gray-300" : "text-gray-800 placeholder-gray-500"}`}
                aria-label="Search"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-transform duration-200 hover:scale-110 ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-200/60"}`}
          >
            {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-purple-700" />}
          </button>

          <button
            aria-label="Cart"
            onClick={() => router.push("/checkout")}
            className={`relative p-2 rounded-lg transition-transform duration-200 hover:scale-110 ${darkMode ? "text-white hover:bg-white/10" : "text-black hover:bg-gray-200/60"}`}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-yellow-400 text-black">
                {cartCount}
              </span>
            )}
          </button>

          <button
            aria-label="User profile"
            onClick={() => router.push("/profile")}
            className={`p-2 rounded-lg transition-transform duration-200 hover:scale-110 ${darkMode ? "text-white hover:bg-white/10" : "text-black hover:bg-gray-200/60"}`}
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
