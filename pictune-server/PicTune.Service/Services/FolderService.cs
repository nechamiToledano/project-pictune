using PicTune.Data;
using PicTune.Core.Models;
using Microsoft.EntityFrameworkCore;
using PicTune.Core.IServices;
using PicTune.Core.IRepositories;

namespace PicTune.Service
{
    public class FolderService : IFolderService
    {
        private readonly IFolderRepository _folderRepository;

        public FolderService(IFolderRepository folderRepository)
        {
            _folderRepository = folderRepository;
        }

        public async Task<List<Folder>> GetAllFoldersAsync()
        {
            return await _folderRepository.GetAllAsync();
        }

        public async Task<Folder?> GetFolderByIdAsync(Guid id)
        {
            return await _folderRepository.GetByIdAsync(id);
        }

        public async Task<Folder> CreateFolderAsync(Folder folder)
        {
            return await _folderRepository.CreateAsync(folder);
        }

        public async Task<bool> UpdateFolderAsync(Guid id, Folder updatedFolder)
        {
            return await _folderRepository.UpdateAsync(id, updatedFolder);
        }

        public async Task<bool> DeleteFolderAsync(Guid id)
        {
            return await _folderRepository.DeleteAsync(id);
        }
    }
}