using PicTune.Core.Models;

namespace PicTune.Core.IRepositories
{
    public interface IFolderRepository
    {
        Task<List<Folder>> GetAllAsync();
        Task<Folder?> GetByIdAsync(Guid id);
        Task<Folder> CreateAsync(Folder folder);
        Task<bool> UpdateAsync(Guid id, Folder updatedFolder);
        Task<bool> DeleteAsync(Guid id);
    }
}