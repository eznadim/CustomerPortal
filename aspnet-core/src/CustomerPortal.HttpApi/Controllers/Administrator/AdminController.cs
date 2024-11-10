using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CustomerPortal.Administrator;
using CustomerPortal.Customers.Dtos;
using CustomerPortal.Orders.Dtos;
using CustomerPortal.Permissions;
using Volo.Abp;
using Volo.Abp.Application.Dtos;

namespace CustomerPortal.Controllers.Administrator
{
    [RemoteService]
    [Route("api/app/admin")]
    [Authorize(CustomerPortalPermissions.Admin.Default)]
    public class AdminController : CustomerPortalController
    {
        private readonly IAdministratorService _administratorService;

        public AdminController(IAdministratorService administratorService)
        {
            _administratorService = administratorService;
        }

        // Customer Management Endpoints
        [HttpGet("customers")]
        [Authorize(CustomerPortalPermissions.Admin.CustomerManagement)]
        public async Task<ActionResult<PagedResultDto<CustomerDto>>> GetCustomersListAsync([FromQuery] GetCustomersInput input)
        {
            var result = await _administratorService.GetCustomersListAsync(input);
            return Ok(result);
        }

        [HttpGet("customers/{id}")]
        [Authorize(CustomerPortalPermissions.Admin.CustomerManagement)]
        public async Task<ActionResult<CustomerDto>> GetCustomerDetailsAsync(Guid id)
        {
            var result = await _administratorService.GetCustomerDetailsAsync(id);
            return Ok(result);
        }

        [HttpPost("customers/{id}/activate")]
        [Authorize(CustomerPortalPermissions.Admin.CustomerManagement)]
        public async Task<ActionResult> ActivateCustomerAsync(Guid id)
        {
            await _administratorService.ActivateCustomerAsync(id);
            return Ok();
        }

        [HttpPost("customers/{id}/deactivate")]
        [Authorize(CustomerPortalPermissions.Admin.CustomerManagement)]
        public async Task<ActionResult> DeactivateCustomerAsync(Guid id)
        {
            await _administratorService.DeactivateCustomerAsync(id);
            return Ok();
        }

        // Order Management Endpoints
        [HttpGet("orders")]
        [Authorize(CustomerPortalPermissions.Admin.OrderManagement)]
        public async Task<ActionResult<PagedResultDto<OrderDto>>> GetOrdersAdminListAsync([FromQuery] GetOrderListDto input)
        {
            var result = await _administratorService.GetOrdersAdminListAsync(input);
            return Ok(result);
        }

        [HttpGet("orders/{id}")]
        [Authorize(CustomerPortalPermissions.Admin.OrderManagement)]
        public async Task<ActionResult<OrderDto>> GetOrderDetailsAsync(Guid id)
        {
            var result = await _administratorService.GetOrderDetailsAsync(id);
            return Ok(result);
        }

        [HttpPut("orders/{id}/status")]
        [Authorize(CustomerPortalPermissions.Admin.OrderManagement)]
        public async Task<ActionResult<OrderDto>> UpdateOrderStatusAsync(Guid id, [FromBody] UpdateOrderStatusDto input)
        {
            var result = await _administratorService.UpdateOrderStatusAsync(id, input);
            return Ok(result);
        }

        // Dashboard Endpoint
        [HttpGet("dashboard")]
        [Authorize(CustomerPortalPermissions.Admin.Default)]
        public async Task<ActionResult<AdminDashboardDto>> GetDashboardStatisticsAsync()
        {
            var result = await _administratorService.GetDashboardStatisticsAsync();
            return Ok(result);
        }
    }
} 