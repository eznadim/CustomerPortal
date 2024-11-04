using Xunit;

namespace CustomerPortal.EntityFrameworkCore;

[CollectionDefinition(CustomerPortalTestConsts.CollectionDefinitionName)]
public class CustomerPortalEntityFrameworkCoreCollection : ICollectionFixture<CustomerPortalEntityFrameworkCoreFixture>
{

}
