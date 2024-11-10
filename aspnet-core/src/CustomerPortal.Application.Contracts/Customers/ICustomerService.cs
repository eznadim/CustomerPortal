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
        Task<CustomerTokenDto> GetCurrentCustomerAsync();
        Task UpdateProfileAsync(UpdateCustomerDto input);
        Task<PagedResultDto<CustomerDto>> GetCustomersListAsync(GetCustomersInput input);
        Task<CustomerDto> GetCustomerByIdAsync(Guid customerId);
        Task ActivateCustomerAsync(Guid customerId);
        Task DeactivateCustomerAsync(Guid customerId);
        Task DeleteCustomerAsync(Guid customerId);
    }
} 