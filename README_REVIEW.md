# 📚 My Library - Code Review & Development Roadmap

> Review dan saran pengembangan untuk website perpustakaan buku digital.

---

## 📋 Overview Project

| Aspek | Detail |
|-------|--------|
| **Framework** | Next.js 15.5.2 + TypeScript |
| **Styling** | Tailwind CSS 4.1.13 |
| **Animasi** | Framer Motion 12.x |
| **Carousel** | Swiper 12.x |
| **Icons** | Lucide React, React Icons |

---

## ✅ Fitur yang Sudah Ada

- 🌓 **Dark/Light Mode** - Toggle tema via React Context
- 🎠 **Swiper Carousel** - Banner promosi dengan autoplay
- 🃏 **BookCard 3D Flip** - Kartu buku dengan animasi flip interaktif
- 🏷️ **Filter Kategori** - Pilihan kategori dengan animasi smooth
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Modern UI** - Gradient backgrounds, glassmorphism effects

---

## ⚠️ Area yang Perlu Ditingkatkan

| Issue | Status | Prioritas |
|-------|--------|-----------|
| Data buku hardcoded di komponen | ❌ | Tinggi |
| Search bar hanya visual (belum berfungsi) | ❌ | Tinggi |
| Routing halaman detail buku belum ada | ❌ | Sedang |
| Shopping cart belum terimplementasi | ❌ | Sedang |
| Cart badge hardcoded (angka 3) | ❌ | Rendah |

---

## 🚀 3 Saran Implementasi

### 1. 🔍 Functional Search dengan Debounced Input

Implementasi pencarian buku yang sebenarnya dengan debouncing untuk performa optimal.

#### Referensi:
- [React useDeferredValue](https://react.dev/reference/react/useDeferredValue) - Official React docs
- [Debouncing in React](https://usehooks.com/useDebounce/) - useHooks library
- [Fuse.js](https://fusejs.io/) - Lightweight fuzzy-search library

#### Contoh Implementasi:
```tsx
// lib/search.ts
import Fuse from 'fuse.js';
import { BOOKS } from '@/data/books';

const fuse = new Fuse(BOOKS, {
  keys: ['title', 'author', 'synopsis'],
  threshold: 0.3,
});

export function searchBooks(query: string) {
  if (!query.trim()) return BOOKS;
  return fuse.search(query).map(result => result.item);
}
```

```tsx
// hooks/useSearch.ts
import { useState, useDeferredValue, useMemo } from 'react';
import { searchBooks } from '@/lib/search';

export function useSearch() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  const results = useMemo(() => 
    searchBooks(deferredQuery), 
    [deferredQuery]
  );
  
  return { query, setQuery, results };
}
```

#### Instalasi:
```bash
npm install fuse.js
```

---

### 2. 📖 Dynamic Routing untuk Halaman Detail Buku

Buat halaman `/book/[slug]` untuk menampilkan detail lengkap setiap buku.

#### Referensi:
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Open Library API](https://openlibrary.org/developers/api) - Free book data API
- [Google Books API](https://developers.google.com/books) - Alternative API

#### Struktur Folder:
```
src/
└── app/
    └── book/
        └── [slug]/
            └── page.tsx
```

#### Contoh Implementasi:
```tsx
// src/app/book/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getBookBySlug, getAllBooks } from '@/lib/books';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const books = getAllBooks();
  return books.map((book) => ({ slug: book.slug }));
}

export default function BookDetailPage({ params }: Props) {
  const book = getBookBySlug(params.slug);
  
  if (!book) notFound();
  
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
          <Image src={book.image} alt={book.title} fill />
        </div>
        
        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-lg text-gray-600 mt-2">{book.author}</p>
          <p className="mt-4">{book.synopsis}</p>
          
          <div className="mt-6 flex gap-4">
            <button className="btn-primary">Beli Sekarang</button>
            <button className="btn-secondary">Tambah ke Wishlist</button>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

### 3. 🛒 Shopping Cart dengan Zustand State Management

Implementasi keranjang belanja yang persisten menggunakan Zustand.

#### Referensi:
- [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- [Zustand Persist](https://zustand.docs.pmnd.rs/integrations/persisting-store-data) - LocalStorage persistence
- [React Context + useReducer](https://react.dev/learn/scaling-up-with-reducer-and-context) - Built-in alternative

#### Instalasi:
```bash
npm install zustand
```

#### Contoh Implementasi:
```tsx
// store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  price: number;
}

interface CartItem extends Book {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (book) => set((state) => {
        const existingItem = state.items.find(item => item.id === book.id);
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === book.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        return { items: [...state.items, { ...book, quantity: 1 }] };
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id),
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
      })),
      
      clearCart: () => set({ items: [] }),
      
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      
      totalPrice: () => get().items.reduce(
        (acc, item) => acc + item.price * item.quantity, 0
      ),
    }),
    { name: 'cart-storage' }
  )
);
```

#### Penggunaan di Header:
```tsx
// components/header.tsx
import { useCart } from '@/store/cartStore';

export default function Header() {
  const totalItems = useCart((state) => state.totalItems());
  
  return (
    <button className="relative">
      <ShoppingBag size={18} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full px-1.5">
          {totalItems}
        </span>
      )}
    </button>
  );
}
```

---

## 📁 Struktur Folder yang Disarankan

```
my-liblary/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── book/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   └── explore/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── layout/       # Header, Footer, etc.
│   │   └── features/     # Feature-specific components
│   ├── lib/
│   │   ├── books.ts      # Book data & utilities
│   │   └── search.ts     # Search functionality
│   ├── store/
│   │   └── cartStore.ts  # Zustand store
│   └── data/
│       └── books.ts      # Static book data
├── context/
│   └── ThemeContext.tsx
└── public/
    └── cover_buku/
```

---

## 🔧 Quick Start untuk Implementasi

```bash
# Install dependencies tambahan
npm install fuse.js zustand

# Run development server
npm run dev
```

---

## 📚 Resources Tambahan

| Resource | Link |
|----------|------|
| Next.js Documentation | https://nextjs.org/docs |
| Tailwind CSS | https://tailwindcss.com/docs |
| Framer Motion | https://www.framer.com/motion/ |
| Zustand | https://github.com/pmndrs/zustand |
| Fuse.js | https://fusejs.io/ |
| Open Library API | https://openlibrary.org/developers/api |

---

*📅 Review Date: 2 Februari 2026*
