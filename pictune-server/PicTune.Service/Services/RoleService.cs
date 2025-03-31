using Microsoft.AspNetCore.Identity;
using PicTune.Core.IServices;
using PicTune.Core.Models;

namespace PicTune.Service
{
    public class RoleService : IRoleService
    {
        private readonly RoleManager<Role> _roleManager;

        public RoleService(RoleManager<Role> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task<List<Role>> GetRolesAsync()
        {
            return _roleManager.Roles.ToList();
        }

        public async Task<bool> RoleExistsAsync(string roleName)
        {
            return await _roleManager.RoleExistsAsync(roleName);
        }

        public async Task<bool> CreateRoleAsync(string roleName)
        {
            if (await _roleManager.RoleExistsAsync(roleName))
                return false;

            var result = await _roleManager.CreateAsync(new Role { Name = roleName });
            return result.Succeeded;
        }
    }
}
