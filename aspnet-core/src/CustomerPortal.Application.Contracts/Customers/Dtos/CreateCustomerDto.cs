using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Customers.Dtos
{
    public class CreateCustomerDto
    {
        [Required]
        [StringLength(CustomerConsts.MaxCustomerNameLength)]
        public string CustomerName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(CustomerConsts.MaxEmailLength)]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        [StringLength(CustomerConsts.MaxAddressLength)]
        public string Address { get; set; }
    }
} 