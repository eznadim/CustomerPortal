using System;
using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Orders.Dtos
{
    public class CreateUpdateOrderDto
    {
        [Required]
        [StringLength(OrderConsts.MaxDescriptionLength)]
        public string Description { get; set; }

        [Required]
        public Guid CustomerId { get; set; }
    }
} 