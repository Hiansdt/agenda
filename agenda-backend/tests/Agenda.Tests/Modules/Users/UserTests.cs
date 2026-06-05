using Agenda.Modules.Users.Domain;
using Agenda.Shared;

namespace Agenda.Tests.Modules.Users;

public sealed class UserTests
{
    [Fact]
    public void Register_NormalizesNameAndEmail()
    {
        var user = User.Register("  Maria  ", " MARIA@example.COM ", "hash", DateTimeOffset.UtcNow);

        Assert.Equal("Maria", user.Name);
        Assert.Equal("maria@example.com", user.Email);
        Assert.NotEqual(Guid.Empty, user.Id);
    }

    [Fact]
    public void Register_RejectsInvalidEmail()
    {
        Assert.Throws<DomainException>(() =>
            User.Register("Maria", "invalid", "hash", DateTimeOffset.UtcNow));
    }
}
