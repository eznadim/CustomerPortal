using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Customers.Dtos
{
    public class CreateCustomerDto
    {
        [Required]
        public string CustomerName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }
    }
} 