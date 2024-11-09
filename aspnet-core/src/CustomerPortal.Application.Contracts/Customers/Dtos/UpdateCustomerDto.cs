using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Customers.Dtos
{
    public class UpdateCustomerDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string CustomerName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(256)]
        public string Email { get; set; }

        // Optional: Add if you want to allow password updates
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
