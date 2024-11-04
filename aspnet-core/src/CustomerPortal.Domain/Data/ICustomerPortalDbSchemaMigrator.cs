using System.Threading.Tasks;

namespace CustomerPortal.Data;

public interface ICustomerPortalDbSchemaMigrator
{
    Task MigrateAsync();
}
