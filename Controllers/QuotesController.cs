using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookBase.Data;
using BookBase.Models;

namespace BookBase.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class QuotesController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuotesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Quote>>> GetQuotes()
    {
        var quotes = await _context.Quotes
            .Select(q => new { q.Id, q.QuoteText, q.Author, q.BookId })
            .ToListAsync();
        return Ok(quotes);
    }

    [HttpPost]
    public async Task<ActionResult<Quote>> PostQuote(Quote quote)
    {
        if (quote == null || string.IsNullOrWhiteSpace(quote.QuoteText) || string.IsNullOrWhiteSpace(quote.Author) || quote.BookId <= 0)
        {
            return BadRequest("QuoteText, Author, and a valid BookId are required.");
        }

        // Validera att BookId finns
        if (!await _context.Books.AnyAsync(b => b.Id == quote.BookId))
        {
            return BadRequest("Invalid BookId. The specified book does not exist.");
        }

        _context.Quotes.Add(quote);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
        return CreatedAtAction(nameof(GetQuotes), new { id = quote.Id }, quote);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuote(int id)
    {
        var quote = await _context.Quotes.FindAsync(id);
        if (quote == null)
        {
            return NotFound();
        }

        _context.Quotes.Remove(quote);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message ?? "Unknown error"}");
        }

        return NoContent();
    }
}