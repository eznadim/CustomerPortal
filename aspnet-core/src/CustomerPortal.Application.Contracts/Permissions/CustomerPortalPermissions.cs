namespace CustomerPortal.Permissions;

public static class CustomerPortalPermissions
{
    public const string GroupName = "CustomerPortal";

    public static class Customers
    {
        public const string Default = GroupName + ".Customers";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
        public const string ManageCustomers = Default + ".Manage";
    }

    public static class CustomerAccess
    {
        public const string Self = GroupName + ".CustomerAccess.Self";
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

    public static class Orders
    {
        public const string Default = GroupName + ".Orders";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    //Add your own permission names. Example:
    //public const string MyPermission1 = GroupName + ".MyPermission1";
}
