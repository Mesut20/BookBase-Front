using Microsoft.EntityFrameworkCore;
using BookBase.Models;

namespace BookBase.Data;

public class AppDbContext : DbContext
{
    public DbSet<Book> Books { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}