using Agenda.Modules.Users.Application.Abstractions;
using Agenda.Modules.Users.Domain;
using Agenda.Shared;

namespace Agenda.Modules.Users.Application.UseCases.RegisterUser;

public sealed record RegisterUserInput(string Name, string Email, string Password);
public sealed record RegisterUserOutput(Guid Id, string Name, string Email);

public sealed class RegisterUserUseCase(
    IUserRepository users,
    IPasswordService passwordService,
    IUnitOfWork unitOfWork,
    IClock clock)
{
    public async Task<Result<RegisterUserOutput>> ExecuteAsync(RegisterUserInput input, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(input.Password) || input.Password.Length < 8)
            {
                return Result<RegisterUserOutput>.Failure(new Error("users.password_too_short", "Password must be at least 8 characters."));
            }

            var normalizedEmail = input.Email.Trim().ToLowerInvariant();
            var existingUser = await users.GetByEmailAsync(normalizedEmail, cancellationToken);
            if (existingUser is not null)
            {
                return Result<RegisterUserOutput>.Failure(new Error("users.email_in_use", "A user with this email already exists."));
            }

            var user = User.Register(input.Name, normalizedEmail, passwordService.Hash(input.Password), clock.UtcNow);
            users.Add(user);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<RegisterUserOutput>.Success(new RegisterUserOutput(user.Id, user.Name, user.Email));
        }
        catch (DomainException ex)
        {
            return Result<RegisterUserOutput>.Failure(new Error("users.invalid_request", ex.Message));
        }
    }
}
