namespace PicTune.Core.DTOs
{
    public class MusicFileUploadDto
    {
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public int Size { get; set; }
        public string S3Key { get; set; } = string.Empty;
        public int FolderId { get; set; }
    }
}
