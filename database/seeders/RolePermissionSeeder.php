<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()['cache']->forget('spatie.permission.cache');

        // Create permissions
        $permissions = [
            // Machine permissions
            'create_machine',
            'view_machine',
            'edit_machine',
            'delete_machine',
            'view_all_machines',

            // Reservation permissions
            'create_reservation',
            'view_reservation',
            'edit_reservation',
            'delete_reservation',
            'view_all_reservations',
            'approve_reservation',

            // Profile permissions
            'edit_own_profile',
            'view_own_profile',
            'view_all_profiles',

            // User management
            'view_users',
            'edit_users',
            'delete_users',

            // Roles and Permissions
            'manage_roles',
            'manage_permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $cooperativeRole = Role::firstOrCreate(['name' => 'cooperative']);
        $agriculteurRole = Role::firstOrCreate(['name' => 'agriculteur']);

        // Assign all permissions to admin
        $adminRole->syncPermissions($permissions);

        // Assign permissions to cooperative
        $cooperativePermissions = [
            'create_machine',
            'view_machine',
            'edit_machine',
            'delete_machine',
            'view_all_reservations',
            'approve_reservation',
            'edit_own_profile',
            'view_own_profile',
        ];
        $cooperativeRole->syncPermissions($cooperativePermissions);

        // Assign permissions to agriculteur
        $agriculteurPermissions = [
            'view_machine',
            'view_all_machines',
            'create_reservation',
            'view_reservation',
            'edit_own_profile',
            'view_own_profile',
        ];
        $agriculteurRole->syncPermissions($agriculteurPermissions);
    }
}
