using Agenda.Modules.Contacts.Application.Abstractions;
using Agenda.Modules.Contacts.Domain;
using Agenda.Shared;

namespace Agenda.Modules.Contacts.Application.UseCases.ListContacts;

public sealed record ListContactsInput(Guid UserId, int Page, int PageSize, string? Search);
public sealed record ContactOutput(Guid Id, string Name, string Phone, string? Email, string? Address, string? Observations);
public sealed record ListContactsOutput(int Page, int PageSize, int Total, int NumPages, IReadOnlyList<ContactOutput> Items);

public sealed class ListContactsUseCase(IContactRepository contacts)
{
    public async Task<Result<ListContactsOutput>> ExecuteAsync(ListContactsInput input, CancellationToken cancellationToken)
    {
        if (input.Page < 1)
        {
            return Result<ListContactsOutput>.Failure(new Error("contacts.invalid_page", "Page must be greater than or equal to 1."));
        }

        if (input.PageSize is < 1 or > 100)
        {
            return Result<ListContactsOutput>.Failure(new Error("contacts.invalid_page_size", "Page size must be between 1 and 100."));
        }

        var (items, total) = await contacts.GetPagedAsync(input.UserId, input.Page, input.PageSize, input.Search, cancellationToken);
        var numPages = (int)Math.Ceiling((double)total / input.PageSize);
        var output = new ListContactsOutput(input.Page, input.PageSize, total, numPages, items.Select(ToOutput).ToList());

        return Result<ListContactsOutput>.Success(output);
    }

    public static ContactOutput ToOutput(Contact contact) =>
        new(contact.Id, contact.Name, contact.Phone, contact.Email, contact.Address, contact.Observations);
}
