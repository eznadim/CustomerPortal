using System;
using Volo.Abp.Application.Dtos;

namespace CustomerPortal.Customers.Dtos
{
    public class CustomerDto : EntityDto<Guid>
    {
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime? LastModificationTime { get; set; }
    }
} 