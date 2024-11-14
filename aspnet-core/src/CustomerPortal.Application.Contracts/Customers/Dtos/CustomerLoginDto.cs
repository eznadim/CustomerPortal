using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Customers.Dtos
{
    public class CustomerLoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
} 