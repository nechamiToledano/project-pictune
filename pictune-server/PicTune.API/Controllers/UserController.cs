using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PicTune.Core.Models;
using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PicTune.API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound("User not found");

            var userDto = _mapper.Map<UserDto>(user); // Convert User to UserDto
            return Ok(userDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            var userDtos = _mapper.Map<IEnumerable<UserDto>>(users); // Convert List<User> to List<UserDto>
            return Ok(userDtos);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var success = await _userService.DeleteUserAsync(id);
            if (!success) return NotFound("User not found");

            return Ok("User deleted successfully");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.UserName))
                return BadRequest("Email and Username are required");

            var success = await _userService.UpdateUserAsync(id, dto.Email, dto.UserName);
            if (!success) return NotFound("User not found");

            return Ok("User updated successfully");
        }
    }
}
