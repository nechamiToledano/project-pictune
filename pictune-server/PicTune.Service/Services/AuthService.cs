using DotNetEnv;
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

namespace PicTune.Service.Services
{
    public class AuthService:IAuthService
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
            
            return GenerateJwtToken(user);
        }


        /// <summary>
        /// Retrieves user by ID.
        /// </summary>
        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return string.IsNullOrEmpty(userId) ? null : await _userManager.FindByIdAsync(userId);
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
                    await _roleManager.CreateAsync(new Role() { Name=role});
                }
            }
        }




        /// <summary>
        /// Generates a JWT token for authenticated users.
        /// </summary>
        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(Env.GetString("JWT_KEY"));

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName ?? ""),
                new Claim(ClaimTypes.Email, user.Email ?? "")
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return string.IsNullOrEmpty(username) ? null : await _userManager.FindByNameAsync(username);

        }
        public async Task<string> GetGitHubAccessTokenAsync(string code)
        {
            var clientId = Env.GetString("GITHUB_CLIENT_ID");
            var clientSecret = Env.GetString("GITHUB_CLIENT_SECRET");

            var requestData = new
            {
                client_id = clientId,
                client_secret = clientSecret,
                code = code,
                redirect_uri = "https://pictune.onrender.com/api/auth/github/callback"
            };

            var requestContent = new StringContent(JsonSerializer.Serialize(requestData), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://github.com/login/oauth/access_token", requestContent);

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Failed to retrieve access token. Status Code: {response.StatusCode}");
                return null;
            }

            var responseContent = await response.Content.ReadAsStringAsync();

            // GitHub returns a query string, so we need to parse it
            var queryParams = System.Web.HttpUtility.ParseQueryString(responseContent);
            var accessToken = queryParams["access_token"];

            return accessToken;
        }

        public async Task<GitHubUserInfo> GetGitHubUserInfoAsync(string accessToken)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.GetAsync("https://api.github.com/user");

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Failed to retrieve user info. Status Code: {response.StatusCode}");
                return null;
            }

            var responseContent = await response.Content.ReadAsStringAsync();

            var userInfo = JsonSerializer.Deserialize<GitHubUserInfo>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return userInfo;
        }

    }
}

