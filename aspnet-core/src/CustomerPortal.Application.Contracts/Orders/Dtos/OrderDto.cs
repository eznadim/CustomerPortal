using System;
using Volo.Abp.Application.Dtos;

namespace CustomerPortal.Orders.Dtos
{
    public class OrderDto : AuditedEntityDto<Guid>
    {
        public string OrderNumber { get; set; }
        public string Description { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public string StatusString => Status.ToString();
        public DateTime? LastModificationTime { get; set; }
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
    }
} 