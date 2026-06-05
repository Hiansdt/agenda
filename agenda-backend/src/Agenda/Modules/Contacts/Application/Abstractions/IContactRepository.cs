using Agenda.Modules.Contacts.Domain;

namespace Agenda.Modules.Contacts.Application.Abstractions;

public interface IContactRepository
{
    Task<(IReadOnlyList<Contact> Items, int Total)> GetPagedAsync(Guid userId, int page, int pageSize, string? search, CancellationToken cancellationToken);
    Task<Contact?> GetByIdAsync(Guid userId, Guid contactId, CancellationToken cancellationToken);
    Task<bool> ExistsWithSamePhoneAsync(Guid userId, string phone, Guid? excludeContactId, CancellationToken cancellationToken);
    void Add(Contact contact);
    void Remove(Contact contact);
}
