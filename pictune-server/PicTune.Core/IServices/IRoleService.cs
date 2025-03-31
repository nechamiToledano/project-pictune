using System.Collections.Generic;
using System.Threading.Tasks;
using PicTune.Core.Models;

namespace PicTune.Core.IServices
{
    public interface IRoleService
    {
        Task<List<Role>> GetRolesAsync();
        Task<bool> RoleExistsAsync(string roleName);
        Task<bool> CreateRoleAsync(string roleName);
    }
}
