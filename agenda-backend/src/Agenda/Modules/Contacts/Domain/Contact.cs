using Agenda.Shared;

namespace Agenda.Modules.Contacts.Domain;

public sealed class Contact
{
    private Contact()
    {
        Name = string.Empty;
        Phone = string.Empty;
    }

    private Contact(
        Guid id,
        Guid userId,
        string name,
        string phone,
        string? email,
        string? address,
        string? observations,
        DateTimeOffset createdAtUtc)
    {
        Id = id;
        UserId = userId;
        Name = name;
        Phone = phone;
        Email = email;
        Address = address;
        Observations = observations;
        CreatedAtUtc = createdAtUtc;
        UpdatedAtUtc = createdAtUtc;
    }

    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Name { get; private set; }
    public string Phone { get; private set; }
    public string? Email { get; private set; }
    public string? Address { get; private set; }
    public string? Observations {get; private set;}
    public DateTimeOffset CreatedAtUtc { get; private set; }
    public DateTimeOffset UpdatedAtUtc { get; private set; }

    public static Contact Create(
        Guid userId,
        string name,
        string phone,
        string? email,
        string? address,
        string? observations,
        DateTimeOffset createdAtUtc)
    {
        if (userId == Guid.Empty)
        {
            throw new DomainException("User id is required.");
        }

        return new Contact(
            Guid.NewGuid(),
            userId,
            NormalizeRequired(name, 120, "Name"),
            NormalizeRequired(phone, 40, "Phone"),
            NormalizeOptionalEmail(email),
            NormalizeOptional(address, 200, "Address"),
            NormalizeOptional(observations, 400, "Observations"),
            createdAtUtc);
    }

    public void Edit(string name, string phone, string? email, string? address, string? observations, DateTimeOffset updatedAtUtc)
    {
        Name = NormalizeRequired(name, 120, "Name");
        Phone = NormalizeRequired(phone, 40, "Phone");
        Email = NormalizeOptionalEmail(email);
        Address = NormalizeOptional(address, 200, "Address");
        Observations = NormalizeOptional(observations, 400, "Observations");
        UpdatedAtUtc = updatedAtUtc;
    }

    private static string NormalizeRequired(string value, int maxLength, string fieldName)
    {
        var normalized = value.Trim();
        if (string.IsNullOrWhiteSpace(normalized) || normalized.Length > maxLength)
        {
            throw new DomainException($"{fieldName} is required and must be at most {maxLength} characters.");
        }

        return normalized;
    }

    private static string? NormalizeOptional(string? value, int maxLength, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var normalized = value.Trim();
        if (normalized.Length > maxLength)
        {
            throw new DomainException($"{fieldName} must be at most {maxLength} characters.");
        }

        return normalized;
    }

    private static string? NormalizeOptionalEmail(string? value)
    {
        var normalized = NormalizeOptional(value, 180, "Email")?.ToLowerInvariant();
        if (normalized is not null && !normalized.Contains('@'))
        {
            throw new DomainException("Email is invalid.");
        }

        return normalized;
    }

}
