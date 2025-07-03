using Microsoft.EntityFrameworkCore;
using BookBase.Models;

namespace BookBase.Data;

public class AppDbContext : DbContext
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Quote> Quotes { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Seed Books
        modelBuilder.Entity<Book>().HasData(
            new Book { Id = 1, Title = "The Great Gatsby", Author = "F. Scott Fitzgerald", PublicationDate = new DateTime(1925, 4, 10) },
            new Book { Id = 2, Title = "1984", Author = "George Orwell", PublicationDate = new DateTime(1949, 6, 8) }
        );

        // Seed Quotes
        modelBuilder.Entity<Quote>().HasData(
            new Quote { Id = 1, QuoteText = "So we beat on, boats against the current...", Author = "F. Scott Fitzgerald", BookId = 1 },
            new Quote { Id = 2, QuoteText = "Big Brother is watching you.", Author = "George Orwell", BookId = 2 }
        );
    }
}