using PicTune.Core.DTOs;
using PicTune.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicTune.Core.IServices
{
    public interface IPlaylistService
    {
        Task<IEnumerable<Playlist>> GetAllPlaylistsAsync();
        Task<Playlist?> GetPlaylistByIdAsync(Guid id);
        Task<Playlist> CreatePlaylistAsync(CreatePlaylistDto dto);
        Task<bool> UpdatePlaylistAsync(Guid id, UpdatePlaylistDto dto);
        Task<bool> DeletePlaylistAsync(Guid id);
        Task<bool> AddSongToPlaylistAsync(Guid playlistId, int songId);
        Task<bool> RemoveSongFromPlaylistAsync(Guid playlistId, int songId);
    }

}
