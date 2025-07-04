namespace BookBase.Models;

public class Book
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Author { get; set; }
    public DateTime? PublicationDate { get; set; } // Ändrat till nullable
    public List<Quote>? Quotes { get; set; } // Navigeringsegenskap till citat
}