using PicTune.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PicTune.Core.IServices
{
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(string id);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<bool> DeleteUserAsync(string id);
        Task<bool> UpdateUserAsync(string id, string newEmail, string newUserName);
    }
}
