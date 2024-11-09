using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CustomerPortal.Customers.Dtos;
using CustomerPortal.Customers;

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
    }
} 