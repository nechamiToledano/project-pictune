using Microsoft.AspNetCore.Identity;
using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using PicTune.Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PicTune.Service
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;

        public UserService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return _userManager.Users.ToList();
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> UpdateUserAsync(string userId, string newEmail, string newUserName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            user.Email = newEmail;
            user.UserName = newUserName;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public Task<List<StatPoint>> GetUserRegistrationStatsAsync(string timeRange)
        {
            DateTime fromDate = timeRange switch
            {
                "week" => DateTime.Today.AddDays(-7),
                "month" => DateTime.Today.AddMonths(-1),
                "year" => DateTime.Today.AddYears(-1),
                _ => DateTime.MinValue // all data if unknown
            };

            var stats = _userManager.Users
                .Where(u => u.CreatedAt >= fromDate)
                .GroupBy(u => u.CreatedAt.Date)
                .OrderBy(g => g.Key)
                .Select(g => new StatPoint
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .ToList();

            return Task.FromResult(stats);
        }

    }
}
