using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using CustomerPortal.Customers;
using CustomerPortal.Customers.Dtos;
using CustomerPortal.Domain.Emails;
using CustomerPortal.Orders.Dtos;
using CustomerPortal.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.ObjectMapping;
using static CustomerPortal.Permissions.CustomerPortalPermissions;

namespace CustomerPortal.Orders
{
    public class OrderService : CustomerPortalAppService, IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICustomerRepository _customersRepository;
        private readonly IEmailService _emailService;

        public OrderService(
            ICustomerRepository customersRepository,
            IOrderRepository orderRepository,
            IEmailService emailService)
        {
            _customersRepository = customersRepository;
            _orderRepository = orderRepository;
            _emailService = emailService;
        }

        public async Task<OrderDto> GetAsync(Guid id)
        {
            var order = (await _orderRepository.WithDetailsAsync()).Where(e =>  e.Id == id).FirstOrDefault();
            var customer = (await _customersRepository.WithDetailsAsync()).Where(e => e.Id == order.CustomerId).FirstOrDefault();

            var orderDto = new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                Description = order.Description,
                OrderDate = order.OrderDate,
                Status = order.Status,
                CustomerId = order.CustomerId,
                CustomerName = customer.CustomerName,
                CustomerEmail = customer.Email
            };

            return orderDto;
        }

        [Authorize]
        public async Task<PagedResultDto<OrderDto>> GetOrderListAdminAsync(GetOrderListDto input)
        {
            var query = (await _orderRepository.WithDetailsAsync()).OrderByDescending(e => e.CreationTime)
                .Select(e => new
                {
                    Order = e,
                    Customer = e.Customer
                })
                .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => e.Customer.CustomerName.Contains(input.Filter) ||
                    e.Customer.Email.Contains(input.Filter) || e.Order.Description.Contains(input.Filter) ||
                    e.Order.OrderNumber.Contains(input.Filter))
                 .WhereIf(!string.IsNullOrWhiteSpace(input.CustomerEmail), e => e.Customer.Email.Contains(input.CustomerEmail))
                 .WhereIf(!string.IsNullOrWhiteSpace(input.Description), e => e.Order.Description.Contains(input.Description))
                 .WhereIf(!string.IsNullOrWhiteSpace(input.OrderNumber), e => e.Order.OrderNumber.Contains(input.OrderNumber))
                 .WhereIf(input.Status.HasValue, e => e.Order.Status == input.Status)
                 .WhereIf(input.EndDate.HasValue, e => e.Order.OrderDate <= input.EndDate)
                 .WhereIf(input.StartDate.HasValue, e => e.Order.OrderDate >= input.StartDate)
                .Select(e => new OrderDto()
                {
                    Id = e.Order.Id,
                    CustomerEmail = e.Customer.Email,
                    CustomerName = e.Customer.CustomerName,
                    Description = e.Order.Description,
                    OrderNumber = e.Order.OrderNumber,
                    Status = e.Order.Status,
                    OrderDate = e.Order.OrderDate,
                    LastModificationTime = e.Order.LastModificationTime,


                });

            var totalCount = query.Count();
            var items = await query.AsQueryable()
                        .PageBy(input.SkipCount, input.MaxResultCount)
                        .ToDynamicListAsync<OrderDto>(); 

            return new PagedResultDto<OrderDto>
            {
                TotalCount = totalCount,
                Items = items
            };
        }

        public async Task<PagedResultDto<OrderDto>> GetOrderListPublicAsync(Guid id,GetOrderListDto input)
        {

            var query = (await _orderRepository.WithDetailsAsync()).Where(e => id == e.CustomerId)
              .OrderByDescending(e => e.CreationTime)
              .Select(e => new
              {
                  Order = e,
                  Customer = e.Customer
              })
              .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => e.Order.Description.Contains(input.Filter) ||
                      e.Order.OrderNumber.Contains(input.Filter))
              .WhereIf(!string.IsNullOrWhiteSpace(input.Description), e => e.Order.Description.Contains(input.Description))
              .WhereIf(!string.IsNullOrWhiteSpace(input.OrderNumber), e => e.Order.OrderNumber.Contains(input.OrderNumber))
              .WhereIf(input.Status.HasValue, e => e.Order.Status == input.Status)
              .WhereIf(input.EndDate.HasValue, e => e.Order.OrderDate <= input.EndDate)
              .WhereIf(input.StartDate.HasValue, e => e.Order.OrderDate >= input.StartDate)
              .Select(e => new OrderDto()
              {
                  Id = e.Order.Id,
                  Description = e.Order.Description,
                  OrderNumber = e.Order.OrderNumber,
                  Status = e.Order.Status,
                  OrderDate = e.Order.OrderDate,
                  LastModificationTime = e.Order.LastModificationTime


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
            var lastOrder = (await _orderRepository.WithDetailsAsync())
                .OrderByDescending(e => e.CreationTime)
                .FirstOrDefault();
            
            string orderNumber = GenerateOrderNumber(lastOrder?.OrderNumber);

            var order = new OrderEntity(
                GuidGenerator.Create(),
                input.CustomerId,
                orderNumber,
                input.Description
            );

            await _orderRepository.InsertAsync(order);
            await CurrentUnitOfWork.SaveChangesAsync();

            var customer = await _customersRepository.GetAsync(input.CustomerId);
            
            var orderDto = new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                Description = order.Description,
                OrderDate = order.OrderDate,
                Status = order.Status,
                CustomerId = order.CustomerId,
                CustomerName = customer.CustomerName
            };
            
            return orderDto;
        }

        [Authorize]
        public async Task<OrderDto> UpdateStatusAsync(Guid id, UpdateOrderStatusDto input)
        {
            var order = await _orderRepository.GetAsync(id);
            if (input.Status == order.Status)
            {
                throw new UserFriendlyException("Unable to Update Status due to Similar Status");
            }
            
            order.UpdateStatus(input.Status);

            await _orderRepository.UpdateAsync(order);

            var customer = await _customersRepository.GetAsync(order.CustomerId);
            var orderDto = new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                Description = order.Description,
                OrderDate = order.OrderDate,
                Status = order.Status,
                CustomerId = order.CustomerId,
                CustomerName = customer?.CustomerName,
                CustomerEmail = customer?.Email,
                LastModificationTime = order.LastModificationTime
            };
            await CurrentUnitOfWork.SaveChangesAsync();

            if (input.Status == OrderStatus.Shipped || input.Status == OrderStatus.Delivered)
            {
                try
                {
                    await _emailService.SendOrderStatusUpdateEmailAsync(
                        customer.Email,
                        customer.CustomerName,
                        order.OrderNumber,
                        input.Status
                    );
                }
                catch (Exception ex)
                {
                    // Log the error but don't stop the status update
                    Logger.LogError($"Failed to send status update email: {ex.Message}");
                }
            }
            await CurrentUnitOfWork.SaveChangesAsync();

            return orderDto;
        }

        [Authorize(CustomerPortalPermissions.Orders.Admin)]
        public async Task DeleteAsync(Guid id)
        {
            await _orderRepository.DeleteAsync(id);
        }

        public async Task<OrderDto> CancelOrderAsync(Guid id)
        {
            try 
            {
                var order = await _orderRepository.GetAsync(id);
                if (order == null)
                {
                    throw new UserFriendlyException("Order not found");
                }
                
                if (order.Status >= OrderStatus.Shipped)
                {
                    throw new UserFriendlyException("Order cannot be cancelled as it has been shipped");
                }

                order.UpdateStatus(OrderStatus.Cancelled);
                await _orderRepository.UpdateAsync(order);
                
                // Get customer details
                var customer = await _customersRepository.GetAsync(order.CustomerId);
                
                // Manual mapping instead of using ObjectMapper
                var orderDto = new OrderDto
                {
                    Id = order.Id,
                    OrderNumber = order.OrderNumber,
                    Description = order.Description,
                    OrderDate = order.OrderDate,
                    Status = order.Status,
                    CustomerId = order.CustomerId,
                    CustomerName = customer?.CustomerName,
                    LastModificationTime = order.LastModificationTime
                };

                await CurrentUnitOfWork.SaveChangesAsync();
                return orderDto;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error cancelling order", ex.Message);
            }
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