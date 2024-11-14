using CustomerPortal.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace CustomerPortal.Permissions;

public class CustomerPortalPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var customerPortalGroup = context.AddGroup(CustomerPortalPermissions.GroupName);

        var customersPermission = customerPortalGroup.AddPermission(
            CustomerPortalPermissions.Customers.Default,
            L("Permission:Customers")
        );
        
        customersPermission.AddChild(
            CustomerPortalPermissions.Customers.Create,
            L("Permission:Customers.Create")
        );
        customersPermission.AddChild(
            CustomerPortalPermissions.Customers.Delete,
            L("Permission:Customers.Delete")
        );
        customersPermission.AddChild(
            CustomerPortalPermissions.Customers.ManageCustomers,
            L("Permission:Customers.Manage")
        );

        // Add customer self-access permission
        customerPortalGroup.AddPermission(
            CustomerPortalPermissions.CustomerAccess.Self,
            L("Permission:CustomerAccess.Self")
        );

         var ordersPermission = customerPortalGroup.AddPermission(CustomerPortalPermissions.Orders.Default, L("Permission:Orders"));
        ordersPermission.AddChild(CustomerPortalPermissions.Orders.UpdateStatus, L("Permission:Orders.UpdateStatus"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<CustomerPortalResource>(name);
    }
}
