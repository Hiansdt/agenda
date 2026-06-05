namespace Agenda.Shared;

public interface IClock
{
    DateTimeOffset UtcNow { get; }
}
