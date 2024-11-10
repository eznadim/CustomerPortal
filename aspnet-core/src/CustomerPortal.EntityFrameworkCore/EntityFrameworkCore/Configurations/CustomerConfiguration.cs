using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CustomerPortal.Customers;

namespace CustomerPortal.EntityFrameworkCore.Configurations
{
    public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.ToTable(CustomerPortalConsts.DbTablePrefix + "Customers", CustomerPortalConsts.DbSchema);

            builder.HasKey(x => x.Id);

            builder.Property(x => x.CustomerId)
                .IsRequired()
                .HasMaxLength(CustomerConsts.MaxCustomerIdLength);

            builder.Property(x => x.CustomerName)
                .IsRequired()
                .HasMaxLength(CustomerConsts.MaxCustomerNameLength);

            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(CustomerConsts.MaxEmailLength);

            builder.Property(x => x.PasswordHash)
                .IsRequired()
                .HasMaxLength(CustomerConsts.MaxPasswordHashLength);

            // Add unique index for CustomerId and Email
            builder.HasIndex(x => x.CustomerId).IsUnique();
            builder.HasIndex(x => x.Email).IsUnique();
        }
    }
} 