using Agenda.Infrastructure.Persistence;
using Agenda.Modules.Contacts.Application.Abstractions;
using Agenda.Modules.Contacts.Domain;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text;

namespace Agenda.Modules.Contacts.Infrastructure;

public sealed class ContactRepository(AppDbContext dbContext) : IContactRepository
{
    public async Task<(IReadOnlyList<Contact> Items, int Total)> GetPagedAsync(
        Guid userId,
        int page,
        int pageSize,
        string? search,
        CancellationToken cancellationToken)
    {
        var query = dbContext.Contacts
            .AsNoTracking()
            .Where(contact => contact.UserId == userId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = NormalizeSearchValue(search);
            var filteredItems = (await query
                    .OrderBy(contact => contact.Name)
                    .ThenBy(contact => contact.Id)
                    .ToListAsync(cancellationToken))
                .Where(contact =>
                    NormalizeSearchValue(contact.Name).Contains(normalizedSearch) ||
                    NormalizeSearchValue(contact.Phone).Contains(normalizedSearch) ||
                    NormalizeSearchValue(contact.Email).Contains(normalizedSearch))
                .ToList();

            return (
                filteredItems.Skip((page - 1) * pageSize).Take(pageSize).ToList(),
                filteredItems.Count);
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderBy(contact => contact.Name)
            .ThenBy(contact => contact.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, total);
    }

    public Task<Contact?> GetByIdAsync(Guid userId, Guid contactId, CancellationToken cancellationToken) =>
        dbContext.Contacts.FirstOrDefaultAsync(contact => contact.UserId == userId && contact.Id == contactId, cancellationToken);

    public Task<bool> ExistsWithSamePhoneAsync(Guid userId, string phone, Guid? excludeContactId, CancellationToken cancellationToken)
    {
        var query = dbContext.Contacts
            .AsNoTracking()
            .Where(contact => contact.UserId == userId && contact.Phone == phone);

        if (excludeContactId.HasValue)
        {
            query = query.Where(contact => contact.Id != excludeContactId.Value);
        }

        return query.AnyAsync(cancellationToken);
    }

    public void Add(Contact contact) => dbContext.Contacts.Add(contact);

    public void Remove(Contact contact) => dbContext.Contacts.Remove(contact);

    private static string NormalizeSearchValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var normalizedString = value.Trim().Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder(normalizedString.Length);

        foreach (var ch in normalizedString)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(ch) != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(ch);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();
    }
}
