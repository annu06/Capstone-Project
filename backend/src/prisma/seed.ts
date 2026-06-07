import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminHash = await bcrypt.hash('Admin@123', 12);
  const shipperHash = await bcrypt.hash('Shipper@123', 12);
  const consigneeHash = await bcrypt.hash('Consignee@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shiptrack.com' },
    update: {},
    create: {
      email: 'admin@shiptrack.com',
      passwordHash: adminHash,
      fullName: 'System Admin',
      role: 'Admin',
    },
  });

  const shipper = await prisma.user.upsert({
    where: { email: 'shipper@shiptrack.com' },
    update: {},
    create: {
      email: 'shipper@shiptrack.com',
      passwordHash: shipperHash,
      fullName: 'John Shipper',
      role: 'Shipper',
    },
  });

  const consignee = await prisma.user.upsert({
    where: { email: 'consignee@shiptrack.com' },
    update: {},
    create: {
      email: 'consignee@shiptrack.com',
      passwordHash: consigneeHash,
      fullName: 'Jane Consignee',
      role: 'Consignee',
    },
  });

  const forwarder = await prisma.user.upsert({
    where: { email: 'forwarder@shiptrack.com' },
    update: {},
    create: {
      email: 'forwarder@shiptrack.com',
      passwordHash: await bcrypt.hash('Forward@123', 12),
      fullName: 'Bob Forwarder',
      role: 'Freight_Forwarder',
    },
  });

  console.log(`Seeded users: admin(${admin.id}), shipper(${shipper.id}), consignee(${consignee.id}), forwarder(${forwarder.id})`);
  console.log('Seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
