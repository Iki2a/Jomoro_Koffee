import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding auth database...');

  // Create ADMIN user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jomoro.com' },
    update: {},
    create: {
      first_name: 'Admin',
      last_name: 'Jomoro',
      email: 'admin@jomoro.com',
      password: 'admin1234',
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create CUSTOMER user
  const customer = await prisma.user.upsert({
    where: { email: 'customer@jomoro.com' },
    update: {},
    create: {
      first_name: 'Customer',
      last_name: 'Jomoro',
      email: 'customer@jomoro.com',
      password: 'customer1234',
      role: 'CUSTOMER',
    },
  });
  console.log('Customer user created:', customer.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
