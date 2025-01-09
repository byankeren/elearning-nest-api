import { PrismaClient } from '@prisma/client';

export async function seedRolePermissions(prisma: PrismaClient) {
  // Ensure the roles are present
  const admin = await prisma.roles.findFirst({
    where: { slug: 'admin' },
  });

  // If the admin role doesn't exist, create it
  if (!admin) {
    await prisma.roles.create({
      data: {
        name: 'Admin',
        slug: 'admin',
      },
    });
  }

  // Define all permissions for different modules
  const permissions = [
    // Gallery permissions
    { name: 'Create Gallery', slug: 'create-gallery' },
    { name: 'View Gallery', slug: 'view-gallery' },
    { name: 'Update Gallery', slug: 'update-gallery' },
    { name: 'Delete Gallery', slug: 'delete-gallery' },
    // Post permissions
    { name: 'Create Post', slug: 'create-post' },
    { name: 'View Post', slug: 'view-post' },
    { name: 'Update Post', slug: 'update-post' },
    { name: 'Delete Post', slug: 'delete-post' },
    // Categories permissions
    { name: 'Create Categories', slug: 'create-categories' },
    { name: 'View Categories', slug: 'view-categories' },
    { name: 'Update Categories', slug: 'update-categories' },
    { name: 'Delete Categories', slug: 'delete-categories' },
    // Mailbox permissions
    { name: 'Create Mailbox', slug: 'create-mailbox' },
    { name: 'View Mailbox', slug: 'view-mailbox' },
    { name: 'Update Mailbox', slug: 'update-mailbox' },
    { name: 'Delete Mailbox', slug: 'delete-mailbox' },
  ];

  // Create permissions if not already present
  for (const perm of permissions) {
    const existingPermission = await prisma.permissions.findFirst({
      where: { slug: perm.slug },
    });

    if (!existingPermission) {
      await prisma.permissions.create({
        data: {
          name: perm.name,
          slug: perm.slug,
        },
      });
    }
  }

  // Link permissions to admin role
  const adminRole = await prisma.roles.findFirst({
    where: { slug: 'admin' },
  });

  if (adminRole) {
    for (const perm of permissions) {
      const permission = await prisma.permissions.findFirst({
        where: { slug: perm.slug },
      });

      if (permission) {
        const existingRolePermission = await prisma.role_permissions.findFirst({
          where: { role_id: adminRole.id, permission_id: permission.id },
        });

        if (!existingRolePermission) {
          await prisma.role_permissions.create({
            data: {
              role_id: adminRole.id,
              permission_id: permission.id,
            },
          });
        }
      }
    }
  }

  console.log('Admin role and permissions seeded successfully!');
}
