import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface Bookmark {
    id: string;
    user_id: string;
    book_id: string;
    book_title: string;
    book_author?: string;
    book_image?: string;
    book_price?: number;
    created_at: string;
}

export type User = SupabaseUser;

export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
}
