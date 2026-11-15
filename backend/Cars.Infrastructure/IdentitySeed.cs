
using Cars.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Cars.Infrastructure;

public static class IdentitySeed
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();

        string[] roles = { "User", "Admin" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                var roleResult = await roleManager.CreateAsync(
                    new IdentityRole(role));

                if (!roleResult.Succeeded)
                {
                    throw new InvalidOperationException(
                        string.Join("; ", roleResult.Errors.Select(e => e.Description)));
                }
            }
        }

        const string adminEmail = "admin@cars.local";
        const string adminPassword = "Admin123!";

        var admin = await userManager.FindByEmailAsync(adminEmail);

        if (admin == null)
        {
            admin = new AppUser
            {
                UserName = "admin",
                Email = adminEmail,
                EmailConfirmed = true
            };

            var createResult = await userManager.CreateAsync(
                admin,
                adminPassword);

            if (!createResult.Succeeded)
            {
                throw new InvalidOperationException(
                    string.Join("; ", createResult.Errors.Select(e => e.Description)));
            }
        }
        else if (!admin.EmailConfirmed)
        {
            admin.EmailConfirmed = true;

            var updateResult = await userManager.UpdateAsync(admin);

            if (!updateResult.Succeeded)
            {
                throw new InvalidOperationException(
                    string.Join("; ", updateResult.Errors.Select(e => e.Description)));
            }
        }

        if (!await userManager.IsInRoleAsync(admin, "Admin"))
        {
            var addRoleResult = await userManager.AddToRoleAsync(admin, "Admin");

            if (!addRoleResult.Succeeded)
            {
                throw new InvalidOperationException(
                    string.Join("; ", addRoleResult.Errors.Select(e => e.Description)));
            }
        }
    }
}
