// Types for Book data
export interface OpenLibrarySearchDoc {
    key: string;
    title: string;
    author_name?: string[];
    cover_i?: number;
    isbn?: string[];
    first_publish_year?: number;
    subject?: string[];
    publisher?: string[];
    language?: string[];
}

export interface OpenLibrarySearchResponse {
    numFound: number;
    start: number;
    docs: OpenLibrarySearchDoc[];
}

export interface OpenLibraryWork {
    title: string;
    description?: string | { value: string };
    covers?: number[];
    subjects?: string[];
    authors?: { author: { key: string } }[];
}

export interface Book {
    id: string;
    title: string;
    author: string;
    image: string;
    coverUrl?: string; // Alias for image
    description?: string; // Alias for synopsis
    isbn?: string;
    synopsis?: string;
    badge?: string;
    price?: number;
    categories?: string[];
    publishYear?: number;
}

export interface CartItem extends Book {
    quantity: number;
}
