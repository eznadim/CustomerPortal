using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace CustomerPortal;

[Dependency(ReplaceServices = true)]
public class CustomerPortalBrandingProvider : DefaultBrandingProvider
{
    public override string AppName => "CustomerPortal";
}
