using Ardalis.GuardClauses;
using CustomerPortal.Customers;
using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

public class Customer : FullAuditedAggregateRoot<Guid>
{
    [StringLength(CustomerConsts.MaxCustomerIdLength)]
    public Guid CustomerId { get; protected set; }

    [StringLength(CustomerConsts.MaxCustomerNameLength)]
    public string CustomerName { get; protected set; }

    [StringLength(CustomerConsts.MaxEmailLength)]
    public string Email { get; protected set; }

    [StringLength(CustomerConsts.MaxPasswordHashLength)]
    public string PasswordHash { get; protected set; }
    
    public DateTime CreationTime { get; protected set; }
    public bool IsActive { get; set; }

    public Customer()
        {

        }

        public Customer(Guid customerId,string customerName,string email,string passwordHash, DateTime creationTime)
        {
            CustomerId = customerId;
            CustomerName = customerName;
            Email = email;
            PasswordHash = passwordHash;
            CreationTime = creationTime;
    }

    public void UpdateCustomerInfo(string customerName, string email)
    {
        CustomerName = Guard.Against.NullOrEmpty(customerName, nameof(customerName));
        Email = Guard.Against.NullOrEmpty(email, nameof(email));
        
        // You could add additional validation here
        if (!email.Contains("@"))
        {
            throw new BusinessException("CustomerPortal:InvalidEmailFormat");
        }
    }

    public void UpdatePassword(string newPasswordHash)
    {
        PasswordHash = Guard.Against.NullOrEmpty(newPasswordHash, nameof(newPasswordHash));
    }
} 