using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookBase.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace BookBase.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public LoginController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost]
    public IActionResult Login([FromBody] LoginModel login)
    {
        Console.WriteLine($"Received login: {login?.Username}, {login?.Password}"); // Logga inkommande data
        if (login == null || string.IsNullOrEmpty(login.Username) || string.IsNullOrEmpty(login.Password))
        {
            return Unauthorized("Invalid credentials");
        }

        var key = _configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(key))
        {
            Console.WriteLine("Jwt:Key is missing or empty in configuration");
            return StatusCode(500, "Internal server error: JWT key not configured");
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, login.Username)
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds);

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(tokenString);
    }
}

public class LoginModel
{
    [Required]
    public string? Username { get; set; }
    [Required]
    public string? Password { get; set; }
}