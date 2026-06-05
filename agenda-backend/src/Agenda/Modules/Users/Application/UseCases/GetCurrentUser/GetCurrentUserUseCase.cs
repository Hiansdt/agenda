using Agenda.Modules.Users.Application.Abstractions;
using Agenda.Shared;

namespace Agenda.Modules.Users.Application.UseCases.GetCurrentUser;

public sealed record CurrentUserOutput(Guid Id, string Name, string Email);

public sealed class GetCurrentUserUseCase(IUserRepository users)
{
    public async Task<Result<CurrentUserOutput>> ExecuteAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await users.GetByIdAsync(userId, cancellationToken);
        return user is null
            ? Result<CurrentUserOutput>.Failure(new Error("users.not_found", "Authenticated user was not found."))
            : Result<CurrentUserOutput>.Success(new CurrentUserOutput(user.Id, user.Name, user.Email));
    }
}
