using Microsoft.Extensions.Configuration;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using DotNetEnv;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace PicTune.Service.Services
{
    public class EmailService : IEmailService
    {
        private readonly string _gmailUsername;
        private readonly string _gmailAppPassword;

        public EmailService()
        {
            _gmailUsername = Env.GetString("GMAIL_USERNAME");
            _gmailAppPassword = Env.GetString("GMAIL_APP_PASSWORD");
        }
        public async Task<EmailResponseDto> SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            try
            {
                var email = new MimeMessage();
                // הגדרת השולח: חשוב שהכתובת תהיה חשבון הג'ימייל שלך (_gmailUsername)
                email.From.Add(new MailboxAddress("PicTune", _gmailUsername));
                // הגדרת הנמען
                email.To.Add(new MailboxAddress("", toEmail));
                email.Subject = subject;

                // יצירת גוף המייל בפורמט HTML
                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = htmlBody,
                    TextBody = "View this email in HTML format" // גרסת טקסט פשוטה כגיבוי למקרה ש-HTML לא נתמך
                };

                email.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    // חיבור לשרת ה-SMTP של גוגל
                    // פורט 587 עם StartTls הוא התצורה הסטנדרטית והמומלצת
                    await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);

                    // אימות מול חשבון הגוגל באמצעות סיסמת היישום
                    await client.AuthenticateAsync(_gmailUsername, _gmailAppPassword);

                    // שליחת המייל
                    await client.SendAsync(email);
                    // ניתוק מהשרת
                    await client.DisconnectAsync(true);

                    return new EmailResponseDto
                    {
                        Success = true,
                        Message = "Email sent successfully."
                    };
                }
            }
            catch (MailKit.Security.AuthenticationException authEx)
            {
                // שגיאת אימות: לרוב מצביע על בעיה ב-username או ב-App Password
                return new EmailResponseDto
                {
                    Success = false,
                    Message = $"Authentication failed: {authEx.Message}. Make sure you are using an App Password."
                };
            }
            catch (Exception ex)
            {
                // טיפול בשגיאות כלליות אחרות
                return new EmailResponseDto
                {
                    Success = false,
                    Message = $"Failed to send email: {ex.Message}"
                };
            }
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
