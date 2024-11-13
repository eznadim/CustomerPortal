using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CustomerPortal.Orders.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CustomerPortal.Orders
{
    public interface IOrderService : IApplicationService
    {
        Task<OrderDto> GetAsync(Guid id);
        Task<PagedResultDto<OrderDto>> GetOrderListAdminAsync(GetOrderListDto input);
        Task<PagedResultDto<OrderDto>> GetOrderListPublicAsync(Guid id,GetOrderListDto input);
        Task<OrderDto> CreateAsync(CreateUpdateOrderDto input);
        Task<OrderDto> UpdateStatusAsync(Guid id, UpdateOrderStatusDto input);
        Task DeleteAsync(Guid id);
        Task<OrderDto> CancelOrderAsync(Guid id);
    }
} 