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
            return await _customerService.LoginAsync(input);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<CustomerTokenDto>> Register([FromBody] CreateCustomerDto input)
        {
            return await _customerService.RegisterAsync(input);
        }

        [HttpGet]
        [Route("current-customer")]
        public async Task<CustomerDto> GetCurrentCustomerAsync(Guid id)
        {
            return await _customerService.GetCurrentCustomerAsync(id);
        }

        [HttpPut("update-customer")]
        [AllowAnonymous]
        public async Task UpdateProfileAsync(UpdateCustomerDto input)
        {
            await _customerService.UpdateProfileAsync(input);
        }

        [HttpGet("get-customer-by-id")]
        [AllowAnonymous]
        public async Task<CustomerDto> GetCustomerByIdAsync(Guid customerId)
        {
            return await _customerService.GetCustomerByIdAsync(customerId);
        }

        [HttpPut("delete-customer")]
        [AllowAnonymous]
        public async Task DeleteCustomerAsync(Guid customerId)
        {
            await _customerService.DeleteCustomerAsync(customerId);
        }
    }
} 