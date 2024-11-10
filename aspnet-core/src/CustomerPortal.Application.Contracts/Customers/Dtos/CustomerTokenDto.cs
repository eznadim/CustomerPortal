using System;

namespace CustomerPortal.Customers.Dtos
{
    public class CustomerTokenDto
    {
        public string Token { get; set; }
        public Guid Id { get; set; }
        public string CustomerName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
    }
} 