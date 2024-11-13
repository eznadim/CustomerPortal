using System;
using Volo.Abp.Application.Dtos;

namespace CustomerPortal.Orders.Dtos
{
    public class GetOrderListDto : PagedAndSortedResultRequestDto
    {
        public string? Filter { get; set; }
        public OrderStatus? Status { get; set; }
        public string? StatusString { get; set; }
        public int? StatusNumber { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? CustomerName { get; set; }
        public string? Description { get; set; }
        public Guid? CustomerId { get; set; }
        public string? OrderNumber { get; set; }
        public string? CustomerEmail { get; set; }
        public DateTime? OrderDate { get; set;}
    }
} 