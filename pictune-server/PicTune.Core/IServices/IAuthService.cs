using Microsoft.AspNetCore.Identity;
using PicTune.Core.DTOs;
using PicTune.Core.Models;

namespace PicTune.Core.IServices
{
    public interface IAuthService
    {
        Task<IdentityResult> RegisterUserAsync(string username, string password, string email);
        Task<string?> LoginUserAsync(string username, string password);
        Task<UserDto?> GetUserByIdAsync(string userId);
        Task<UserDto?> GetUserByUsernameAsync(string username);
        Task<User?> UpdateUserByIdAsync(string userId, User model);
        Task<string> LoginWithGoogleAsync(string credential);
    }
}
