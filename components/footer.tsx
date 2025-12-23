"use client";
import { useTheme } from "../context/ThemeContext";
// Impor ikon dari react-icons
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const { darkMode } = useTheme();

  // Objek untuk styling dinamis
  const themeClasses = {
    bg: darkMode
      ? "bg-gradient-to-t from-[#2C034A] via-[#3B0A5F] to-[#1A022B] shadow-[0_-4px_12px_rgba(0,0,0,0.5)]"
      : "bg-gradient-to-t from-yellow-300 via-yellow-200 to-white shadow-[0_-4px_12px_rgba(0,0,0,0.1)]",
    text: darkMode ? "text-gray-200" : "text-gray-800",
    textMuted: darkMode ? "text-gray-400" : "text-gray-600",
    hoverText: darkMode ? "hover:text-yellow-300" : "hover:text-purple-800",
    waveFill: darkMode ? "fill-[#2C034A]" : "fill-yellow-200",
    borderColor: darkMode ? "border-gray-700" : "border-yellow-400",
  };

  return (
    <footer
      className={`relative w-full transition-colors duration-300 ${themeClasses.bg} ${themeClasses.text}`}
    >
      {/* SVG Wave Separator */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] md:h-[90px]"
          style={{ transform: "translateY(-1px)" }}
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,23.5V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className={`transition-colors duration-300 ${themeClasses.waveFill}`}
          ></path>
        </svg>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-8 md:pt-32">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          {/* Kolom 1: Brand & Tagline */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold tracking-wide mb-2">Centurion</h3>
            <p className={`text-sm ${themeClasses.textMuted}`}>
              Your partner in digital innovation and excellence.
            </p>
          </div>

          {/* Kolom 2: Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className={`${themeClasses.hoverText} transition-transform duration-200 inline-block hover:-translate-y-px`}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${themeClasses.hoverText} transition-transform duration-200 inline-block hover:-translate-y-px`}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${themeClasses.hoverText} transition-transform duration-200 inline-block hover:-translate-y-px`}
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${themeClasses.hoverText} transition-transform duration-200 inline-block hover:-translate-y-px`}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Legal */}
          <div>
            <h4 className="font-semibold mb-3 tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className={`${themeClasses.hoverText} transition-transform duration-200 inline-block hover:-translate-y-px`}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${themeClasses.hoverText} transition-transform duration-200 inline-block hover:-translate-y-px`}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Social Media */}
          <div>
            <h4 className="font-semibold mb-4 tracking-wider">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-5">
              <a
                href="#"
                aria-label="Twitter"
                className={`${themeClasses.hoverText} transition-transform duration-200 hover:scale-125`}
              >
                <FaTwitter size={22} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className={`${themeClasses.hoverText} transition-transform duration-200 hover:scale-125`}
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className={`${themeClasses.hoverText} transition-transform duration-200 hover:scale-125`}
              >
                <FaGithub size={22} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className={`${themeClasses.hoverText} transition-transform duration-200 hover:scale-125`}
              >
                <FaLinkedin size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Separator dan Copyright */}
        <div className={`pt-6 mt-8 border-t ${themeClasses.borderColor}`}>
          <p className={`text-center text-xs ${themeClasses.textMuted}`}>
            © 2025 Centurion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
