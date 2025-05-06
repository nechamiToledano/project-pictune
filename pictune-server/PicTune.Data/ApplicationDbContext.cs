using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PicTune.Core.Models;
using PicTune.Data.Models;

namespace PicTune.Data
{
    // ApplicationDbContext should inherit only from IdentityDbContext<User, Role, string>
    public class ApplicationDbContext : IdentityDbContext<User, Role, string>
    {
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<MusicFile> MusicFiles { get; set; }
        public DbSet<Playlist> Playlists { get; internal set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); 
            // Ensure that Identity model creating logic is executed

            // Customizing relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithMany();


            modelBuilder.Entity<Role>()
                .HasMany(r => r.Permissions)
                .WithMany();
        
            
        

    }
}
}
