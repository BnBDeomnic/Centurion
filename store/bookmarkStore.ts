"use client";

import { create } from "zustand";
import { getSupabase } from "@/lib/supabase";
import type { Bookmark } from "@/types/user";
import type { Book } from "@/types/book";

interface BookmarkStore {
    bookmarks: Bookmark[];
    loading: boolean;
    fetchBookmarks: () => Promise<void>;
    addBookmark: (book: Book) => Promise<boolean>;
    removeBookmark: (bookId: string) => Promise<boolean>;
    isBookmarked: (bookId: string) => boolean;
    clearBookmarks: () => void;
}

export const useBookmarks = create<BookmarkStore>((set, get) => ({
    bookmarks: [],
    loading: false,

    fetchBookmarks: async () => {
        // Prevent multiple concurrent fetches
        if (get().loading) return;

        set({ loading: true });

        try {
            const supabase = getSupabase();

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                set({ bookmarks: [], loading: false });
                return;
            }

            const { data, error } = await supabase
                .from("bookmarks")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching bookmarks:", error);
                set({ bookmarks: [], loading: false });
                return;
            }

            set({ bookmarks: data || [], loading: false });
        } catch (err) {
            console.error("Unexpected error fetching bookmarks:", err);
            set({ bookmarks: [], loading: false });
        }
    },

    addBookmark: async (book: Book) => {
        const supabase = getSupabase();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase.from("bookmarks").insert({
            user_id: user.id,
            book_id: book.id,
            book_title: book.title,
            book_author: book.author,
            book_image: book.image,
            book_price: book.price || 75000,
        });

        if (error) {
            console.error("Error adding bookmark:", error);
            return false;
        }

        // Refresh bookmarks
        await get().fetchBookmarks();
        return true;
    },

    removeBookmark: async (bookId: string) => {
        const supabase = getSupabase();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase
            .from("bookmarks")
            .delete()
            .eq("user_id", user.id)
            .eq("book_id", bookId);

        if (error) {
            console.error("Error removing bookmark:", error);
            return false;
        }

        // Update local state
        set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.book_id !== bookId),
        }));
        return true;
    },

    isBookmarked: (bookId: string) => {
        return get().bookmarks.some((b) => b.book_id === bookId);
    },

    clearBookmarks: () => {
        set({ bookmarks: [] });
    },
}));
