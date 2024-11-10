using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace CustomerPortal.Customers
{
    public interface ICustomerRepository : IRepository<Customer, Guid>
    {
        Task<Customer> FindByEmailAsync(string email);
        
        Task<Customer> FindByCustomerIdAsync(Guid customerId);
        
        Task<bool> EmailExistsAsync(string email);
        
        Task<bool> CustomerIdExistsAsync(Guid customerId);
        
        Task<Customer> GetByIdWithDetailsAsync(Guid id);
        
        Task<List<Customer>> GetListAsync(
            string filter = null,
            bool? isActive = null,
            string sorting = null,
            int skipCount = 0,
            int maxResultCount = 10);
            
        Task<int> GetCountAsync(
            string filter = null,
            bool? isActive = null);
    }
}