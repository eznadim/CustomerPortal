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
                throw new BusinessException("Invalid credentials");
            }

            // Find customer
            var customer = await _customersRepository.FirstOrDefaultAsync(x => x.Email == input.Email);
            if (customer == null)
            {
                throw new BusinessException("Invalid credentials");
            }

            // Verify password
            var verificationResult = _passwordHasher.VerifyHashedPassword(
                customer, 
                customer.PasswordHash, 
                input.Password
            );

            if (verificationResult == PasswordVerificationResult.Failed)
            {
                throw new BusinessException("Invalid credentials");
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
                GuidGenerator.Create(),
                input.CustomerName,
                input.Email,
                _passwordHasher.HashPassword(null, input.Password),
                DateTime.Now

            );

            await _customersRepository.InsertAsync(customer);
            await CurrentUnitOfWork.SaveChangesAsync();

            return await GenerateTokenDtoAsync(customer);
        }

        public async Task UpdateProfileAsync(UpdateCustomerDto input)
        {
            // Get the current user's ID from the session
            var currentUserId = CurrentUser.Id;
            if (!currentUserId.HasValue)
            {
                throw new BusinessException("CustomerPortal:UserNotAuthenticated");
            }

            // Get the customer
            var customer = await _customersRepository.GetAsync(currentUserId.Value);
            if (customer == null)
            {
                throw new BusinessException("CustomerPortal:CustomerNotFound");
            }

            // Check if email is being changed and if it's already in use
            if (customer.Email != input.Email)
            {
                var emailExists = await _customersRepository.AnyAsync(x => 
                    x.Id != customer.Id && 
                    x.Email == input.Email
                );

                if (emailExists)
                {
                    throw new BusinessException("CustomerPortal:EmailAlreadyExists")
                        .WithData("Email", input.Email);
                }
            }

            // Update basic info
            customer.UpdateCustomerInfo(input.CustomerName, input.Email);

            // Handle password update if provided
            if (!string.IsNullOrEmpty(input.CurrentPassword) && !string.IsNullOrEmpty(input.NewPassword))
            {
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

                // Hash and set new password
                var newPasswordHash = _passwordHasher.HashPassword(customer, input.NewPassword);
                customer.UpdatePassword(newPasswordHash);
            }

            // Save changes
            await _customersRepository.UpdateAsync(customer);

            // You might want to add audit logging here
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<CustomerTokenDto> GetCurrentCustomerAsync()
        {
            var customerId = CurrentUser.Id;
            if (!customerId.HasValue)
            {
                throw new BusinessException("User not authenticated");
            }

            var customer = await _customersRepository.GetAsync(customerId.Value);
            return await GenerateTokenDtoAsync(customer);
        }

        private async Task<CustomerTokenDto> GenerateTokenDtoAsync(Customer customer)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
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
                CustomerId = customer.CustomerId,
                CustomerName = customer.CustomerName,
                Email = customer.Email
            };
        }

        public async Task<PagedResultDto<CustomerDto>> GetCustomersListAsync(GetCustomersInput input)
        {
            var query = (await _customersRepository.WithDetailsAsync())
                .OrderByDescending(e => e.CreationTime)
                .Select(e => new
                {
                    Customer = e,
                })
                .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => e.Customer.CustomerName.Contains(input.Filter) ||
                        e.Customer.Email.Contains(input.Filter))
                .WhereIf(!string.IsNullOrWhiteSpace(input.CustomerName), e => e.Customer.CustomerName.Contains(input.CustomerName))
                .WhereIf(!string.IsNullOrWhiteSpace(input.CustomerEmail), e => e.Customer.Email.Contains(input.CustomerName))
                .Select(e => new CustomerDto()
                {
                    CustomerId = e.Customer.CustomerId,
                    CustomerName = e.Customer.CustomerName,
                    Email = e.Customer.Email,
                });
            var totalCount = query.Count();
            var items = await query.AsQueryable()
                        .PageBy(input.SkipCount, input.MaxResultCount)
                        .ToDynamicListAsync<CustomerDto>(); ;

            return new PagedResultDto<CustomerDto>
            {
                TotalCount = totalCount,
                Items = items
            };
        }

        public async Task<CustomerDto> GetCustomerByIdAsync(Guid customerId)
        {
            var customer = await _customersRepository.FindByCustomerIdAsync(customerId);
            if (customer == null)
            {
                throw new BusinessException("CustomerPortal:CustomerNotFound")
                    .WithData("CustomerId", customerId);
            }

            return ObjectMapper.Map<Customer, CustomerDto>(customer);
        }

        public async Task ActivateCustomerAsync(Guid customerId)
        {
            var customer = await _customersRepository.FindByCustomerIdAsync(customerId);
            if (customer == null)
            {
                throw new BusinessException("CustomerPortal:CustomerNotFound")
                    .WithData("CustomerId", customerId);
            }

            customer.IsActive = true;
            await _customersRepository.UpdateAsync(customer);
        }

        public async Task DeactivateCustomerAsync(Guid customerId)
        {
            var customer = await _customersRepository.FindByCustomerIdAsync(customerId);
            if (customer == null)
            {
                throw new BusinessException("CustomerPortal:CustomerNotFound")
                    .WithData("CustomerId", customerId);
            }

            customer.IsActive = false;
            await _customersRepository.UpdateAsync(customer);
        }

        public async Task DeleteCustomerAsync(Guid customerId)
        {
            var customer = await _customersRepository.FindByCustomerIdAsync(customerId);
            if (customer == null)
            {
                throw new BusinessException("CustomerPortal:CustomerNotFound")
                    .WithData("CustomerId", customerId);
            }

            await _customersRepository.DeleteAsync(customer);
        }
    }
} 