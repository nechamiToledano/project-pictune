using Microsoft.EntityFrameworkCore;
using PicTune.Core.IRepositories;
using PicTune.Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PicTune.Data.Repositories
{
    public class MusicFileRepository : IMusicFileRepository
    {
        private readonly ApplicationDbContext _context;

        public MusicFileRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MusicFile?> GetByIdAsync(int id)
        {
            return await _context.MusicFiles.FindAsync(id);
        }

        public async Task<IEnumerable<MusicFile>> GetAllMusicFilesAsync(string? userId, bool? favorites)
        {
            var query = _context.MusicFiles.AsQueryable();

            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(m => m.OwnerId == userId);
            }

            if (favorites == true)
            {
                query = query.Where(m => m.IsLiked);
            }

            return await query.ToListAsync();
        }

        public async Task AddAsync(MusicFile musicFile)
        {
            await _context.MusicFiles.AddAsync(musicFile);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(MusicFile musicFile)
        {
            _context.MusicFiles.Update(musicFile);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var musicFile = await _context.MusicFiles.FindAsync(id);
            if (musicFile != null)
            {
                _context.MusicFiles.Remove(musicFile);
                await _context.SaveChangesAsync();
            }
        }
    }
}
