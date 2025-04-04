﻿using AutoMapper;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PicTune.API.PostModels;
using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using PicTune.Core.Models;
using PicTune.Service;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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


        [HttpGet("github")]
        public IActionResult GitHubLogin()
        {
            var properties = new AuthenticationProperties { };

            return Challenge(properties, "GitHub"); // Using Challenge instead of manual URL building
        }

        [HttpGet("github/callback")]
        public async Task<IActionResult> GitHubCallback()
        {
            var result = await HttpContext.AuthenticateAsync("GitHub");

            if (!result.Succeeded || result.Principal == null)
            {
                return BadRequest("GitHub authentication failed.");
            }

            var email = result.Principal.FindFirst(ClaimTypes.Email)?.Value;
            var username = result.Principal.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(username))
            {
                return BadRequest("Failed to retrieve GitHub user info.");
            }

            // Check if user exists in your database
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                // Register the user if not exists
                user = new User
                {
                    UserName = username,
                    Email = email
                };

                var resultCreate = await _userManager.CreateAsync(user);

                if (!resultCreate.Succeeded)
                {
                    return BadRequest(resultCreate.Errors);
                }
            }

            // Generate JWT Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(Env.GetString("JWT_KEY"));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                Token = tokenHandler.WriteToken(token),
                Expiration = tokenDescriptor.Expires
            });
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
            return Ok(new { success = true, message = "User registered successfully." });
  
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

            Response.Headers.Append("Access-Control-Allow-Origin", "https://pictune-ai.onrender.com");
            Response.Headers.Append("Access-Control-Allow-Credentials", "true");
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
