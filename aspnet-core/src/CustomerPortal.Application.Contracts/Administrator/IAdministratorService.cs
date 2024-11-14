using System;
using System.Threading.Tasks;
using CustomerPortal.Customers.Dtos;
using CustomerPortal.Orders.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CustomerPortal.Administrator
{
    public interface IAdministratorService : IApplicationService
    {
        Task<PagedResultDto<CustomerDto>> GetCustomersListAsync(GetCustomersInput input);
        Task<CustomerDto> GetCustomerDetailsAsync(Guid customerId);
        Task ActivateCustomerAsync(Guid customerId);
        Task DeactivateCustomerAsync(Guid customerId);
        
        Task<PagedResultDto<OrderDto>> GetOrdersAdminListAsync(GetOrderListDto input);
        Task<OrderDto> GetOrderDetailsAsync(Guid orderId);
        Task<OrderDto> UpdateOrderStatusAsync(Guid orderId, UpdateOrderStatusDto input);
        
        Task<AdminDashboardDto> GetDashboardStatisticsAsync();
    }
} 