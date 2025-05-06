using Amazon.S3;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PicTune.Core.IRepositories;
using PicTune.Core.IServices;
using PicTune.Core.Mapping;
using PicTune.Core.Models;
using PicTune.Data;
using PicTune.Data.Repositories;
using PicTune.Service;
using PicTune.Service.Services;
namespace PicTune.API
{
    public static  class Extension 
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<IAuthService,AuthService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IMusicFileRepository, MusicFileRepository>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IMusicFileService, MusicFileService>();
            services.AddScoped<IPlaylistService, PlaylistService>();
            services.AddScoped<IPlaylistRepository, PlaylistRepository>();
            services.AddScoped<UserManager<User>>();
            services.AddScoped<RoleManager<Role>>();
            services.AddHttpClient<IPlaylistRepository, PlaylistRepository>();
        }


        public static void ServiceDependencyInjector(this IServiceCollection s)
        {
            
            s.AddAutoMapper(typeof(MappingProfile));

            ConfigureServices(s);

        }

    }
}