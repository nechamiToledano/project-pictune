using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using PicTune.Core.Models;
using PicTune.Service.Services;
using System.Net;
using System.Security.Claims;

namespace PicTune.API.Controllers
{
    [ApiController]
    [Route("api/email")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        private readonly UserManager<User> _userManager;

        public EmailController(IEmailService emailService, UserManager<User> userManager)
        {
            _emailService = emailService;
            _userManager = userManager;

        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ResetPasswordRequestDto model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.UserName))
            {
                return BadRequest("Invalid email or username.");
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || user.UserName != model.UserName)
            {
                return NotFound("User not found.");
            }

            // Generate reset token
             var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebUtility.UrlEncode(resetToken);


            // Generate reset link manually
            var resetLink = $"https://pictune-ai.vercel.app/reset-password?token={encodedToken}&email={model.Email}";

            // Send the reset link via email
            await _emailService.SendPasswordResetEmailAsync(model, resetLink);

            return Ok("Password reset link has been sent to your email.");
        }


        [Authorize]

        [HttpPost("send-song-link")]
        public async Task<IActionResult> SendSongLink([FromBody] SongLinkRequestDto request)
        {

            var result = await _emailService.SendSongLinkEmailAsync(request);
            return result.Success ? Ok(result) : BadRequest(result);
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Token) || string.IsNullOrEmpty(model.NewPassword))
            {
                return BadRequest("Invalid reset request.");
            }
            var decodedToken = WebUtility.UrlDecode(model.Token);


            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var result = await _userManager.ResetPasswordAsync(user,decodedToken, model.NewPassword);
            if (result.Succeeded) 
            {
                return Ok("Password reset successfully.");
            }

            return BadRequest("Password reset failed.");
        }

    }


}
