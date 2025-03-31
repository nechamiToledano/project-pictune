// FolderRepository.cs
using PicTune.Data;
using PicTune.Core.Models;
using Microsoft.EntityFrameworkCore;
using PicTune.Core;
using PicTune.Core.IRepositories;

namespace PicTune.Data.Repositories
{
    public class FolderRepository : IFolderRepository
    {
        private readonly ApplicationDbContext _context;

        public FolderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Folder>> GetAllAsync()
        {
            return await _context.Folders.ToListAsync();
        }

        public async Task<Folder?> GetByIdAsync(Guid id)
        {
            return await _context.Folders.FindAsync(id);
        }

        public async Task<Folder> CreateAsync(Folder folder)
        {
            _context.Folders.Add(folder);
            await _context.SaveChangesAsync();
            return folder;
        }

        public async Task<bool> UpdateAsync(Guid id, Folder updatedFolder)
        {
            var folder = await _context.Folders.FindAsync(id);
            if (folder == null) return false;

            folder.Name = updatedFolder.Name;
            folder.Description = updatedFolder.Description;
            folder.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var folder = await _context.Folders.FindAsync(id);
            if (folder == null) return false;

            _context.Folders.Remove(folder);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
