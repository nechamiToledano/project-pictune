namespace PicTune.Core.DTOs
{
    public class CreatePlaylistDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class UpdatePlaylistDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CreateFolderDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid? ParentFolderId { get; set; }
    }

    public class UpdateFolderDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
    public class AddSongToPlaylistDto
    {
        public int SongId { get; set; }
    }
}
