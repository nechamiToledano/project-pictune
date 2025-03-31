using Microsoft.AspNetCore.Identity;


namespace PicTune.Core.Models
{
    public class User:IdentityUser
    {

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }= DateTime.UtcNow;
        public ICollection<Role> Roles { get; set; } = new List<Role>();

    }
}
