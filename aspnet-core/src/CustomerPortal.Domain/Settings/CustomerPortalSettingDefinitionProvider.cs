using Volo.Abp.Settings;

namespace CustomerPortal.Settings;

public class CustomerPortalSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(CustomerPortalSettings.MySetting1));
    }
}
