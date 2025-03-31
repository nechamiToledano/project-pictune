using Microsoft.AspNetCore.Identity;
using PicTune.Core.Models;

namespace PicTune.Core.IServices
{
    public interface IAuthService
    {
        Task<IdentityResult> RegisterUserAsync(string username, string password, string email);
        Task<string?> LoginUserAsync(string username, string password);
        Task<User?> GetUserByIdAsync(string userId);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> UpdateUserByIdAsync(string userId, User model);
    }
}
