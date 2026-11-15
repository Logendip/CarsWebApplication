
using System.Text;
using System.Text.Encodings.Web;
using Cars.API.DTOs;
using Cars.API.Services;
using Cars.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Mvc;

namespace Cars.API.Controllers;

public class AccountController : BaseApiController
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public AccountController(
        UserManager<AppUser> userManager,
        ITokenService tokenService,
        IEmailService emailService,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _emailService = emailService;
        _configuration = configuration;
    }

    private async Task<UserDto> CreateUserDtoAsync(AppUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var token = await _tokenService.CreateTokenAsync(user);

        return new UserDto(
            user.Id,
            user.UserName ?? string.Empty,
            user.Email ?? string.Empty,
            token,
            roles.ToArray());
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        var user = new AppUser
        {
            UserName = registerDto.UserName.Trim(),
            Email = registerDto.Email.Trim()
        };

        var result = await _userManager.CreateAsync(
            user,
            registerDto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        var roleResult = await _userManager.AddToRoleAsync(user, "User");

        if (!roleResult.Succeeded)
        {
            return BadRequest(roleResult.Errors);
        }

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        var encodedToken = WebEncoders.Base64UrlEncode(
            Encoding.UTF8.GetBytes(token));

        var baseUrl = _configuration["Client:BaseUrl"]?.TrimEnd('/');

        if (string.IsNullOrWhiteSpace(baseUrl))
        {
            return StatusCode(500, "Client:BaseUrl is not configured.");
        }

        var confirmationUrl =
            $"{baseUrl}/confirm-email" +
            $"?userId={Uri.EscapeDataString(user.Id)}" +
            $"&token={Uri.EscapeDataString(encodedToken)}";

        var safeUrl = HtmlEncoder.Default.Encode(confirmationUrl);

        var htmlBody = $"""
            <h2>Підтвердження електронної пошти</h2>
            <p>Для підтвердження електронної пошти перейдіть за посиланням:</p>
            <a href="{safeUrl}">Підтвердити email</a>
            """;

        await _emailService.SendAsync(
            user.Email!,
            "Підтвердження реєстрації Cars",
            htmlBody);

        return Ok(new
        {
            message = "Registration successful. Check your email to confirm your account."
        });
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(
        [FromQuery] string userId,
        [FromQuery] string token)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return BadRequest("Invalid user.");
        }

        var decodedToken = Encoding.UTF8.GetString(
            WebEncoders.Base64UrlDecode(token));

        var result = await _userManager.ConfirmEmailAsync(
            user,
            decodedToken);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new
        {
            message = "Email confirmed successfully."
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(
            loginDto.Email.Trim());

        if (user == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        var passwordValid = await _userManager.CheckPasswordAsync(
            user,
            loginDto.Password);

        if (!passwordValid)
        {
            return Unauthorized("Invalid email or password.");
        }

        if (!user.EmailConfirmed)
        {
            return Unauthorized("Please confirm your email first.");
        }

        var userDto = await CreateUserDtoAsync(user);

        return Ok(userDto);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(
        ForgotPasswordDto forgotPasswordDto)
    {
        var user = await _userManager.FindByEmailAsync(
            forgotPasswordDto.Email.Trim());

        if (user != null && user.EmailConfirmed)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var encodedToken = WebEncoders.Base64UrlEncode(
                Encoding.UTF8.GetBytes(token));

            var baseUrl = _configuration["Client:BaseUrl"]?.TrimEnd('/');

            if (string.IsNullOrWhiteSpace(baseUrl))
            {
                return StatusCode(500, "Client:BaseUrl is not configured.");
            }

            var resetUrl =
                $"{baseUrl}/reset-password" +
                $"?email={Uri.EscapeDataString(user.Email!)}" +
                $"&token={Uri.EscapeDataString(encodedToken)}";

            var safeUrl = HtmlEncoder.Default.Encode(resetUrl);

            var htmlBody = $"""
                <h2>Відновлення пароля</h2>
                <p>Для встановлення нового пароля перейдіть за посиланням:</p>
                <a href="{safeUrl}">Відновити пароль</a>
                """;

            await _emailService.SendAsync(
                user.Email!,
                "Відновлення пароля Cars",
                htmlBody);
        }

        return Ok(new
        {
            message = "If the account exists, a password reset link has been sent."
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        ResetPasswordDto resetPasswordDto)
    {
        var user = await _userManager.FindByEmailAsync(
            resetPasswordDto.Email.Trim());

        if (user == null)
        {
            return BadRequest("Invalid password reset request.");
        }

        var decodedToken = Encoding.UTF8.GetString(
            WebEncoders.Base64UrlDecode(resetPasswordDto.Token));

        var result = await _userManager.ResetPasswordAsync(
            user,
            decodedToken,
            resetPasswordDto.NewPassword);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new
        {
            message = "Password has been reset successfully."
        });
    }
}
