using System;

namespace CustomerPortal.Customers.Dtos
{
    public class CustomerTokenDto
    {
        public string Token { get; set; }
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string Email { get; set; }
    }
} 