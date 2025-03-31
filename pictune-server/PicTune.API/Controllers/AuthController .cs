using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PicTune.API.PostModels;
using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using PicTune.Core.Models;
using PicTune.Service;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PicTune.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;

        public AuthController(IAuthService authService, IMapper mapper, UserManager<User> userManager)
        {
            _authService = authService;
            _mapper = mapper;
            _userManager = userManager;
        }

        /// <summary>
        /// Registers a new user.
        /// </summary>
        [HttpPost("signup")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = _mapper.Map<User>(registerDto);
            var result = await _authService.RegisterUserAsync(user.UserName, registerDto.Password, user.Email);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { Message = "User registered successfully" });
        }

        /// <summary>
        /// Logs in a user and returns a JWT token.
        /// </summary>
        [HttpPost("signin")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var token = await _authService.LoginUserAsync(loginDto.UserName, loginDto.Password);
            if (token == null)
                return Unauthorized(new { Message = "Invalid username or password" });

            var user = await _authService.GetUserByUsernameAsync(loginDto.UserName);
            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                Token = token,
                Roles = roles
            });
        }

        /// <summary>
        /// Gets the profile of the logged-in user.
        /// </summary>
        [Authorize()]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound(new { Message = "User not found" });

            var userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        /// <summary>
        /// Updates the profile of the logged-in user.
        /// </summary>
        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var userToUpdate = new User
            {
                UserName = model.UserName,
                Email = model.Email
            };
            
var updatedUser = await _authService.UpdateUserByIdAsync(userId, userToUpdate);
            if (updatedUser == null)
                return BadRequest(new { Message = "Failed to update profile." });

            return Ok(new
            {
                UserName = updatedUser.UserName,
                Email = updatedUser.Email
            });
        }


    }
}
