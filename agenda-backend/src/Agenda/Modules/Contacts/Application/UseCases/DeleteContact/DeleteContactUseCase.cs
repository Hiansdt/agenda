using Agenda.Modules.Contacts.Application.Abstractions;
using Agenda.Shared;

namespace Agenda.Modules.Contacts.Application.UseCases.DeleteContact;

public sealed record DeleteContactInput(Guid UserId, Guid ContactId);

public sealed class DeleteContactUseCase(IContactRepository contacts, IUnitOfWork unitOfWork)
{
    public async Task<Result> ExecuteAsync(DeleteContactInput input, CancellationToken cancellationToken)
    {
        var contact = await contacts.GetByIdAsync(input.UserId, input.ContactId, cancellationToken);
        if (contact is null)
        {
            return Result.Failure(new Error("contacts.not_found", "Contact was not found."));
        }

        contacts.Remove(contact);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
