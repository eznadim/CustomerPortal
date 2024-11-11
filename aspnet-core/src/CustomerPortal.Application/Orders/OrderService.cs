using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using CustomerPortal.Customers;
using CustomerPortal.Customers.Dtos;
using CustomerPortal.Orders.Dtos;
using CustomerPortal.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.ObjectMapping;

namespace CustomerPortal.Orders
{
    [Authorize]
    public class OrderService : CustomerPortalAppService, IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICustomerRepository _customersRepository;

        public OrderService(
            ICustomerRepository customersRepository,
            IOrderRepository orderRepository)
        {
            _customersRepository = customersRepository;
            _orderRepository = orderRepository;
        }

        public async Task<OrderDto> GetAsync(Guid id)
        {
            var order = await _orderRepository.GetAsync(id);
            var customer = await _customersRepository.GetAsync(order.CustomerId);
            
            var orderDto = ObjectMapper.Map<OrderEntity, OrderDto>(order);
            orderDto.CustomerName = customer.CustomerName;
            
            return orderDto;
        }

        public async Task<PagedResultDto<OrderDto>> GetOrderListPublicAsync(GetOrderListDto input)
        {
            var query = (await _orderRepository.WithDetailsAsync()).Where(e => CurrentUser.Id == input.CustomerId)
              .OrderByDescending(e => e.CreationTime)
              .Select(e => new
              {
                  Order = e,
                  Customer = e.Customer
              })
              .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => e.Customer.CustomerName.Contains(input.Filter) ||
                      e.Customer.Email.Contains(input.Filter) ||
                      e.Order.OrderNumber.Contains(input.Filter))
              .WhereIf(!string.IsNullOrWhiteSpace(input.CustomerName), e => e.Customer.CustomerName.Contains(input.CustomerName))
              .WhereIf(input.Status.HasValue, e => e.Order.Status == input.Status)
              .Select(e => new CustomerDto()
              {
                  Id = e.Customer.Id,
                  CustomerName = e.Customer.CustomerName,
                  Email = e.Customer.Email,
                  Address = e.Customer.Address,
                  IsActive = e.Customer.IsActive,
                  OrderNo = e.Order.OrderNumber,
                  OrderStatus = e.Order.Status

              });
            var totalCount = query.Count();
            var items = await query.AsQueryable()
                        .PageBy(input.SkipCount, input.MaxResultCount)
                        .ToDynamicListAsync<OrderDto>(); ;

            return new PagedResultDto<OrderDto>
            {
                TotalCount = totalCount,
                Items = items
            };
        }

        public async Task<OrderDto> CreateAsync(CreateUpdateOrderDto input)
        {
            var lastOrder = (await _orderRepository.WithDetailsAsync()).OrderByDescending(e => e.CreationTime).FirstOrDefault().OrderNumber;
            string orderNumber = GenerateOrderNumber(lastOrder);

            var order = new OrderEntity(
                GuidGenerator.Create(),
                input.CustomerId,
                orderNumber,
                input.Description
            );

            await _orderRepository.InsertAsync(order);
            
            var customer = await _customersRepository.GetAsync(input.CustomerId);
            var orderDto = ObjectMapper.Map<OrderEntity, OrderDto>(order);
            orderDto.CustomerName = customer.CustomerName;
            
            return orderDto;
        }

        public async Task<OrderDto> UpdateStatusAsync(Guid id, UpdateOrderStatusDto input)
        {
            var order = await _orderRepository.GetAsync(id);
            
            order.UpdateStatus(input.Status);
            if (!string.IsNullOrWhiteSpace(input.TrackingNumber))
            {
                order.UpdateTrackingNumber(input.TrackingNumber);
            }

            await _orderRepository.UpdateAsync(order);
            
            var customer = await _customersRepository.GetAsync(order.CustomerId);
            var orderDto = ObjectMapper.Map<OrderEntity, OrderDto>(order);
            orderDto.CustomerName = customer.CustomerName;
            
            return orderDto;
        }

        public async Task DeleteAsync(Guid id)
        {
            await _orderRepository.DeleteAsync(id);
        }

        private string GenerateOrderNumber(string? lastOrderNumber)
        {
            if (string.IsNullOrEmpty(lastOrderNumber))
            {
                return $"ORD-{DateTime.Now:yyyyMMdd}-0001";
            }

            var parts = lastOrderNumber.Split('-');
            if (parts.Length != 3)
            {
                return $"ORD-{DateTime.Now:yyyyMMdd}-0001";
            }

            var currentDate = DateTime.Now.ToString("yyyyMMdd");
            if (parts[1] != currentDate)
            {
                return $"ORD-{currentDate}-0001";
            }

            var sequence = int.Parse(parts[2]) + 1;
            return $"ORD-{currentDate}-{sequence:D4}";
        }
    }
} 