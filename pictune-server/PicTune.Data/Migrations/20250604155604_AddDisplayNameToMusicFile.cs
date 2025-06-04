using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PicTune.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDisplayNameToMusicFile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DisplayName",
                table: "MusicFiles",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisplayName",
                table: "MusicFiles");
        }
    }
}
