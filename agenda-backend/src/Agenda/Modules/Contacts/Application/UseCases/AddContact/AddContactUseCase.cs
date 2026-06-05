using Agenda.Modules.Contacts.Application.Abstractions;
using Agenda.Modules.Contacts.Application.UseCases.ListContacts;
using Agenda.Modules.Contacts.Domain;
using Agenda.Shared;

namespace Agenda.Modules.Contacts.Application.UseCases.AddContact;

public sealed record AddContactInput(Guid UserId, string Name, string Phone, string? Email, string? Address, string? Observations);

public sealed class AddContactUseCase(
    IContactRepository contacts,
    IUnitOfWork unitOfWork,
    IClock clock)
{
    public async Task<Result<ContactOutput>> ExecuteAsync(AddContactInput input, CancellationToken cancellationToken)
    {
        try
        {
            var contact = Contact.Create(input.UserId, input.Name, input.Phone, input.Email, input.Address, input.Observations, clock.UtcNow);
            if (await contacts.ExistsWithSamePhoneAsync(input.UserId, contact.Phone, null, cancellationToken))
            {
                return Result<ContactOutput>.Failure(new Error("contacts.duplicate_phone", "A contact with this phone already exists."));
            }

            contacts.Add(contact);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<ContactOutput>.Success(ListContactsUseCase.ToOutput(contact));
        }
        catch (DomainException ex)
        {
            return Result<ContactOutput>.Failure(new Error("contacts.invalid_request", ex.Message));
        }
    }
}
