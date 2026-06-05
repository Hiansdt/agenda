using Agenda.Modules.Contacts.Domain;
using Agenda.Shared;

namespace Agenda.Tests.Modules.Contacts;

public sealed class ContactTests
{
    [Fact]
    public void Create_NormalizesValues()
    {
        var contact = Contact.Create(Guid.NewGuid(), "  Ana  ", " 123 ", " ANA@example.COM ", " Rua A ", "Gosta de pizza", DateTimeOffset.UtcNow);

        Assert.Equal("Ana", contact.Name);
        Assert.Equal("123", contact.Phone);
        Assert.Equal("ana@example.com", contact.Email);
        Assert.Equal("Gosta de pizza", contact.Observations);
        Assert.Equal("Rua A", contact.Address);
    }

    [Fact]
    public void Create_RejectsEmptyPhone()
    {
        Assert.Throws<DomainException>(() =>
            Contact.Create(Guid.NewGuid(), "Ana", " ", null, null, null, DateTimeOffset.UtcNow));
    }
}
