"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book, CartItem } from "@/types/book";

interface CartStore {
    items: CartItem[];
    addItem: (book: Book) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (book: Book) =>
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === book.id);

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === book.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }

                    return {
                        items: [
                            ...state.items,
                            { ...book, quantity: 1, price: book.price || 75000 },
                        ],
                    };
                }),

            removeItem: (id: string) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),

            updateQuantity: (id: string, quantity: number) =>
                set((state) => ({
                    items:
                        quantity <= 0
                            ? state.items.filter((item) => item.id !== id)
                            : state.items.map((item) =>
                                item.id === id ? { ...item, quantity } : item
                            ),
                })),

            clearCart: () => set({ items: [] }),

            getTotalItems: () =>
                get().items.reduce((acc, item) => acc + item.quantity, 0),

            getTotalPrice: () =>
                get().items.reduce(
                    (acc, item) => acc + (item.price || 0) * item.quantity,
                    0
                ),
        }),
        {
            name: "cart-storage",
        }
    )
);
