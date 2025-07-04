using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookBase.Data;
using BookBase.Models;

namespace BookBase.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly AppDbContext _context;

    public BooksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetBooks()
    {
        var books = await _context.Books
            .Select(b => new { b.Id, b.Title, b.Author, b.PublicationDate })
            .ToListAsync();
        if (books == null || !books.Any())
        {
            return NotFound("No books found in the database.");
        }
        return Ok(books);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetBook(int id)
    {
        var book = await _context.Books
            .Where(b => b.Id == id)
            .Select(b => new { b.Id, b.Title, b.Author, b.PublicationDate })
            .FirstOrDefaultAsync();

        if (book == null)
        {
            return NotFound();
        }
        return Ok(book);
    }

    [HttpPost]
    public async Task<ActionResult<Book>> PostBook(Book book)
    {
        if (book == null)
        {
            return BadRequest("Book cannot be null.");
        }
        if (string.IsNullOrWhiteSpace(book.Title) || string.IsNullOrWhiteSpace(book.Author))
        {
            return BadRequest("Title and Author are required and cannot be empty.");
        }
        if (!book.PublicationDate.HasValue)
        {
            book.PublicationDate = DateTime.Now;
        }

        _context.Books.Add(book);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
        return CreatedAtAction(nameof(GetBooks), new { id = book.Id }, book);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutBook(int id, Book book)
    {
        if (id != book.Id)
        {
            return BadRequest("ID mismatch.");
        }

        var existingBook = await _context.Books.FindAsync(id);
        if (existingBook == null)
        {
            return NotFound();
        }

        existingBook.Title = book.Title;
        existingBook.Author = book.Author;
        existingBook.PublicationDate = book.PublicationDate ?? existingBook.PublicationDate;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!BookExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }

        return NoContent();
    }

    private bool BookExists(int id)
    {
        return _context.Books.Any(e => e.Id == id);
    }
}