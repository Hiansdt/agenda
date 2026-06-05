using Agenda.Infrastructure.Persistence;
using Agenda.Modules.Users.Application.Abstractions;
using Agenda.Modules.Users.Domain;
using Microsoft.EntityFrameworkCore;

namespace Agenda.Modules.Users.Infrastructure;

public sealed class UserRepository(AppDbContext dbContext) : IUserRepository
{
    public Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        dbContext.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Id == id, cancellationToken);

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        return dbContext.Users.FirstOrDefaultAsync(user => user.Email == normalizedEmail, cancellationToken);
    }

    public Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken) =>
        dbContext.Users.AsNoTracking().AnyAsync(user => user.Id == id, cancellationToken);

    public void Add(User user) => dbContext.Users.Add(user);
}
