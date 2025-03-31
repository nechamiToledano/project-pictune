using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PicTune.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MusicFiles_Playlists_PlaylistId1",
                table: "MusicFiles");

            migrationBuilder.DropIndex(
                name: "IX_MusicFiles_PlaylistId1",
                table: "MusicFiles");

            migrationBuilder.DropColumn(
                name: "EmbeddedImage",
                table: "MusicFiles");

            migrationBuilder.DropColumn(
                name: "PlaylistId1",
                table: "MusicFiles");

            migrationBuilder.AlterColumn<Guid>(
                name: "PlaylistId",
                table: "MusicFiles",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci",
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MusicFiles_PlaylistId",
                table: "MusicFiles",
                column: "PlaylistId");

            migrationBuilder.AddForeignKey(
                name: "FK_MusicFiles_Playlists_PlaylistId",
                table: "MusicFiles",
                column: "PlaylistId",
                principalTable: "Playlists",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MusicFiles_Playlists_PlaylistId",
                table: "MusicFiles");

            migrationBuilder.DropIndex(
                name: "IX_MusicFiles_PlaylistId",
                table: "MusicFiles");

            migrationBuilder.AlterColumn<int>(
                name: "PlaylistId",
                table: "MusicFiles",
                type: "int",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AddColumn<byte[]>(
                name: "EmbeddedImage",
                table: "MusicFiles",
                type: "longblob",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PlaylistId1",
                table: "MusicFiles",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_MusicFiles_PlaylistId1",
                table: "MusicFiles",
                column: "PlaylistId1");

            migrationBuilder.AddForeignKey(
                name: "FK_MusicFiles_Playlists_PlaylistId1",
                table: "MusicFiles",
                column: "PlaylistId1",
                principalTable: "Playlists",
                principalColumn: "Id");
        }
    }
}
