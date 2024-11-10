using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using CustomerPortal.EntityFrameworkCore;

namespace CustomerPortal.Orders
{
    public class OrderRepository : EfCoreRepository<CustomerPortalDbContext, OrderEntity, Guid>, IOrderRepository
    {
        public OrderRepository(IDbContextProvider<CustomerPortalDbContext> dbContextProvider)
            : base(dbContextProvider)
        {
        }

        public async Task<OrderEntity> GetOrderWithDetailsAsync(Guid id)
        {
            var dbSet = await GetDbSetAsync();
            return await dbSet
                .Include(x => x.Customer)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<OrderEntity>> GetCustomerOrdersAsync(Guid customerId)
        {
            var dbSet = await GetDbSetAsync();
            return await dbSet
                .Include(x => x.Customer)
                .Where(x => x.CustomerId == customerId)
                .OrderByDescending(x => x.OrderDate)
                .ToListAsync();
        }

        public async Task<string> GenerateOrderNumberAsync()
        {
            var dbSet = await GetDbSetAsync();
            var lastOrder = await dbSet
                .OrderByDescending(x => x.OrderNumber)
                .FirstOrDefaultAsync();

            if (lastOrder == null)
            {
                return $"ORD-{DateTime.Now:yyyyMMdd}-0001";
            }

            var parts = lastOrder.OrderNumber.Split('-');
            if (parts.Length != 3)
            {
                return $"ORD-{DateTime.Now:yyyyMMdd}-0001";
            }

            var currentDate = DateTime.Now.ToString("yyyyMMdd");
            if (parts[1] != currentDate)
            {
                return $"ORD-{currentDate}-0001";
            }

            var sequence = int.Parse(parts[2]) + 1;
            return $"ORD-{currentDate}-{sequence:D4}";
        }

        public async Task<OrderEntity> GetAsync(Guid id)
        {
            var dbSet = await GetDbSetAsync();
            return await dbSet.FindAsync(id);
        }
    }
} 