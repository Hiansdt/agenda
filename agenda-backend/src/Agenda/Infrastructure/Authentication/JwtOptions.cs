namespace Agenda.Infrastructure.Authentication;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; init; } = "Agenda";
    public string Audience { get; init; } = "Agenda";
    public string SecretKey { get; init; } = "dev-signing-key-change-me-with-at-least-32-chars";
    public int ExpiresInMinutes { get; init; } = 60;
}
