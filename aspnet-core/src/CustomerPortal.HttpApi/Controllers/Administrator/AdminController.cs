using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CustomerPortal.Controllers;
using CustomerPortal.Customers;
using CustomerPortal.Customers.Dtos;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace CustomerPortal.HttpApi.Controllers
{
    [Route("api/admin")]
    [Authorize(Policy = "AdminPolicy")]
    public class AdminController : CustomerPortalController
    {
        private readonly ICustomerService _customerService;

        public AdminController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet("customers")]
        public async Task<ActionResult<PagedResultDto<CustomerDto>>> GetCustomers([FromQuery] GetCustomersInput input)
        {
            var customers = await _customerService.GetCustomersListAsync(input);
            return Ok(customers);
        }

        [HttpGet("customers/{id:guid}")]
        public async Task<ActionResult<CustomerDto>> GetCustomer(Guid id)
        {
            var customer = await _customerService.GetCustomerByIdAsync(id);
            return Ok(customer);
        }

        [HttpPost("customers/{id:guid}/activate")]
        public async Task<ActionResult> ActivateCustomer(Guid id)
        {
            await _customerService.ActivateCustomerAsync(id);
            return Ok();
        }

        [HttpPost("customers/{id:guid}/deactivate")]
        public async Task<ActionResult> DeactivateCustomer(Guid id)
        {
            await _customerService.DeactivateCustomerAsync(id);
            return Ok();
        }

        [HttpDelete("customers/{id:guid}")]
        public async Task<ActionResult> DeleteCustomer(Guid id)
        {
            await _customerService.DeleteCustomerAsync(id);
            return Ok();
        }
    }
} 