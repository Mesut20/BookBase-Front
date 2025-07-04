<<<<<<< HEAD
# BookBaseFront

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
=======
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
>>>>>>> 51ea2dfa3c57ec689967cb8f7b0dd274423b2106
