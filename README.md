# BookBase
A .NET 8 Web API for managing books with SQLite and JWT authentication.

## Setup
1. Install .NET 8 SDK.
2. Run `dotnet restore`.
3. Run `dotnet ef migrations add InitialCreate` and `dotnet ef database update`.
4. Run `dotnet run` to start the API on http://localhost:5000.

## Endpoints
- POST /api/auth/login: Authenticate (use testuser/password123).
- GET/POST/PUT/DELETE /api/books: CRUD operations (requires JWT).

## Testing
- Use Swagger at http://localhost:5000/swagger.
- Or use REST Client with requests.http in the project root.