﻿using System.ComponentModel.DataAnnotations.Schema;

namespace PicTune.Core.Models
{
    public class MusicFile
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public string S3Key { get; set; }
        public long Size { get; set; }
        public DateTime UploadedAt { get; set; }
        public bool IsLiked { get; set; }
        public bool IsDeleted { get; set; }
        public string OwnerId { get; set; }
        public int? FolderId { get; set; }
    }

}
