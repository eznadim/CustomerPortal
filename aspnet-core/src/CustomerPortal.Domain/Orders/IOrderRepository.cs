using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace CustomerPortal.Orders
{
    public interface IOrderRepository : IRepository<OrderEntity, Guid>
    {
        Task<OrderEntity> GetOrderWithDetailsAsync(Guid id);
        Task<string> GenerateOrderNumberAsync();
        Task<OrderEntity> GetAsync(Guid id);
    }
} 