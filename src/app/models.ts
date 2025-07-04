export interface Book {
  id: number;
  title: string;
  author: string;
  publicationDate?: Date; // Nullable för att matcha DateTime? i back-end
}

export interface Quote {
  id: number;
  quoteText: string;
  author: string;
  bookId: number;
}