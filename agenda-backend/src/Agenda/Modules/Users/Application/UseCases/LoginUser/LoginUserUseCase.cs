using Agenda.Modules.Users.Application.Abstractions;
using Agenda.Shared;

namespace Agenda.Modules.Users.Application.UseCases.LoginUser;

public sealed record LoginUserInput(string Email, string Password);
public sealed record LoginUserOutput(string Token);

public sealed class LoginUserUseCase(
    IUserRepository users,
    IPasswordService passwordService,
    ITokenService tokenService)
{
    private static readonly Error InvalidCredentials = new("users.invalid_credentials", "Email or password is invalid.");

    public async Task<Result<LoginUserOutput>> ExecuteAsync(LoginUserInput input, CancellationToken cancellationToken)
    {
        var normalizedEmail = input.Email.Trim().ToLowerInvariant();
        var user = await users.GetByEmailAsync(normalizedEmail, cancellationToken);

        if (user is null || !passwordService.Verify(input.Password, user.PasswordHash))
        {
            return Result<LoginUserOutput>.Failure(InvalidCredentials);
        }

        return Result<LoginUserOutput>.Success(new LoginUserOutput(tokenService.Generate(user)));
    }
}
