using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using CustomerPortal.Customers;
using CustomerPortal.EntityFrameworkCore.Configurations;

namespace CustomerPortal.EntityFrameworkCore
{
    public static class CustomerPortalDbContextModelCreatingExtensions
    {
        public static void ConfigureCustomerPortal(
            this ModelBuilder builder)
        {
            Check.NotNull(builder, nameof(builder));

            // Apply the Customer configuration
            builder.ApplyConfiguration(new CustomerConfiguration());
            builder.ApplyConfiguration(new OrderConfiguration());
        }
    }
} 