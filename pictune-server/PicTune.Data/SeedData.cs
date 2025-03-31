using Microsoft.AspNetCore.Identity;
using PicTune.Core.DTOs;
using PicTune.Core.IServices;
using PicTune.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicTune.Data
{
    public class SeedData
    {


        public static async Task Initialize(IServiceProvider serviceProvider, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            string[] roleNames = { "Admin", "Editor", "Viewer" };

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new Role { Name=roleName});
                }
            }

            // Create an admin user
            var user = await userManager.FindByEmailAsync("admin@pictune.com");
            if (user == null)
            {

                user = new User { UserName = "admin", Email = "admin@pictune.com" };
                await userManager.CreateAsync(user, "Admin123!");
                await userManager.AddToRoleAsync(user, "Admin");
            }
        }
    }

}
