import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "../../context/ThemeContext";
import { AuthProvider } from "../../context/AuthContext";
import type { ReactNode } from "react";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Book Library",
  description: "Portfolio with Next.js + Tailwind v4",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="theme-hide" strategy="beforeInteractive">
          {`
  (function(){
    try{
      // hide page until theme applied
      var s = document.createElement('style');
      s.id = 'theme-hide-style';
      s.innerHTML = 'html{visibility:hidden}';
      document.head.appendChild(s);

      var d = localStorage.getItem('darkMode');
      if (d === 'true') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');

      // show page
      var el = document.getElementById('theme-hide-style');
      el && el.remove();
    }catch(e){}
  })();
`}
        </Script>
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

