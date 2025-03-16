<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default roles
        $adminRole = Role::create([
            'name' => 'Administrator',
            'slug' => 'admin',
            'description' => 'System administrator with full access',
            'permissions' => [
                'manage_tenants' => true,
                'manage_users' => true,
                'manage_roles' => true,
                'manage_social_platforms' => true,
                'manage_content' => true,
            ],
        ]);

        $userRole = Role::create([
            'name' => 'User',
            'slug' => 'user',
            'description' => 'Regular user with limited access',
            'permissions' => [
                'manage_social_platforms' => false,
                'manage_content' => true,
            ],
        ]);

        // Create default tenant
        $tenant = Tenant::create([
            'name' => 'Default Tenant',
            'domain' => 'default.socialize.local',
            'status' => true,
        ]);

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'tenant_id' => $tenant->id,
            'email_verified_at' => now(),
        ]);

        // Assign admin role to admin user
        $admin->roles()->attach($adminRole->id);

        // Create regular user
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'tenant_id' => $tenant->id,
            'email_verified_at' => now(),
        ]);

        // Assign user role to regular user
        $user->roles()->attach($userRole->id);
    }
}
