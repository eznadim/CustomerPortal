using System;
using Volo.Abp.Application.Dtos;

namespace CustomerPortal.Orders.Dtos
{
    public class GetOrderListDto : PagedAndSortedResultRequestDto
    {
        public string? Filter { get; set; }
        public OrderStatus? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string CustomerName { get; set; }
        public Guid? CustomerId { get; set; }
    }
} 