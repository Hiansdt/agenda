using Agenda.Modules.Contacts.Application.Abstractions;
using Agenda.Modules.Contacts.Application.UseCases.ListContacts;
using Agenda.Shared;

namespace Agenda.Modules.Contacts.Application.UseCases.EditContact;

public sealed record EditContactInput(Guid UserId, Guid ContactId, string Name, string Phone, string? Email, string? Address, string? Observations);

public sealed class EditContactUseCase(
    IContactRepository contacts,
    IUnitOfWork unitOfWork,
    IClock clock)
{
    public async Task<Result<ContactOutput>> ExecuteAsync(EditContactInput input, CancellationToken cancellationToken)
    {
        var contact = await contacts.GetByIdAsync(input.UserId, input.ContactId, cancellationToken);
        if (contact is null)
        {
            return Result<ContactOutput>.Failure(new Error("contacts.not_found", "Contact was not found."));
        }

        try
        {
            contact.Edit(input.Name, input.Phone, input.Email, input.Address, input.Observations, clock.UtcNow);
            if (await contacts.ExistsWithSamePhoneAsync(input.UserId, contact.Phone, contact.Id, cancellationToken))
            {
                return Result<ContactOutput>.Failure(new Error("contacts.duplicate_phone", "A contact with this phone already exists."));
            }

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<ContactOutput>.Success(ListContactsUseCase.ToOutput(contact));
        }
        catch (DomainException ex)
        {
            return Result<ContactOutput>.Failure(new Error("contacts.invalid_request", ex.Message));
        }
    }
}
