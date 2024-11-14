using CustomerPortal.Orders;
using System;
using Volo.Abp.Application.Dtos;

namespace CustomerPortal.Customers.Dtos
{
    public class CustomerDto : EntityDto<Guid>
    {
        public string CustomerName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public bool IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime? LastModificationTime { get; set; }
        public Guid? OrderId { get; set; }
        public string OrderNo { get; set; }
        public OrderStatus OrderStatus { get; set; }
    }
} 