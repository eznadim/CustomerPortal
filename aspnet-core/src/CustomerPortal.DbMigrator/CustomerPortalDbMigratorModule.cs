using CustomerPortal.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace CustomerPortal.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(CustomerPortalEntityFrameworkCoreModule),
    typeof(CustomerPortalApplicationContractsModule)
)]
public class CustomerPortalDbMigratorModule : AbpModule
{
}
