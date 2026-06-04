import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding product database...');

  // Create Categories
  const coffeeCat = await prisma.category.upsert({
    where: { id: 1 },
    update: { name: 'Coffee' },
    create: { id: 1, name: 'Coffee' },
  });

  const nonCoffeeCat = await prisma.category.upsert({
    where: { id: 2 },
    update: { name: 'Non-Coffee' },
    create: { id: 2, name: 'Non-Coffee' },
  });

  console.log('Categories created:', coffeeCat.name, nonCoffeeCat.name);

  // Create Products
  const p1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Kopi Susu Aren',
      description: 'Kopi espresso premium dengan susu segar dan gula aren asli.',
      price: 18000,
      stock: 100,
      category_id: 1,
    },
  });

  const p2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Americano Black Coffee',
      description: 'Espresso shot ganda dengan air mineral panas kualitas terbaik.',
      price: 15000,
      stock: 150,
      category_id: 1,
    },
  });

  const p3 = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Matcha Latte Premium',
      description: 'Teh hijau matcha jepang asli dengan susu segar dan gula.',
      price: 22000,
      stock: 80,
      category_id: 2,
    },
  });

  const p4 = await prisma.product.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'Chocolate Creamy Blend',
      description: 'Cokelat premium belgia dengan susu segar lembut dan manis.',
      price: 20000,
      stock: 90,
      category_id: 2,
    },
  });

  console.log('Products created:', p1.name, p2.name, p3.name, p4.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
