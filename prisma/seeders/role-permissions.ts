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

  // Create permissions if they do not exist
  const permissions = [
    { name: 'Create Gallery', slug: 'create-gallery' },
    { name: 'View Gallery', slug: 'view-gallery' },
    { name: 'Update Gallery', slug: 'update-gallery' },
    { name: 'Delete Gallery', slug: 'delete-gallery' },
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

  // Get the permissions to be linked to admin
  const createPermission = await prisma.permissions.findFirst({
    where: { slug: 'create-gallery' },
  });
  const viewPermission = await prisma.permissions.findFirst({
    where: { slug: 'view-gallery' },
  });
  const updatePermission = await prisma.permissions.findFirst({
    where: { slug: 'update-gallery' },
  });
  const deletePermission = await prisma.permissions.findFirst({
    where: { slug: 'delete-gallery' },
  });

  // Link permissions to admin role
  if (admin && createPermission && viewPermission && updatePermission && deletePermission) {
    await prisma.role_permissions.createMany({
      data: [
        { role_id: admin.id, permission_id: createPermission.id },
        { role_id: admin.id, permission_id: viewPermission.id },
        { role_id: admin.id, permission_id: updatePermission.id },
        { role_id: admin.id, permission_id: deletePermission.id },
      ],
    });
  }

  console.log('Admin role and permissions seeded successfully!');
}
