using Microsoft.Extensions.Configuration;
using SendGrid.Helpers.Mail;
using SendGrid;
using System;
using System.Collections.Generic;

using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using DotNetEnv;
namespace PicTune.Service.Services
{
    public class EmailService:IEmailService
    {
        private readonly string _sendGridApiKey;

        public EmailService()
        {
            _sendGridApiKey = Env.GetString("SEND_GRID_API_KEY");
        }

        public async Task<EmailResponseDto> SendEmailAsync(string toEmail, string subject, string body)
        {
            var client = new SendGridClient(_sendGridApiKey);
            var from = new EmailAddress("nechami3142@gmail.com", "PicTune");
            var to = new EmailAddress(toEmail);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);
            var response = await client.SendEmailAsync(msg);
            var responseBody = await response.Body.ReadAsStringAsync();
       

            return new EmailResponseDto
            {
                Success = response.IsSuccessStatusCode,
                Message = response.IsSuccessStatusCode ? "Email sent successfully." : "Failed to send email."
            };
        }

        public async Task<EmailResponseDto> SendPasswordResetEmailAsync(ResetPasswordRequestDto request,string resetLink)
        {
        
            var subject = "Password Reset Request";
            var body = $"Click on this link to reset your password: {resetLink}";

            // Example email sending logic
           return  await SendEmailAsync(request.Email, subject, body);
        }

        public async Task<EmailResponseDto> SendSongLinkEmailAsync(SongLinkRequestDto request)
        {
            string body = $"<p>Listen to your song here:</p><a href='{request.SongUrl}'>Play Now</a>";

            return await SendEmailAsync(request.Email, "Your Song from PicTune", body);
        }


    }
}
