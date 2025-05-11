using Microsoft.Extensions.Configuration;
using SendGrid.Helpers.Mail;
using SendGrid;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using DotNetEnv;

namespace PicTune.Service.Services
{
    public class EmailService : IEmailService
    {
        private readonly string _sendGridApiKey;
        private readonly string _emailAddress;

        public EmailService()
        {
            _emailAddress = Env.GetString("EMAIL_ADDRESS");
            _sendGridApiKey = Env.GetString("SEND_GRID_API_KEY");
        }

        public async Task<EmailResponseDto> SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var client = new SendGridClient(_sendGridApiKey);
            var from = new EmailAddress(_emailAddress, "PicTune");
            var to = new EmailAddress(toEmail);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, "View this email in HTML format", htmlBody);
            var response = await client.SendEmailAsync(msg);

            return new EmailResponseDto
            {
                Success = response.IsSuccessStatusCode,
                Message = response.IsSuccessStatusCode ? "Email sent successfully." : "Failed to send email."
            };
        }

        public async Task<EmailResponseDto> SendPasswordResetEmailAsync(ResetPasswordRequestDto request, string resetLink)
        {
            
            var subject = "🔐 Reset Your PicTune Password";
            var htmlBody = $@"
                <html>
                <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>
                        <h2 style='color: #D9534F;'>Reset Your Password</h2>
                        <p>Hello,{request.UserName}</p>
                        <p>We received a request to reset your PicTune password. Click the button below to continue:</p>
                        <div style='text-align: center; margin: 30px 0;'>
                            <a href='{resetLink}' style='display: inline-block; background-color: #D9534F; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px;'>🔁 Reset Password</a>
                        </div>
                        <p>If you didn’t request a password reset, just ignore this email.</p>
                        <p style='margin-top: 40px;'>Stay secure,<br/>The PicTune Team</p>
                    </div>
                </body>
                </html>";

            return await SendEmailAsync(request.Email, subject, htmlBody);
        }

        public async Task<EmailResponseDto> SendSongLinkEmailAsync(SongLinkRequestDto request)
        {
          
            
            var subject = "🎶 Your Song from PicTune";
            var htmlBody = $@"
                <html>
                <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>
                        <h2 style='color: #4A90E2;'>🎵 Your Song is Ready!</h2>
                        <p>Hey there,</p>
                        <p>Thanks for using <strong>PicTune</strong>! Click the button below to listen to your song:</p>
                        <div style='text-align: center; margin: 30px 0;'>
                            <a href='{request.SongUrl}' style='display: inline-block; background-color: #4A90E2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px;'>🎧 Listen Now</a>
                        </div>
                        <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                        <p><a href='{request.SongUrl}'>{request.SongUrl}</a></p>
                        <p style='margin-top: 40px;'>Enjoy,<br/>The PicTune Team</p>
                    </div>
                </body>
                </html>";

            return await SendEmailAsync(request.Email, subject, htmlBody);
        }
    }
}
