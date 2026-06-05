using Agenda.Modules.Users.Domain;

namespace Agenda.Modules.Users.Application.Abstractions;

public interface ITokenService
{
    string Generate(User user);
}
