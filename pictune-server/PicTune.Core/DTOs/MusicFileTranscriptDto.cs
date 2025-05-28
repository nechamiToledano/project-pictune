using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace PicTune.Core.DTOs
{
    public class MusicFileTranscriptDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
         
        [JsonPropertyName("transcript")]
        public string? Transcript { get; set; }
    }
}
