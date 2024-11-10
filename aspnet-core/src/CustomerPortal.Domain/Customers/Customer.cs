using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Ardalis.GuardClauses;
using CustomerPortal.Orders;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace CustomerPortal.Customers
{
    public class Customer : FullAuditedAggregateRoot<Guid>
    {
        [StringLength(CustomerConsts.MaxCustomerNameLength)]
        public string CustomerName { get; protected set; }

        [StringLength(CustomerConsts.MaxEmailLength)]
        public string Email { get; protected set; }

        [StringLength(CustomerConsts.MaxPasswordHashLength)]
        public string PasswordHash { get; protected set; }
        
        [StringLength(CustomerConsts.MaxAddressLength)]
        public string? Address { get; protected set; }
        
        public bool IsActive { get; set; }

        // Navigation property for orders
        public virtual ICollection<OrderEntity> Orders { get; protected set; }

        protected Customer()
        {
            Orders = new HashSet<OrderEntity>();
        }

        public Customer(
            string customerName,
            string email,
            string passwordHash,
            string? address = null)
        {
            CustomerName = Guard.Against.NullOrEmpty(customerName, nameof(customerName));
            Email = Guard.Against.NullOrEmpty(email, nameof(email));
            PasswordHash = Guard.Against.NullOrEmpty(passwordHash, nameof(passwordHash));
            Address = address;
            IsActive = true;
            Orders = new HashSet<OrderEntity>();
        }

        public void UpdateCustomerInfo(string customerName, string email, string? address)
        {
            CustomerName = Guard.Against.NullOrEmpty(customerName, nameof(customerName));
            Email = Guard.Against.NullOrEmpty(email, nameof(email));
            
            if (!email.Contains("@"))
            {
                throw new BusinessException("CustomerPortal:InvalidEmailFormat");
            }

            Address = address;
        }

        public void UpdatePassword(string newPasswordHash)
        {
            PasswordHash = Guard.Against.NullOrEmpty(newPasswordHash, nameof(newPasswordHash));
        }
    }
} 