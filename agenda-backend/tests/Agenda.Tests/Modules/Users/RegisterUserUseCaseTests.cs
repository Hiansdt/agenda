using Agenda.Modules.Users.Application.Abstractions;
using Agenda.Modules.Users.Application.UseCases.RegisterUser;
using Agenda.Modules.Users.Domain;
using Agenda.Shared;

namespace Agenda.Tests.Modules.Users;

public sealed class RegisterUserUseCaseTests
{
    [Fact]
    public async Task ExecuteAsync_RejectsDuplicateEmail()
    {
        var users = new FakeUserRepository();
        users.Add(User.Register("Maria", "maria@example.com", "hash", DateTimeOffset.UtcNow));
        var useCase = new RegisterUserUseCase(users, new FakePasswordService(), new FakeUnitOfWork(), new FixedClock());

        var result = await useCase.ExecuteAsync(new RegisterUserInput("Maria", "MARIA@example.com", "password123"), CancellationToken.None);

        Assert.True(result.IsFailure);
        Assert.Equal("users.email_in_use", result.Error.Code);
    }

    private sealed class FakeUserRepository : IUserRepository
    {
        private readonly List<User> _users = [];

        public Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
            Task.FromResult(_users.FirstOrDefault(user => user.Id == id));

        public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken) =>
            Task.FromResult(_users.FirstOrDefault(user => user.Email == email.Trim().ToLowerInvariant()));

        public Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken) =>
            Task.FromResult(_users.Any(user => user.Id == id));

        public void Add(User user) => _users.Add(user);
    }

    private sealed class FakePasswordService : IPasswordService
    {
        public string Hash(string password) => $"hashed-{password}";
        public bool Verify(string password, string passwordHash) => passwordHash == Hash(password);
    }

    private sealed class FakeUnitOfWork : IUnitOfWork
    {
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken) => Task.FromResult(1);
    }

    private sealed class FixedClock : IClock
    {
        public DateTimeOffset UtcNow => new(2026, 6, 5, 0, 0, 0, TimeSpan.Zero);
    }
}
