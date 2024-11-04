using CustomerPortal.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace CustomerPortal.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class CustomerPortalController : AbpControllerBase
{
    protected CustomerPortalController()
    {
        LocalizationResource = typeof(CustomerPortalResource);
    }
}
