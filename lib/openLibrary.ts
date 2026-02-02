import type {
    OpenLibrarySearchResponse,
    OpenLibraryWork,
    Book,
} from "@/types/book";

const BASE_URL = "https://openlibrary.org";
const COVERS_URL = "https://covers.openlibrary.org";

/**
 * Search books from Open Library
 */
export async function searchBooks(
    query: string,
    limit: number = 20
): Promise<Book[]> {
    if (!query.trim()) return [];

    const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        fields: "key,title,author_name,cover_i,isbn,first_publish_year,subject",
    });

    const response = await fetch(`${BASE_URL}/search.json?${params}`, {
        headers: {
            "User-Agent": "MyLibrary/1.0 (contact@example.com)",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to search books");
    }

    const data: OpenLibrarySearchResponse = await response.json();

    return data.docs.map((doc) => ({
        id: doc.key.replace("/works/", ""),
        title: doc.title,
        author: doc.author_name?.[0] || "Unknown Author",
        image: doc.cover_i
            ? getCoverUrl(doc.cover_i, "M")
            : "/cover_buku/placeholder.jpg",
        isbn: doc.isbn?.[0],
        publishYear: doc.first_publish_year,
        categories: doc.subject?.slice(0, 3),
        price: Math.floor(Math.random() * 100000) + 50000, // Random price for demo
    }));
}

/**
 * Get book details by work ID
 */
export async function getBookByWorkId(workId: string): Promise<Book | null> {
    try {
        const response = await fetch(`${BASE_URL}/works/${workId}.json`, {
            headers: {
                "User-Agent": "MyLibrary/1.0 (contact@example.com)",
            },
        });

        if (!response.ok) return null;

        const work: OpenLibraryWork = await response.json();

        // Get author details
        let authorName = "Unknown Author";
        if (work.authors?.[0]?.author?.key) {
            const authorResponse = await fetch(
                `${BASE_URL}${work.authors[0].author.key}.json`
            );
            if (authorResponse.ok) {
                const author = await authorResponse.json();
                authorName = author.name || authorName;
            }
        }

        // Parse description
        let synopsis = "";
        if (typeof work.description === "string") {
            synopsis = work.description;
        } else if (work.description?.value) {
            synopsis = work.description.value;
        }

        return {
            id: workId,
            title: work.title,
            author: authorName,
            image: work.covers?.[0]
                ? getCoverUrl(work.covers[0], "L")
                : "/cover_buku/placeholder.jpg",
            synopsis: synopsis || "Tidak ada sinopsis tersedia.",
            categories: work.subjects?.slice(0, 5),
            price: Math.floor(Math.random() * 100000) + 50000,
        };
    } catch (error) {
        console.error("Error fetching book:", error);
        return null;
    }
}

/**
 * Search books by subject/category
 */
export async function getBooksBySubject(
    subject: string,
    limit: number = 12
): Promise<Book[]> {
    try {
        const response = await fetch(
            `${BASE_URL}/subjects/${subject.toLowerCase()}.json?limit=${limit}`,
            {
                headers: {
                    "User-Agent": "MyLibrary/1.0 (contact@example.com)",
                },
            }
        );

        if (!response.ok) return [];

        const data = await response.json();

        return (data.works || []).map(
            (work: {
                key: string;
                title: string;
                authors?: { name: string }[];
                cover_id?: number;
            }) => ({
                id: work.key.replace("/works/", ""),
                title: work.title,
                author: work.authors?.[0]?.name || "Unknown Author",
                image: work.cover_id
                    ? getCoverUrl(work.cover_id, "M")
                    : "/cover_buku/placeholder.jpg",
                price: Math.floor(Math.random() * 100000) + 50000,
            })
        );
    } catch (error) {
        console.error("Error fetching by subject:", error);
        return [];
    }
}

/**
 * Get trending/popular books
 */
export async function getTrendingBooks(limit: number = 8): Promise<Book[]> {
    // Use "trending" subject or search popular authors
    return searchBooks("bestseller", limit);
}

/**
 * Generate cover URL from cover ID
 */
export function getCoverUrl(
    coverId: number,
    size: "S" | "M" | "L" = "M"
): string {
    return `${COVERS_URL}/b/id/${coverId}-${size}.jpg`;
}

/**
 * Get cover URL by ISBN
 */
export function getCoverByISBN(
    isbn: string,
    size: "S" | "M" | "L" = "M"
): string {
    return `${COVERS_URL}/b/isbn/${isbn}-${size}.jpg`;
}
