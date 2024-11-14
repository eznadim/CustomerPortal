using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CustomerPortal.Migrations
{
    public partial class UpdatePermissions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Clear existing permissions
            migrationBuilder.Sql("DELETE FROM AbpPermissionGrants");
            
            // Clear existing permissions definitions if needed
            migrationBuilder.Sql("DELETE FROM AbpPermissions");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Add rollback logic if needed
        }
    }
} 