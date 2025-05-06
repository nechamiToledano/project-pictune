using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicTune.Core.DTOs
{
    public class GeneratedPlaylistDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<int> Songs { get; set; } = new();
    }

}
