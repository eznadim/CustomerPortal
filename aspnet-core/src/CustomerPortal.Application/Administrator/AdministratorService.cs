using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using CustomerPortal.Customers;
using CustomerPortal.Customers.Dtos;
using CustomerPortal.Orders;
using CustomerPortal.Orders.Dtos;
using CustomerPortal.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace CustomerPortal.Administrator
{
    [Authorize(CustomerPortalPermissions.Admin.Default)]
    public class AdministratorService : CustomerPortalAppService, IAdministratorService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IOrderRepository _orderRepository;

        public AdministratorService(
            ICustomerRepository customerRepository,
            IOrderRepository orderRepository)
        {
            _customerRepository = customerRepository;
            _orderRepository = orderRepository;
        }

        // Customer Management
        [Authorize(CustomerPortalPermissions.Admin.CustomerManagement)]
        public async Task<PagedResultDto<CustomerDto>> GetCustomersListAsync(GetCustomersInput input)
        {
             var query = (await _customerRepository.WithDetailsAsync())
               .OrderByDescending(e => e.CreationTime)
               .Select(e => new
               {
                   Customer = e,
                   Order = e.Orders.Where(f => f.Id == f.Customer.Orders.FirstOrDefault().Id).FirstOrDefault(),
               })
               .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), e => e.Customer.CustomerName.Contains(input.Filter) ||
                       e.Customer.Email.Contains(input.Filter))
               .WhereIf(!string.IsNullOrWhiteSpace(input.CustomerName), e => e.Customer.CustomerName.Contains(input.CustomerName))
               .WhereIf(!string.IsNullOrWhiteSpace(input.CustomerEmail), e => e.Customer.Email.Contains(input.CustomerName))
               .Select(e => new CustomerDto()
               {
                   Id = e.Customer.Id,
                   CustomerName = e.Customer.CustomerName,
                   Email = e.Customer.Email,
                   Address = e.Customer.Address,
                   IsActive = e.Customer.IsActive,
                   OrderNo = e.Order.OrderNumber,

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

        [Authorize(CustomerPortalPermissions.Admin.CustomerManagement)]
        public async Task<CustomerDto> GetCustomerDetailsAsync(Guid customerId)
        {
            var customer = await _customerRepository.GetAsync(customerId);
            return ObjectMapper.Map<Customer, CustomerDto>(customer);
        }

        [Authorize(CustomerPortalPermissions.Admin.CustomerManagement)]
        public async Task ActivateCustomerAsync(Guid customerId)
        {
            var customer = await _customerRepository.GetAsync(customerId);
            if (customer == null)
            {
                throw new BusinessException("CustomerPortal:CustomerNotFound");
            }

            customer.IsActive = true;
            await _customerRepository.UpdateAsync(customer);
        }

        [Authorize(CustomerPortalPermissions.Admin.CustomerManagement)]
        public async Task DeactivateCustomerAsync(Guid customerId)
        {
            var customer = await _customerRepository.GetAsync(customerId);
            if (customer == null)
            {
                throw new BusinessException("CustomerPortal:CustomerNotFound");
            }

            customer.IsActive = false;
            await _customerRepository.UpdateAsync(customer);
        }

        // Order Management
        [Authorize(CustomerPortalPermissions.Admin.OrderManagement)]
        public async Task<PagedResultDto<OrderDto>> GetOrdersAdminListAsync(GetOrderListDto input)
        {
             var query = (await _orderRepository.WithDetailsAsync())
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

        [Authorize(CustomerPortalPermissions.Admin.OrderManagement)]
        public async Task<OrderDto> GetOrderDetailsAsync(Guid orderId)
        {
            var order = await _orderRepository.GetOrderWithDetailsAsync(orderId);
            if (order == null)
            {
                throw new BusinessException("CustomerPortal:OrderNotFound");
            }

            var dto = ObjectMapper.Map<OrderEntity, OrderDto>(order);
            return dto;
        }

        [Authorize(CustomerPortalPermissions.Admin.OrderManagement)]
        public async Task<OrderDto> UpdateOrderStatusAsync(Guid orderId, UpdateOrderStatusDto input)
        {
            var order = await _orderRepository.GetOrderWithDetailsAsync(orderId);
            if (order == null)
            {
                throw new BusinessException("CustomerPortal:OrderNotFound");
            }

            order.UpdateStatus(input.Status);
            if (!string.IsNullOrWhiteSpace(input.TrackingNumber))
            {
                order.UpdateTrackingNumber(input.TrackingNumber);
            }

            await _orderRepository.UpdateAsync(order);

            var updatedOrder = await _orderRepository.GetOrderWithDetailsAsync(orderId);
            var dto = ObjectMapper.Map<OrderEntity, OrderDto>(updatedOrder);
            dto.CustomerName = updatedOrder.Customer?.CustomerName;
            return dto;
        }

         [Authorize(CustomerPortalPermissions.Admin.Default)]
        public async Task<AdminDashboardDto> GetDashboardStatisticsAsync()
        {
            var customers = await _customerRepository.GetListAsync();
            var orders = await _orderRepository.GetListAsync();

            return new AdminDashboardDto
            {
                TotalCustomers = customers.Count,
                ActiveCustomers = customers.Count(c => c.IsActive),
                TotalOrders = orders.Count,
                PendingOrders = orders.Count(o => o.Status == OrderStatus.Pending),
                ProcessingOrders = orders.Count(o => o.Status == OrderStatus.Processing),
                CompletedOrders = orders.Count(o => o.Status == OrderStatus.Delivered),
                CancelledOrders = orders.Count(o => o.Status == OrderStatus.Cancelled),
                RecentOrders = ObjectMapper.Map<List<OrderEntity>, List<OrderDto>>(
                    orders.OrderByDescending(o => o.OrderDate).Take(5).ToList()
                )
            };
        }
    }
}
