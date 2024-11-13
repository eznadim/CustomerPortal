using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using CustomerPortal.Customers.Dtos;
using Microsoft.AspNetCore.Identity;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Linq.Dynamic.Core;
using Microsoft.Extensions.Localization;
using CustomerPortal.Localization;
using static CustomerPortal.Permissions.CustomerPortalPermissions;
using Volo.Abp.Users;
using Volo.Abp.Specifications;

namespace CustomerPortal.Customers
{
    public class CustomerService : CustomerPortalAppService, ICustomerService
    {
        private readonly IConfiguration _configuration;
        private readonly IPasswordHasher<Customer> _passwordHasher;
        private readonly ICustomerRepository _customersRepository;
        private readonly IStringLocalizer<CustomerPortalResource> _localizer;

        public CustomerService(
            IConfiguration configuration,
            IPasswordHasher<Customer> passwordHasher,
            ICustomerRepository customersRepository,
            IStringLocalizer<CustomerPortalResource> localizer)
        {
            _configuration = configuration;
            _passwordHasher = passwordHasher;
            _customersRepository = customersRepository;
            _localizer = localizer;
        }

        public async Task<CustomerTokenDto> LoginAsync(CustomerLoginDto input)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(input.Email) || string.IsNullOrWhiteSpace(input.Password))
            {
                throw new UserFriendlyException("Invalid credentials");
            }

            // Find customer
            var customer = await _customersRepository.FirstOrDefaultAsync(x => x.Email == input.Email);
            if (customer == null)
            {
                throw new UserFriendlyException("Invalid email");
            }

            // Verify password
            var verificationResult = _passwordHasher.VerifyHashedPassword(
                customer, 
                customer.PasswordHash, 
                input.Password
            );

            if (verificationResult == PasswordVerificationResult.Failed)
            {
                throw new UserFriendlyException("Invalid password");
            }

            if (customer.IsActive == false)
            {
                throw new UserFriendlyException("Customer is Deactivated");
            }

            if (customer.IsDeleted == true)
            {
                throw new UserFriendlyException("Customer is Deleted");
            }

            // Generate token
            return await GenerateTokenDtoAsync(customer);
        }

        public async Task<CustomerTokenDto> RegisterAsync(CreateCustomerDto input)
        {
            // Check if email already exists
            var existingCustomer = await _customersRepository.FirstOrDefaultAsync(x => x.Email == input.Email);
            if (existingCustomer != null)
            {
                throw new UserFriendlyException(_localizer["ExistingData"], "", _localizer["Email " + "'" + input.Email + "'" + " already taken."]);
            }

            // Create new customer
            var customer = new Customer(
                input.CustomerName,
                input.Email,
                _passwordHasher.HashPassword(null, input.Password),
                input.Address

            );

            await _customersRepository.InsertAsync(customer);
            await CurrentUnitOfWork.SaveChangesAsync();

            return await GenerateTokenDtoAsync(customer);
        }

        public async Task UpdateCustomerPassword(Guid id,UpdatePasswordDto input)
        {
            var customerId = (await _customersRepository.WithDetailsAsync()).Where(e => e.Id == id).FirstOrDefault();
            // Handle password update if provided
            if (!string.IsNullOrEmpty(input.CurrentPassword) && !string.IsNullOrEmpty(input.NewPassword))
            {

                var customer = await _customersRepository.GetByIdWithDetailsAsync(customerId.Id);
                // Verify current password
                var verificationResult = _passwordHasher.VerifyHashedPassword(
                    customer,
                    customer.PasswordHash,
                    input.CurrentPassword
                );

                if (verificationResult == PasswordVerificationResult.Failed)
                {
                    throw new BusinessException("CustomerPortal:InvalidCurrentPassword");
                }

                // Validate new password (you might want to add more validation rules)
                if (input.NewPassword.Length < 6)
                {
                    throw new BusinessException("CustomerPortal:PasswordTooShort");
                }
                if (input.CurrentPassword == input.NewPassword)
                {
                    throw new UserFriendlyException("Current Password and New Password cannot be the same");
                }

                // Hash and set new password
                var newPasswordHash = _passwordHasher.HashPassword(customer, input.NewPassword);
                customer.UpdatePassword(newPasswordHash);
            }
        }

        public async Task<CustomerDto> UpdateProfileAsync(Guid id,UpdateCustomerDto input)
        {
            var customer = (await _customersRepository.WithDetailsAsync()).Where(e => e.Id == id).FirstOrDefault();
            var allCustomer = (await _customersRepository.WithDetailsAsync()).Where(e => e.Email != customer.Email).Select(e => e.Email).ToList();

            // Check if email is being changed and if it's already in use
            if (allCustomer.Contains(input.Email))
            {
                throw new BusinessException("CustomerPortal:EmailAlreadyExists")
                        .WithData("Email", input.Email);
            }

            customer.UpdateCustomerInfo(input.CustomerName, input.Email, input.Address);

            var customerUpdate = await _customersRepository.UpdateAsync(customer);
            await CurrentUnitOfWork.SaveChangesAsync();
            return ObjectMapper.Map<Customer, CustomerDto>(customerUpdate);
        }

        public async Task<CustomerDto> GetCurrentCustomerAsync(Guid id)
        {
            return ObjectMapper.Map<Customer, CustomerDto>(await _customersRepository.GetAsync(id));

        }


        private async Task<CustomerTokenDto> GenerateTokenDtoAsync(Customer customer)
        {
            var claims = new List<Claim>
            {
                // Use custom claim type for customer ID to differentiate from admin ID
                new Claim("CustomerId", customer.Id.ToString()),
                new Claim(ClaimTypes.Name, customer.CustomerName),
                new Claim(ClaimTypes.Email, customer.Email),
                new Claim(ClaimTypes.Role, "Customer"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"])
            );
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new CustomerTokenDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Id = customer.Id,
                CustomerName = customer.CustomerName,
                Email = customer.Email,
                Address = customer.Address
            };
        }

        public async Task<CustomerDto> GetCustomerByIdAsync(Guid id)
        {
            return ObjectMapper.Map<Customer, CustomerDto>(await _customersRepository.GetAsync(id));

        }

        public async Task DeleteCustomerAsync(Guid id)
        {
            var customer = await _customersRepository.GetAsync(id);
            if (customer == null)
            {
                throw new BusinessException("CustomerPortal:CustomerNotFound")
                    .WithData("Id", id);
            }

            await _customersRepository.DeleteAsync(customer);
        }
    }
} 