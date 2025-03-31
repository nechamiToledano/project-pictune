using PicTune.Core.Models;

namespace PicTune.Core.IServices
{
    public interface IFolderService
    {
        Task<List<Folder>> GetAllFoldersAsync();
        Task<Folder?> GetFolderByIdAsync(Guid id);
        Task<Folder> CreateFolderAsync(Folder folder);
        Task<bool> UpdateFolderAsync(Guid id, Folder updatedFolder);
        Task<bool> DeleteFolderAsync(Guid id);
    }
}