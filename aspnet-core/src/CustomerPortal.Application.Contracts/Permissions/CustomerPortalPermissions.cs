namespace CustomerPortal.Permissions;

public static class CustomerPortalPermissions
{
    public const string GroupName = "CustomerPortal";

    public static class Orders
    {
        public const string Default = GroupName + ".Orders";
        public const string UpdateStatus = Default + ".UpdateStatus";
    }

    public static class Admin
    {
        public const string Default = GroupName + ".Admin";
        public const string CustomerManagement = Default + ".CustomerManagement";
        public const string OrderManagement = Default + ".OrderManagement";
    }

    public static class Dashboard
    {
        public const string DashboardGroup = GroupName + ".Dashboard";
        public const string Host = DashboardGroup + ".Host";
        public const string Tenant = DashboardGroup + ".Tenant";
    }

    public static class CustomerAccess
    {
        public const string Self = GroupName + ".CustomerAccess.Self";
    }

    public static class Customers
    {
        public const string Default = GroupName + ".Customers";
        public const string Customer = Default + ".Customer";
        public const string Create = Default + ".Create";
        public const string Delete = Default + ".Delete";
        public const string ManageCustomers = Default + ".Manage";
    }

    //Add your own permission names. Example:
    //public const string MyPermission1 = GroupName + ".MyPermission1";
}
