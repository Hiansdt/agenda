namespace Agenda.Infrastructure.Authentication;

public sealed class AuthenticatedUserContext
{
    public Guid UserId { get; private set; }
    public bool HasUser => UserId != Guid.Empty;

    public void SetUserId(Guid userId)
    {
        UserId = userId;
    }
}
