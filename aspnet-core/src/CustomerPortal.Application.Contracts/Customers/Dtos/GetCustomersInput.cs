using Volo.Abp.Application.Dtos;

namespace CustomerPortal.Customers.Dtos
{
    public class GetCustomersInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string OrderNo { get; set; }

        public bool? IsActive { get; set; }
    }
} 