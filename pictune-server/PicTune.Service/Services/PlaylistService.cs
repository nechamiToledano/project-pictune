using PicTune.Data.Models;
using PicTune.Core.DTOs;
using PicTune.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using PicTune.Core.IRepositories;
using PicTune.Core.IServices;

namespace PicTune.Service
{
    public class PlaylistService:IPlaylistService
    {
        private readonly IPlaylistRepository _repository;

        public PlaylistService(IPlaylistRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Playlist>> GetAllPlaylistsAsync()
        {
            return await _repository.GetAllPlaylistsAsync();
        }

        public async Task<Playlist?> GetPlaylistByIdAsync(Guid id)
        {
            return await _repository.GetPlaylistByIdAsync(id);
        }

        public async Task<Playlist> CreatePlaylistAsync(CreatePlaylistDto dto)
        {
            var playlist = new Playlist
            {
                Name = dto.Name,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repository.AddPlaylistAsync(playlist);
            return playlist;
        }

        public async Task<bool> UpdatePlaylistAsync(Guid id, UpdatePlaylistDto dto)
        {
            var playlist = await _repository.GetPlaylistByIdAsync(id);
            if (playlist == null) return false;

            playlist.Name = dto.Name;
            playlist.Description = dto.Description;
            playlist.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdatePlaylistAsync(playlist);
            return true;
        }

        public async Task<bool> DeletePlaylistAsync(Guid id)
        {
            var playlist = await _repository.GetPlaylistByIdAsync(id);
            if (playlist == null) return false;

            await _repository.DeletePlaylistAsync(id);
            return true;
        }
        public async Task<bool> AddSongToPlaylistAsync(Guid playlistId, int songId)
        {
            return await _repository.AddSongToPlaylistAsync(playlistId, songId);
        }

        public async Task<bool> RemoveSongFromPlaylistAsync(Guid playlistId, int songId)
        {
            return await _repository.RemoveSongFromPlaylistAsync(playlistId, songId);
        }
    }
}
