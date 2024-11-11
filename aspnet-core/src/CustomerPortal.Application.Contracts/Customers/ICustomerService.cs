using System;
using System.Threading.Tasks;
using CustomerPortal.Customers.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CustomerPortal.Customers
{
    public interface ICustomerService : IApplicationService
    {
        Task<CustomerTokenDto> LoginAsync(CustomerLoginDto input);
        Task<CustomerTokenDto> RegisterAsync(CreateCustomerDto input);
        Task<CustomerDto> GetCurrentCustomerAsync(Guid id);
        public Task UpdateCustomerPassword(UpdatePasswordDto input);
        Task UpdateProfileAsync(UpdateCustomerDto input);
        Task<CustomerDto> GetCustomerByIdAsync(Guid customerId);
        Task DeleteCustomerAsync(Guid customerId);
    }
} 