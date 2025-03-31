using PicTune.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PicTune.Core.IServices
{
    public interface IMusicFileService
    {

        Task<IEnumerable<MusicFile>> GetAllMusicFilesAsync(string? userId, bool? favorites);

        Task<MusicFile?> GetMusicFileByIdAsync(int id);
        Task<MusicFile?> AddMusicFileAsync(MusicFile musicFile, string userName);
        Task<bool> DeleteMusicFileAsync(int id, string userId);
        Task<bool> UpdateMusicFileAsync(int id, string newFileName, string userId);
        Task<bool> ToggleLikeAsync(int id, string userId);

    }
}
