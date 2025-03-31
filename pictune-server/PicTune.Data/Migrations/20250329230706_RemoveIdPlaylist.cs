using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PicTune.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIdPlaylist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MusicFiles_Playlists_PlaylistId",
                table: "MusicFiles");

            migrationBuilder.DropIndex(
                name: "IX_MusicFiles_PlaylistId",
                table: "MusicFiles");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
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

            migrationBuilder.AlterColumn<int>(
                name: "FolderId",
                table: "MusicFiles",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<byte[]>(
                name: "EmbeddedImage",
                table: "MusicFiles",
                type: "longblob",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .OldAnnotation("MySql:CharSet", "utf8mb4");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MusicFiles_Playlists_PlaylistId1",
                table: "MusicFiles");

            migrationBuilder.DropIndex(
                name: "IX_MusicFiles_PlaylistId1",
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

            migrationBuilder.AlterColumn<int>(
                name: "FolderId",
                table: "MusicFiles",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EmbeddedImage",
                table: "MusicFiles",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(byte[]),
                oldType: "longblob",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "MusicFiles",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

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
    }
}
