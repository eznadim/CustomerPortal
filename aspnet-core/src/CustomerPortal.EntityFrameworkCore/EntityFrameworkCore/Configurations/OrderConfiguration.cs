using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CustomerPortal.Orders;

namespace CustomerPortal.EntityFrameworkCore.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<OrderEntity>
    {
        public void Configure(EntityTypeBuilder<OrderEntity> builder)
        {
            builder.ToTable(CustomerPortalConsts.DbTablePrefix + "Orders", CustomerPortalConsts.DbSchema);

            builder.Property(x => x.OrderNumber)
                .IsRequired()
                .HasMaxLength(OrderConsts.MaxOrderNumberLength);

            builder.Property(x => x.Description)
                .IsRequired()
                .HasMaxLength(OrderConsts.MaxDescriptionLength);

            builder.Property(x => x.OrderDate)
                .IsRequired();

            builder.Property(x => x.Status)
                .IsRequired();

            builder.Property(x => x.TrackingNumber)
                .HasMaxLength(OrderConsts.MaxTrackingNumberLength)
                .IsRequired(false);

            builder.Property(x => x.ShippedDate)
                .IsRequired(false);

            builder.Property(x => x.DeliveredDate)
                .IsRequired(false);

            builder.HasIndex(x => x.OrderNumber)
                .IsUnique();

            builder.HasIndex(x => x.OrderNumber).IsUnique();
            builder.HasIndex(x => x.CustomerId);
            builder.HasIndex(x => x.Status);

            builder.HasOne(x => x.Customer)
                .WithMany(x => x.Orders)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasIndex(x => x.OrderDate);
        }
    }
} 