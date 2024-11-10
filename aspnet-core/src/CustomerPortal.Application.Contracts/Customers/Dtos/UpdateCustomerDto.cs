using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Customers.Dtos
{
    public class UpdateCustomerDto
    {
        [Required]
        [StringLength(CustomerConsts.MaxCustomerNameLength)]
        public string CustomerName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(CustomerConsts.MaxEmailLength)]
        public string Email { get; set; }

        [StringLength(CustomerConsts.MaxAddressLength)]
        public string Address { get; set; }

        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
