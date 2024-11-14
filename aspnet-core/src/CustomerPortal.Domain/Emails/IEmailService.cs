using CustomerPortal.Orders;
using System.Threading.Tasks;

public interface IEmailService
{
    Task SendOrderStatusUpdateEmailAsync(string toEmail, string customerName, string orderNumber, OrderStatus status);
} 