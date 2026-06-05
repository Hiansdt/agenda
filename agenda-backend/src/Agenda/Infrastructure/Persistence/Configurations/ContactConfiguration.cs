using Agenda.Modules.Contacts.Domain;
using Agenda.Modules.Users.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Agenda.Infrastructure.Persistence.Configurations;

public sealed class ContactConfiguration : IEntityTypeConfiguration<Contact>
{
    public void Configure(EntityTypeBuilder<Contact> builder)
    {
        builder.ToTable("contacts");
        builder.HasKey(contact => contact.Id);

        builder.Property(contact => contact.Id).HasColumnName("id");
        builder.Property(contact => contact.UserId).HasColumnName("user_id").IsRequired();
        builder.Property(contact => contact.Name).HasColumnName("name").HasMaxLength(120).IsRequired();
        builder.Property(contact => contact.Phone).HasColumnName("phone").HasMaxLength(40).IsRequired();
        builder.Property(contact => contact.Email).HasColumnName("email").HasMaxLength(180);
        builder.Property(contact => contact.Address).HasColumnName("address").HasMaxLength(200);
        builder.Property(contact => contact.Observations).HasColumnName("observations").HasMaxLength(400);
        builder.Property(contact => contact.CreatedAtUtc).HasColumnName("created_at_utc").IsRequired();
        builder.Property(contact => contact.UpdatedAtUtc).HasColumnName("updated_at_utc").IsRequired();

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(contact => contact.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(contact => contact.UserId);
        builder.HasIndex(contact => new { contact.UserId, contact.Phone }).IsUnique();
    }
}
