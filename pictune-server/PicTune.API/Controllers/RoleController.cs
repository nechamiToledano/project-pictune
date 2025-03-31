using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using PicTune.Service;
using Microsoft.AspNetCore.Authorization;
using PicTune.Core.IServices;

[Authorize("AdminOnly")]
[Route("api/roles")]
[ApiController]
public class RolesController : ControllerBase
{
    private readonly IRoleService _roleService;

    public RolesController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _roleService.GetRolesAsync();
        return Ok(roles);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateRole([FromBody] string roleName)
    {
        if (string.IsNullOrWhiteSpace(roleName))
            return BadRequest("Role name cannot be empty");

        bool success = await _roleService.CreateRoleAsync(roleName);
        if (!success)
            return BadRequest("Role already exists or creation failed");

        return Ok($"Role '{roleName}' created successfully");
    }
}
