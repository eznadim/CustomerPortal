using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using CustomerPortal.EntityFrameworkCore;

namespace CustomerPortal.Customers
{
    public class CustomerRepository : EfCoreRepository<CustomerPortalDbContext, Customer, Guid>, ICustomerRepository
    {
        public CustomerRepository(IDbContextProvider<CustomerPortalDbContext> dbContextProvider)
            : base(dbContextProvider)
        {
        }

        public async Task<Customer> FindByEmailAsync(string email)
        {
            return await (await GetQueryableAsync())
                .FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());
        }

        public async Task<Customer> FindByCustomerIdAsync(Guid customerId)
        {
            return await (await GetQueryableAsync())
                .FirstOrDefaultAsync(x => x.CustomerId == customerId);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await (await GetQueryableAsync())
                .AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }

        public async Task<List<Customer>> GetListAsync(
            string filter = null,
            bool? isActive = null,
            string sorting = null,
            int skipCount = 0,
            int maxResultCount = 10)
        {
            var query = await GetQueryableAsync();
            
            query = ApplyFilter(query, filter, isActive);
            query = ApplySorting(query, sorting);
            query = ApplyPaging(query, skipCount, maxResultCount);

            return await query.ToListAsync();
        }

        public async Task<int> GetCountAsync(string filter = null, bool? isActive = null)
        {
            var query = await GetQueryableAsync();
            query = ApplyFilter(query, filter, isActive);
            return await query.CountAsync();
        }

        public async Task<bool> CustomerIdExistsAsync(Guid customerId)
        {
            return await (await GetQueryableAsync())
                .AnyAsync(x => x.CustomerId == customerId);
        }

        public async Task<Customer> GetByIdWithDetailsAsync(Guid id)
        {
            var query = await GetQueryableAsync();
            return await query
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        private static IQueryable<Customer> ApplyFilter(
            IQueryable<Customer> query,
            string filter,
            bool? isActive)
        {
            if (!string.IsNullOrWhiteSpace(filter))
            {
                filter = filter.ToLower();
                query = query.Where(x =>
                    x.CustomerName.ToLower().Contains(filter) ||
                    x.Email.ToLower().Contains(filter) ||
                    x.CustomerId.ToString().Contains(filter)
                );
            }

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            return query;
        }

        private static IQueryable<Customer> ApplySorting(
            IQueryable<Customer> query,
            string sorting)
        {
            if (string.IsNullOrWhiteSpace(sorting))
            {
                sorting = "creationTime DESC";
            }

            return query.OrderBy(sorting);
        }

        private static IQueryable<Customer> ApplyPaging(
            IQueryable<Customer> query,
            int skipCount,
            int maxResultCount)
        {
            return query
                .Skip(skipCount)
                .Take(maxResultCount);
        }
    }
} 