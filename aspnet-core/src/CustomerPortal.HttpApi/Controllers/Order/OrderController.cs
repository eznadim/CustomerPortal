using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using CustomerPortal.Orders;
using CustomerPortal.Orders.Dtos;
using CustomerPortal.Permissions;
using Volo.Abp.Application.Dtos;

namespace CustomerPortal.Controllers
{
    [RemoteService]
    [Route("api/orders")]
    public class OrderController : CustomerPortalController
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<OrderDto> GetAsync(Guid id)
        {
            return await _orderService.GetAsync(id);
        }

        [HttpGet("get-order-admin-list")]
        public async Task<PagedResultDto<OrderDto>> GetOrderListAdminAsync([FromQuery] GetOrderListDto input)
        {
            return await _orderService.GetOrderListAdminAsync(input);
        }

        [HttpGet("get-order-public-list")]
        public async Task<PagedResultDto<OrderDto>> GetOrderListPublicAsync(Guid id,[FromQuery] GetOrderListDto input)
        {
            return await _orderService.GetOrderListPublicAsync(id,input);
        }

        [HttpPost]
        public async Task<OrderDto> CreateAsync([FromBody] CreateUpdateOrderDto input)
        {
            return await _orderService.CreateAsync(input);
        }

        [HttpPut]
        [Route("{id}/status")]
        public async Task<OrderDto> UpdateStatusAsync(Guid id, [FromBody] UpdateOrderStatusDto input)
        {
            return await _orderService.UpdateStatusAsync(id, input);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task DeleteAsync(Guid id)
        {
            await _orderService.DeleteAsync(id);
        }

        [HttpPut]
        [Route("{id}")]
        public async Task CancelOrderAsync(Guid id)
        {
            await _orderService.CancelOrderAsync(id);
        }
    }
}
