using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context)
        {
            // Return if there any users in the database
            if (await context.Users.AnyAsync()) return;

            // Load the seed data
            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            // Create a password and hash for each user
            foreach(var user in users)
            {
                user.UserName = user.UserName.ToLower();
                context.Users.Add(user);
            }

            await context.SaveChangesAsync();
        }
    }
}