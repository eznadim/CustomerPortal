using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace CustomerPortal.Data;

/* This is used if database provider does't define
 * ICustomerPortalDbSchemaMigrator implementation.
 */
public class NullCustomerPortalDbSchemaMigrator : ICustomerPortalDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
