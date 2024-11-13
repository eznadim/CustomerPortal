using System;
using System.ComponentModel.DataAnnotations;
using CustomerPortal.Customers;
using Volo.Abp.Domain.Entities.Auditing;

namespace CustomerPortal.Orders
{
    public class OrderEntity : FullAuditedAggregateRoot<Guid>
    {
        [Required]
        [StringLength(OrderConsts.MaxOrderNumberLength)]
        public string OrderNumber { get; protected set; }

        [Required]
        [StringLength(OrderConsts.MaxDescriptionLength)]
        public string Description { get; protected set; }

        [Required]
        public DateTime OrderDate { get; protected set; }

        [Required]
        public OrderStatus Status { get; protected set; }

        [Required]
        public Guid CustomerId { get; protected set; }

        public virtual Customer Customer { get; protected set; }

        protected OrderEntity() { }

        public OrderEntity(
            Guid id,
            Guid customerId,
            string orderNumber,
            string description)
            : base(id)
        {
            SetOrder(customerId, orderNumber, description);
        }

        private void SetOrder(Guid customerId, string orderNumber, string description)
        {
            CustomerId = customerId;
            OrderNumber = orderNumber;
            Description = description;
            OrderDate = DateTime.Now;
            Status = OrderStatus.Pending;
        }

        public void UpdateStatus(OrderStatus newStatus)
        {
            if (Status == OrderStatus.Cancelled)
            {
                throw new InvalidOperationException("Cannot update status of cancelled order");
            }

            Status = newStatus;
        }
    }
} 