# 📚 Centurion - Digital Book Library

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)

**A modern, beautiful digital book library with bookmark functionality and Open Library API integration.**

[Live Demo](https://centurion-wt8v.vercel.app) • [Features](#features) • [Getting Started](#getting-started)

</div>

---

## ✨ Features

### 📖 Book Discovery
- Browse trending and popular books
- Search books by title, author, or topic
- Filter by categories (Fiction, Science, History, etc.)
- Real-time data from **Open Library API**

### ❤️ Bookmarking
- Save favorite books to your personal collection
- Synced across devices with **Supabase**
- Beautiful heart animation on bookmark
- View all bookmarks in dedicated page

### 🎨 Modern UI/UX
- **Dark/Light mode** with smooth transitions
- Fully **responsive** design (mobile, tablet, desktop)
- Glassmorphism effects and gradients
- Animated book card flip effect
- Mobile hamburger menu

### 🔐 Authentication
- User registration and login
- Secure authentication with **Supabase Auth**
- Protected routes for authenticated users

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Auth & DB | Supabase |
| API | Open Library API |
| Icons | Lucide React, React Icons |
| State | Zustand |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BnBDeomnic/Centurion.git
   cd Centurion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   
   Create a `bookmarks` table in Supabase:
   ```sql
   CREATE TABLE bookmarks (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     book_id TEXT NOT NULL,
     title TEXT NOT NULL,
     author TEXT,
     image TEXT,
     price NUMERIC,
     synopsis TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, book_id)
   );
   
   -- Enable RLS
   ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
   
   -- Policy: Users can only access their own bookmarks
   CREATE POLICY "Users can manage own bookmarks" ON bookmarks
     FOR ALL USING (auth.uid() = user_id);
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
├── src/app/              # Next.js App Router pages
│   ├── page.tsx          # Home page
│   ├── Explore/          # Explore books page
│   ├── book/[id]/        # Book detail page
│   ├── bookmarks/        # User bookmarks
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/           # Reusable UI components
│   ├── header.tsx        # Navigation header
│   ├── card.tsx          # Book card component
│   ├── Categories.tsx    # Category filter
│   └── Popular.tsx       # Popular books section
├── context/              # React contexts
│   ├── ThemeContext.tsx  # Dark/Light mode
│   └── AuthContext.tsx   # Authentication state
├── store/                # Zustand stores
│   ├── bookmarkStore.ts  # Bookmark management
│   └── cartStore.ts      # Shopping cart
├── lib/                  # Utilities
│   ├── supabase.ts       # Supabase client
│   └── openLibrary.ts    # Open Library API
└── types/                # TypeScript types
```

---

## 🌐 Deployment

This project is deployed on **Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BnBDeomnic/Centurion)

> ⚠️ Remember to add environment variables in Vercel Dashboard → Settings → Environment Variables

---

## 📸 Screenshots

| Light Mode | Dark Mode |
|------------|-----------|
| Home page with categories | Explore page with search |
| Book detail with bookmark | Mobile responsive view |

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

Made with ❤️ by **Centurion Team**

</div>
