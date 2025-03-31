using Microsoft.EntityFrameworkCore;
using PicTune.Core.IRepositories;
using PicTune.Data;
using PicTune.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PicTune.Data.Repositories
{
    public class PlaylistRepository:IPlaylistRepository
    {
        private readonly ApplicationDbContext _context;

        public PlaylistRepository(ApplicationDbContext context)
        {
            _context = context;
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
    }
}
