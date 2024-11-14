# Customer Portal

Customer Portal for the Customer Portal API.

## Prerequisites

Before you begin, ensure you have the following installed:
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (version 16.x or higher)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) or [VS Code](https://code.visualstudio.com/)

## Getting Started

### Database Setup
1. Open SQL Server Management Studio
2. Create a new database named 'CustomerPortal'
3. Update the connection string in `appsettings.json` of your API project:
```json
{
    "ConnectionStrings": {
        "Default": "Server=localhost;Database=CustomerPortal;Trusted_Connection=True;TrustServerCertificate=True"
    }
}
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd aspnet-core
```

2. Open the solution in Visual Studio 2022
   - Build the solution (Ctrl + Shift + B)
   - Restore NuGet packages if needed

3. Apply database migrations:
```bash
cd src/CustomerPortal.EntityFrameworkCore
dotnet ef database update
```

4. Run the API project:
   - Set CustomerPortal.HttpApi.Host as startup project
   - Press F5 to run in debug mode
   - API will be available at `https://localhost:44300`

### Frontend Setup
1. Navigate to the Angular directory:
```bash
cd angular
```

2. Install dependencies:
```bash
npm install
```

3. Start the Angular application:
```bash
npm start
```
- Application will be available at `http://localhost:4200`
- Default login credentials:
  - Username: admin
  - Password: 1q2w3E*

### Project Structure
```
CustomerPortal/
├── aspnet-core/
│   ├── src/
│   │   ├── CustomerPortal.Domain/
│   │   ├── CustomerPortal.Application/
│   │   ├── CustomerPortal.EntityFrameworkCore/
│   │   └── CustomerPortal.HttpApi.Host/
│   └── test/
└── angular/
```

### Common Issues and Solutions

1. If you get SSL certificate errors:
```bash
dotnet dev-certs https --trust
```

2. If npm packages fail to install:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

3. If database connection fails:
   - Verify SQL Server is running
   - Check connection string in appsettings.json
   - Ensure Windows Authentication is enabled

### Development Commands

#### Create New Migration
```bash
cd src/CustomerPortal.EntityFrameworkCore
dotnet ef migrations add [MigrationName]
```

#### Update Database
```bash
dotnet ef database update
```

#### Run Backend Tests
```bash
cd test/CustomerPortal.Tests
dotnet test
```

### Built With
- ABP Framework v8.0
- .NET 8.0
- Angular 16+
- Entity Framework Core 8.0
- SQL Server 2019+

### Additional Resources
- [ABP Framework Documentation](https://docs.abp.io)
- [Angular Documentation](https://angular.io/docs)
- [Entity Framework Core Documentation](https://learn.microsoft.com/en-us/ef/core/)
```

Key updates made to your README:
1. Added detailed step-by-step instructions
2. Included default login credentials
3. Added common troubleshooting steps
4. Included development commands
5. Added project structure
6. Included version information for frameworks
7. Added additional resources section
