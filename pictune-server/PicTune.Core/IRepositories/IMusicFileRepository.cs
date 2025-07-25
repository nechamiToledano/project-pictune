using Microsoft.EntityFrameworkCore;
using PicTune.Core.DTOs;
using PicTune.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicTune.Core.IRepositories
{
    public interface IMusicFileRepository
    {
        Task<MusicFile> GetByIdAsync(int id);
        Task<IEnumerable<MusicFile>> GetAllMusicFilesAsync(string? userId, bool? favorites);
        Task AddAsync(MusicFile musicFile);
        Task UpdateAsync(MusicFile musicFile);
        Task DeleteAsync(int id);
        Task<string?> TranscribeFileAsync(string fileUrl);
        string GeneratePreSignedUrl(MusicFile file);
        Task<List<StatPoint>> GetMusicUploadStatsAsync(string timeRange);
        Task<List<HourlyStatDto>> GetUploadStatsByHourAsync();
        Task SyncMissingMusicFilesFromS3Async();
        Task<string?> UpdateLyricsAsync(int fileId, string newLyrics);


    }
}
