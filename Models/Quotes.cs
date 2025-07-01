namespace BookBase.Models;

public class Quote
{
    public int Id { get; set; }
    public required string QuoteText { get; set; } // Matchar "quote" i felet
    public required string Author { get; set; }
    public int? BookId { get; set; } // Gör BookId nullable om relationen är valfri
    public Book? Book { get; set; } // Gör Book nullable
}