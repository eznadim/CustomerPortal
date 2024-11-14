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

            builder.Property(x => x.CustomerName)
                .IsRequired()
                .HasMaxLength(CustomerConsts.MaxCustomerNameLength);

            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(CustomerConsts.MaxEmailLength);

            builder.Property(x => x.PasswordHash)
                .IsRequired()
                .HasMaxLength(CustomerConsts.MaxPasswordHashLength);

            builder.Property(x => x.Address)
                .HasMaxLength(CustomerConsts.MaxAddressLength)
                .IsRequired(false);

            builder.HasIndex(x => x.Email)
                .IsUnique();

            builder.HasMany(x => x.Orders)
                .WithOne(x => x.Customer)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}