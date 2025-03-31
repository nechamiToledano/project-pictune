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
        Task<string> GetGitHubAccessTokenAsync(string code);
        Task<GitHubUserInfo> GetGitHubUserInfoAsync(string accessToken);
    }
    public class GitHubUserInfo
    {

        public string Login { get; set; }
        public string Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }

    }
}
