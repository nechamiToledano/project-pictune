﻿using DotNetEnv;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PicTune.Core.IServices;
using PicTune.Core.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Http;
using PicTune.Core.DTOs;
using Google.Apis.Auth;

namespace PicTune.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public AuthService(
            UserManager<User> userManager,
            RoleManager<Role> roleManager,
            SignInManager<User> signInManager,
            IConfiguration configuration,
              IHttpClientFactory httpClient)


        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _httpClient = httpClient.CreateClient();

        }

        /// <summary>
        /// Registers a new user and assigns default roles.
        /// </summary>
        public async Task<IdentityResult> RegisterUserAsync(string username, string password, string email)
        {
            // Ensure roles exist before creating the user
            await EnsureRolesExistAsync();

            var user = new User
            {
                UserName = username,
                Email = email,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded) return result;

            // Assign the 'Viewer' role to the user
            await _userManager.AddToRoleAsync(user, "Viewer");

            // Fetch assigned roles as strings
            var roleNames = await _userManager.GetRolesAsync(user);



            return result;
        }



        /// <summary>
        /// Logs in a user and generates a JWT token.
        /// </summary>
        public async Task<string?> LoginUserAsync(string username, string password)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return null;

            var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
            if (!result.Succeeded) return null;

            // Ensure the user has the 'Viewer' role
            if (!await _userManager.IsInRoleAsync(user, "Viewer"))
            {
                await _userManager.AddToRoleAsync(user, "Viewer");
            }

            return await GenerateJwtTokenAsync(user);
        }


        /// <summary>
        /// Retrieves user by ID.
        /// </summary>
        public async Task<UserDto?> GetUserByIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return null;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return null;
            var roles = await _userManager.GetRolesAsync(user);
            var roleEntities = await _roleManager.Roles
    .Where(r => roles.Contains(r.Name))  // אנחנו מחפשים את כל ה־Roles לפי שמות התפקידים
    .ToListAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Roles = roles.Select(roleName => roleName).ToList()
            };
            return userDto;
        }

        /// <summary>
        /// Updates user profile details.
        /// </summary>
        public async Task<User?> UpdateUserByIdAsync(string userId, User model)
        {
            if (string.IsNullOrEmpty(userId)) return null;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            user.UserName = model.UserName ?? user.UserName;
            user.Email = model.Email ?? user.Email;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded ? user : null;
        }

        /// <summary>
        /// Ensures required roles exist in the database.
        /// </summary>
        private async Task EnsureRolesExistAsync()
        {
            var roles = new List<string> { "Viewer", "Admin", "Editor" };

            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new Role() { Name = role });
                }
            }
        }




        private async Task<string> GenerateJwtTokenAsync(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(Env.GetString("JWT_KEY"));

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Name, user.UserName ?? ""),
        new Claim(ClaimTypes.Email, user.Email ?? "")
    };

            var userRoles = await _userManager.GetRolesAsync(user);

            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<UserDto?> GetUserByUsernameAsync(string username)
        {

            if (string.IsNullOrEmpty(username))
                return null;

            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
                return null;

            var roles = await _userManager.GetRolesAsync(user);
            var roleEntities = await _roleManager.Roles
    .Where(r => roles.Contains(r.Name))  // אנחנו מחפשים את כל ה־Roles לפי שמות התפקידים
    .ToListAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Roles = roles.Select(roleName =>roleName ).ToList()
            };

            return userDto;
        }
        public async Task<string> LoginWithGoogleAsync(string credential)
        {
            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(credential);
            }
            catch
            {
                return string.Empty; // טוקן לא תקין
            }

            var email = payload.Email;
            if (string.IsNullOrWhiteSpace(email))
                return string.Empty;

            var user = await _userManager.FindByEmailAsync(email);

            // אם המשתמש לא קיים – צור חדש
            if (user == null)
            {
                user = new User
                {
                    UserName = email,
                    Email = email,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                    return string.Empty; // אפשר להחזיר גם שגיאה מפורטת בהמשך

                await EnsureRolesExistAsync();
                await _userManager.AddToRoleAsync(user, "Viewer");
            }

            // גם אם המשתמש קיים — ודא שיש לו תפקיד Viewer
            if (!await _userManager.IsInRoleAsync(user, "Viewer"))
            {
                await _userManager.AddToRoleAsync(user, "Viewer");
            }

            return await GenerateJwtTokenAsync(user);
        }


    }
}