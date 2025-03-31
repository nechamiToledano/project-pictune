using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PicTune.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMusicFileTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FilePath",
                table: "MusicFiles",
                newName: "S3Key");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "MusicFiles",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "FileType",
                table: "MusicFiles",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "FolderId",
                table: "MusicFiles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "MusicFiles",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "MusicFiles",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<long>(
                name: "Size",
                table: "MusicFiles",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "MusicFiles");

            migrationBuilder.DropColumn(
                name: "FileType",
                table: "MusicFiles");

            migrationBuilder.DropColumn(
                name: "FolderId",
                table: "MusicFiles");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "MusicFiles");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "MusicFiles");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "MusicFiles");

            migrationBuilder.RenameColumn(
                name: "S3Key",
                table: "MusicFiles",
                newName: "FilePath");
        }
    }
}
