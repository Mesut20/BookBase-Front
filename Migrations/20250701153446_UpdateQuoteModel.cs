using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookBase.Migrations
{
    /// <inheritdoc />
    public partial class UpdateQuoteModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Text",
                table: "Quotes",
                newName: "QuoteText");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "QuoteText",
                table: "Quotes",
                newName: "Text");
        }
    }
}
