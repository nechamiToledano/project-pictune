using PicTune.Core.DTOs;

namespace PicTune.Core.IServices
{
    public interface IEmailService
    {
        Task<EmailResponseDto> SendEmailAsync(string toEmail, string subject, string body);
        Task<EmailResponseDto> SendPasswordResetEmailAsync(ResetPasswordRequestDto request,string resetLink);
        Task<EmailResponseDto> SendSongLinkEmailAsync(SongLinkRequestDto request);
    }

}