using Agenda.Modules.Contacts.Application.Abstractions;
using Agenda.Modules.Contacts.Application.UseCases.AddContact;
using Agenda.Modules.Contacts.Application.UseCases.EditContact;
using Agenda.Modules.Contacts.Application.UseCases.ListContacts;
using Agenda.Modules.Contacts.Domain;
using Agenda.Shared;

namespace Agenda.Tests.Modules.Contacts;

public sealed class ContactUseCaseTests
{
    [Fact]
    public async Task AddContact_RejectsDuplicatePhoneForSameUser()
    {
        var userId = Guid.NewGuid();
        var contacts = new FakeContactRepository();
        contacts.Add(Contact.Create(userId, "Ana", "123", null, null, null, DateTimeOffset.UtcNow));
        var useCase = new AddContactUseCase(contacts, new FakeUnitOfWork(), new FixedClock());

        var result = await useCase.ExecuteAsync(new AddContactInput(userId, "Bia", "123", null, null, null), CancellationToken.None);

        Assert.True(result.IsFailure);
        Assert.Equal("contacts.duplicate_phone", result.Error.Code);
    }

    [Fact]
    public async Task EditContact_CannotEditAnotherUsersContact()
    {
        var ownerId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();
        var contacts = new FakeContactRepository();
        var contact = Contact.Create(otherUserId, "Ana", "123", null, null, null, DateTimeOffset.UtcNow);
        contacts.Add(contact);
        var useCase = new EditContactUseCase(contacts, new FakeUnitOfWork(), new FixedClock());

        var result = await useCase.ExecuteAsync(new EditContactInput(ownerId, contact.Id, "Changed", "999", null, null, null), CancellationToken.None);

        Assert.True(result.IsFailure);
        Assert.Equal("contacts.not_found", result.Error.Code);
    }

    [Fact]
    public async Task ListContacts_ReturnsPagedUserContacts()
    {
        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();
        var contacts = new FakeContactRepository();
        contacts.Add(Contact.Create(userId, "Ana", "111", null, null, null, DateTimeOffset.UtcNow));
        contacts.Add(Contact.Create(userId, "Bia", "222", null, null, null, DateTimeOffset.UtcNow));
        contacts.Add(Contact.Create(otherUserId, "Caio", "333", null, null, null, DateTimeOffset.UtcNow));
        var useCase = new ListContactsUseCase(contacts);

        var result = await useCase.ExecuteAsync(new ListContactsInput(userId, 1, 1, null), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal(2, result.Value!.Total);
        Assert.Equal(2, result.Value.NumPages);
        Assert.Single(result.Value.Items);
    }

    private sealed class FakeContactRepository : IContactRepository
    {
        private readonly List<Contact> _contacts = [];

        public Task<(IReadOnlyList<Contact> Items, int Total)> GetPagedAsync(Guid userId, int page, int pageSize, string? search, CancellationToken cancellationToken)
        {
            var filtered = _contacts
                .Where(contact => contact.UserId == userId)
                .Where(contact => string.IsNullOrWhiteSpace(search) || contact.Name.Contains(search, StringComparison.OrdinalIgnoreCase))
                .OrderBy(contact => contact.Name)
                .ToList();

            return Task.FromResult(((IReadOnlyList<Contact>)filtered.Skip((page - 1) * pageSize).Take(pageSize).ToList(), filtered.Count));
        }

        public Task<Contact?> GetByIdAsync(Guid userId, Guid contactId, CancellationToken cancellationToken) =>
            Task.FromResult(_contacts.FirstOrDefault(contact => contact.UserId == userId && contact.Id == contactId));

        public Task<bool> ExistsWithSamePhoneAsync(Guid userId, string phone, Guid? excludeContactId, CancellationToken cancellationToken) =>
            Task.FromResult(_contacts.Any(contact =>
                contact.UserId == userId &&
                contact.Phone == phone &&
                (!excludeContactId.HasValue || contact.Id != excludeContactId.Value)));

        public void Add(Contact contact) => _contacts.Add(contact);

        public void Remove(Contact contact) => _contacts.Remove(contact);
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
