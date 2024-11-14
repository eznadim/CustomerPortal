using System.ComponentModel.DataAnnotations;

namespace CustomerPortal.Customers.Dtos
{
    public class UpdateCustomerDto
    {
        [StringLength(CustomerConsts.MaxCustomerNameLength)]
        public string CustomerName { get; set; }
        [EmailAddress]
        [StringLength(CustomerConsts.MaxEmailLength)]
        public string Email { get; set; }

        [StringLength(CustomerConsts.MaxAddressLength)]
        public string Address { get; set; }
    }
}
