using Microsoft.EntityFrameworkCore;
using PicTune.Core.DTOs;
using PicTune.Core.IRepositories;
using PicTune.Core.Models;
using PicTune.Data;
using PicTune.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace PicTune.Data.Repositories
{
    public class PlaylistRepository:IPlaylistRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;

        public PlaylistRepository(ApplicationDbContext context,HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<Playlist>> GetAllPlaylistsAsync()
        {


            return await _context.Playlists.Include(p => p.Songs).ToListAsync();
        }

        public async Task<Playlist?> GetPlaylistByIdAsync(Guid id)
        {
            return await _context.Playlists.Include(p => p.Songs).FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task AddPlaylistAsync(Playlist playlist)
        {
            _context.Playlists.Add(playlist);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePlaylistAsync(Playlist playlist)
        {
            _context.Playlists.Update(playlist);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePlaylistAsync(Guid id)
        {
            var playlist = await _context.Playlists.FindAsync(id);
            if (playlist != null)
            {
                _context.Playlists.Remove(playlist);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<bool> AddSongToPlaylistAsync(Guid playlistId, int songId)
        {
            var playlist = await _context.Playlists.Include(p => p.Songs)
                .FirstOrDefaultAsync(p => p.Id == playlistId);

            if (playlist == null) return false;

            var song = await _context.MusicFiles.FindAsync(songId);
            if (song == null) return false;

            playlist.Songs.Add(song);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveSongFromPlaylistAsync(Guid playlistId, int songId)
        {
            var playlist = await _context.Playlists.Include(p => p.Songs)
                .FirstOrDefaultAsync(p => p.Id == playlistId);

            if (playlist == null) return false;

            var song = playlist.Songs.FirstOrDefault(s => s.Id == songId);
            if (song == null) return false;

            playlist.Songs.Remove(song);
            await _context.SaveChangesAsync();
            return true;
        }
        private async Task<List<MusicFileTranscriptDto>> GetSongsWithTranscriptsAsync( )
        {
            return await _context.MusicFiles
                .Where(m=>!string.IsNullOrEmpty(m.Transcript))
                .Select(m => new MusicFileTranscriptDto
                {
                    Id = m.Id,
                    Transcript = m.Transcript
                })
                .ToListAsync();
        }

        public async Task<Playlist?> GeneratePlaylistByPromptAsync(string userPrompt)
        {
            List<MusicFileTranscriptDto> songs = await GetSongsWithTranscriptsAsync();

            var payload = new
            {
                user_prompt = userPrompt,
                songs = songs
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://pictune-python.onrender.com/generate_playlist_by_prompt/", content);
            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync();
            var generated = JsonSerializer.Deserialize<GeneratedPlaylistDto>(responseString, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (generated == null || string.IsNullOrWhiteSpace(generated.Name)) return null;

            // Find the actual MusicFile entities by the returned song IDs
            var songEntities = await _context.MusicFiles
                .Where(m => generated.Songs.Contains(m.Id))
                .ToListAsync();

            // Create a Playlist entity
            var playlist = new Playlist
            {
                Id = Guid.NewGuid(),
                Name = generated.Name,
                Songs = songEntities
            };

            // Save to DB
            _context.Playlists.Add(playlist);
            await _context.SaveChangesAsync();

            return playlist;
        }



    }
}
