using System;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using CustomerPortal.Orders;
using System.Net;
using Microsoft.Extensions.Logging;
using Volo.Abp;

namespace CustomerPortal.Domain.Emails
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendOrderStatusUpdateEmailAsync(string toEmail, string customerName, string orderNumber, OrderStatus status)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("Smtp");
                var fromEmail = smtpSettings["FromEmail"];
                var smtpHost = smtpSettings["Host"];
                var smtpPort = int.Parse(smtpSettings["Port"]);
                var smtpUsername = smtpSettings["Username"];
                var smtpPassword = smtpSettings["Password"];
                var enableSsl = bool.Parse(smtpSettings["EnableSsl"]);

                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail),
                    Subject = $"Order {orderNumber} Status Update",
                    Body = GenerateEmailBody(customerName, orderNumber, status),
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                using var smtpClient = new SmtpClient(smtpHost, smtpPort)
                {
                    EnableSsl = enableSsl,
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword)
                };

                await smtpClient.SendMailAsync(mailMessage);
                _logger.LogInformation($"Status update email sent successfully to {toEmail} for order {orderNumber}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send status update email to {toEmail} for order {orderNumber}");
                throw new UserFriendlyException("Failed to send email notification", ex.Message);
            }
        }

        private string GenerateEmailBody(string customerName, string orderNumber, OrderStatus status)
        {
            return $@"
            <html>
                <body>
                    <p>Dear {customerName},</p>
                    <p>Your order {orderNumber} has been {status.ToString().ToLower()}.</p>
                    <p>{(status == OrderStatus.Shipped ? "Your order is on its way!" : "Your order has been delivered! Thank you for shopping with us!")}</p>
                    <br/>
                    <p>Best regards,<br/>Customer Portal</p>
                </body>
            </html>";
        }
    }
} 