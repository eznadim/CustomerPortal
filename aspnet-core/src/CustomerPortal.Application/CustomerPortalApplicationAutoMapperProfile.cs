using AutoMapper;
using CustomerPortal.Customers;
using CustomerPortal.Customers.Dtos;

namespace CustomerPortal;

public class CustomerPortalApplicationAutoMapperProfile : Profile
{
    public CustomerPortalApplicationAutoMapperProfile()
    {
        CreateMap<Customer, CustomerDto>();
    }
}
