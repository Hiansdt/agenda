using Agenda.Shared;

namespace Agenda.Modules.Users.Domain;

public sealed class User
{
    private User()
    {
        Name = string.Empty;
        Email = string.Empty;
        PasswordHash = string.Empty;
    }

    private User(Guid id, string name, string email, string passwordHash, DateTimeOffset createdAtUtc)
    {
        Id = id;
        Name = name;
        Email = email;
        PasswordHash = passwordHash;
        CreatedAtUtc = createdAtUtc;
    }

    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; private set; }

    public static User Register(string name, string email, string passwordHash, DateTimeOffset createdAtUtc)
    {
        var normalizedName = name.Trim();
        var normalizedEmail = email.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(normalizedName) || normalizedName.Length > 120)
        {
            throw new DomainException("Name is required and must be at most 120 characters.");
        }

        if (string.IsNullOrWhiteSpace(normalizedEmail) || normalizedEmail.Length > 180 || !normalizedEmail.Contains('@'))
        {
            throw new DomainException("Email is invalid.");
        }

        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            throw new DomainException("Password hash is required.");
        }

        return new User(Guid.NewGuid(), normalizedName, normalizedEmail, passwordHash, createdAtUtc);
    }
}
