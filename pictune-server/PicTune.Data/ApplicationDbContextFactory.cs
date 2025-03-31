using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using DotNetEnv;
using PicTune.Core.IServices;

namespace PicTune.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            // Load environment variables from .env
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "../PicTune.API");
            var envPath = Path.Combine(basePath, ".env");

            if (File.Exists(envPath))
            {

                Env.Load(envPath);
            }
            else
            {
                throw new FileNotFoundException($".env file not found at {envPath}");
            }

            // Get connection string from environment variables
            var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("DB_CONNECTION is not set in .env file");
            }

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
