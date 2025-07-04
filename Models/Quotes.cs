namespace BookBase.Models;

public class Quote
{
    public int Id { get; set; }
    public required string QuoteText { get; set; }
    public required string Author { get; set; }
    public int? BookId { get; set; }
    public Book? Book { get; set; }
}