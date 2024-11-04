using CustomerPortal.Localization;
using Volo.Abp.Application.Services;

namespace CustomerPortal;

/* Inherit your application services from this class.
 */
public abstract class CustomerPortalAppService : ApplicationService
{
    protected CustomerPortalAppService()
    {
        LocalizationResource = typeof(CustomerPortalResource);
    }
}
