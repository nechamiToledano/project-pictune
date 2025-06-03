using Microsoft.EntityFrameworkCore;
using PicTune.Core.IRepositories;
using PicTune.Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using PicTune.Core.DTOs;
using DotNetEnv;
using Microsoft.AspNetCore.Identity;

namespace PicTune.Data.Repositories
{
    public class MusicFileRepository : IMusicFileRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IAmazonS3 _s3Client;
        private readonly string _python_api_url;

        private readonly string _bucketName;

        public MusicFileRepository(ApplicationDbContext context, IAmazonS3 s3Client)
        {
            _context = context;
            _s3Client = s3Client;
            _bucketName = Env.GetString("AWS_BUCKET_NAME");
            _python_api_url = Env.GetString("PYTHON_API_URL");

        }

        public async Task<MusicFile?> GetByIdAsync(int id)
        {
            return await _context.MusicFiles.FindAsync(id);
        }

        public async Task<IEnumerable<MusicFile>> GetAllMusicFilesAsync(string? userId, bool? favorites)
        {
            var query = _context.MusicFiles.AsQueryable();

            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(m => m.OwnerId == userId);
            }

            if (favorites == true)
            {
                query = query.Where(m => m.IsLiked);
            }

            return await query.ToListAsync();
        }

        public async Task AddAsync(MusicFile musicFile)
        {
            await _context.MusicFiles.AddAsync(musicFile);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(MusicFile musicFile)
        {
            _context.MusicFiles.Update(musicFile);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var musicFile = await _context.MusicFiles.FindAsync(id);
            if (musicFile != null)
            {
                _context.MusicFiles.Remove(musicFile);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<string?> TranscribeFileAsync(string fileUrl)
        {
            var httpClient = new HttpClient();
            var requestBody = new { url = fileUrl };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            try
            {
                var response = await httpClient.PostAsync($"{_python_api_url}/transcribe_song", content);
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                var json = JsonDocument.Parse(responseContent);

                // ננסה להוציא את full_text
                if (json.RootElement.TryGetProperty("full_text", out var fullTextElement))
                {
                    return fullTextElement.GetString();
                }

                return null;

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Transcription API failed: {ex.Message}");
                return null;
            }
        }
        public string GeneratePreSignedUrl(MusicFile file)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = file.S3Key,
                Expires = DateTime.UtcNow.AddHours(2),
                Verb = HttpVerb.GET,
                ResponseHeaderOverrides = new ResponseHeaderOverrides
                {
                    ContentDisposition = $"attachment; filename=\"{file.FileName}\""
                }
            };

            return _s3Client.GetPreSignedURL(request);
        }
      
        public async Task<List<StatPoint>> GetMusicUploadStatsAsync(string timeRange)
        {
            DateTime fromDate = timeRange switch
            {
                "week" => DateTime.Today.AddDays(-7),
                "month" => DateTime.Today.AddMonths(-1),
                "year" => DateTime.Today.AddYears(-1),
                _ => DateTime.MinValue // all data if unknown
            };

            return await _context.MusicFiles
            .Where(u => u.UploadedAt >= fromDate)
            .GroupBy(m => m.UploadedAt.Date)
            .Select(g => new StatPoint
            {
                Date = g.Key,
                Count = g.Count()
            })
            .OrderBy(s => s.Date)
            .ToListAsync();
        }
        public async Task<List<HourlyStatDto>> GetUploadStatsByHourAsync()
        {
            return await _context.MusicFiles
                .GroupBy(f => f.UploadedAt.Hour)
                .Select(g => new HourlyStatDto
                {
                    Hour = g.Key,
                    Count = g.Count()
                })
                .OrderBy(s => s.Hour)
                .ToListAsync();
        }

    }
}
