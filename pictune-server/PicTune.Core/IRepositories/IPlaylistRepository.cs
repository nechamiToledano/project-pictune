using PicTune.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicTune.Core.IRepositories
{
    public interface IPlaylistRepository
    {

        Task<Playlist?> GetPlaylistByIdAsync(Guid id);
        Task UpdatePlaylistAsync(Playlist playlist);
        Task<IEnumerable<Playlist>> GetAllPlaylistsAsync();
        Task AddPlaylistAsync(Playlist playlist);
        Task DeletePlaylistAsync(Guid id);

        Task<bool> AddSongToPlaylistAsync(Guid playlistId, int songId);
        Task<bool> RemoveSongFromPlaylistAsync(Guid playlistId, int songId);
    }
}
