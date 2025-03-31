using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicTune.Core.DTOs
{
    public class ResetPasswordRequestDto
    {
        public string Email { get; set; }
        public string UserName { get; set; }
    }

    public class SongLinkRequestDto
    {
        public string Email { get; set; }
        public string SongUrl { get; set; }
    }

    public class EmailResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
    public class ResetPasswordModel
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }

}
