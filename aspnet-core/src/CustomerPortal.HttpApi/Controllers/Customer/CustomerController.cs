using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CustomerPortal.Customers.Dtos;
using CustomerPortal.Customers;
using Volo.Abp.Application.Dtos;
using System;

namespace CustomerPortal.Controllers
{
    [Route("api/customer")]
    public class CustomerController : CustomerPortalController
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<CustomerTokenDto>> Login([FromBody] CustomerLoginDto input)
        {
            var result = await _customerService.LoginAsync(input);
            return Ok(result);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<CustomerTokenDto>> Register([FromBody] CreateCustomerDto input)
        {
            var result = await _customerService.RegisterAsync(input);
            return Ok(result);
        }

        [HttpGet("profile")]
        [Authorize(AuthenticationSchemes = "JWT", Roles = "Customer")]
        public async Task<ActionResult<CustomerTokenDto>> GetProfile()
        {
            var result = await _customerService.GetCurrentCustomerAsync();
            return Ok(result);
        }

        [HttpPut("update-customer")]
        [AllowAnonymous]
        public async Task UpdateProfileAsync(UpdateCustomerDto input)
        {
            await _customerService.UpdateProfileAsync(input);
        }

        [HttpGet("get-customer-list")]
        [AllowAnonymous]
        public async Task<PagedResultDto<CustomerDto>> GetCustomersListAsync(GetCustomersInput input)
        {
            return await _customerService.GetCustomersListAsync(input);
        }

        [HttpGet("get-customer-by-id")]
        [AllowAnonymous]
        public async Task<CustomerDto> GetCustomerByIdAsync(Guid customerId)
        {
            return await _customerService.GetCustomerByIdAsync(customerId);
        }

        [HttpPut("active-customer")]
        [AllowAnonymous]
        public async Task ActivateCustomerAsync(Guid customerId)
        {
           await _customerService.ActivateCustomerAsync(customerId);
        }

        [HttpPut("deactivate-customer")]
        [AllowAnonymous]
        public async Task DeactivateCustomerAsync(Guid customerId)
        {
            await _customerService.DeactivateCustomerAsync(customerId);
        }

        [HttpPut("delete-customer")]
        [AllowAnonymous]
        public async Task DeleteCustomerAsync(Guid customerId)
        {
            await _customerService.DeleteCustomerAsync(customerId);
        }
    }
} 