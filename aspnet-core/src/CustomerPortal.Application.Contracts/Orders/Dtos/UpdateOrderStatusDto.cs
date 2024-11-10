using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Orders.Dtos
{
    public class UpdateOrderStatusDto
    {
        [Required]
        public OrderStatus Status { get; set; }
        
        public string? TrackingNumber { get; set; }
    }
} 