using System.Collections.Generic;
using CustomerPortal.Orders.Dtos;

namespace CustomerPortal.Administrator
{
    public class AdminDashboardDto
    {
        public int TotalCustomers { get; set; }
        public int ActiveCustomers { get; set; }
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int ProcessingOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int CancelledOrders { get; set; }
        public List<OrderDto> RecentOrders { get; set; }
    }
} 