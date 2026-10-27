// Demo data for local development. Run with `npm run seed` (needs DATABASE_URL in .env).
// Re-running replaces the seed user's stores. Set SEED_USER_ID to your Clerk user id when Clerk keys are configured.
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

try { process.loadEnvFile(); } catch {}

const userId = process.env.SEED_USER_ID ?? "user_dev_local"; // = DEV_USER_ID in lib/auth.ts
const prisma = new PrismaClient({ adapter: new PrismaMariaDb(process.env.DATABASE_URL ?? "") });
const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80`;

async function main() {
  // relationMode = "prisma" means no DB-level cascades, so children are removed explicitly.
  const old = (await prisma.store.findMany({ where: { userId }, select: { id: true } })).map((s) => s.id);
  const inOld = { storeId: { in: old } };
  await prisma.orderItem.deleteMany({ where: { order: inOld } });
  await prisma.order.deleteMany({ where: inOld });
  await prisma.image.deleteMany({ where: { product: inOld } });
  await prisma.product.deleteMany({ where: inOld });
  await prisma.category.deleteMany({ where: inOld });
  await prisma.billboard.deleteMany({ where: inOld });
  await prisma.size.deleteMany({ where: inOld });
  await prisma.color.deleteMany({ where: inOld });
  await prisma.store.deleteMany({ where: { id: { in: old } } });

  const store = await prisma.store.create({ data: { name: "Urban Threads", userId } });
  const storeId = store.id;
  await prisma.store.create({ data: { name: "Gadget Corner", userId } }); // second store for the store switcher

  const billboard = async (label: string, id: string) =>
    prisma.billboard.create({ data: { storeId, label, imageUrl: img(id) } });
  const bbClothing = await billboard("Explore the Autumn Collection", "1490481651871-ab68de25d43d");
  const bbShoes = await billboard("Step Up Your Sneaker Game", "1549298916-b41d501d3772");
  const bbAcc = await billboard("Accessories That Finish the Look", "1441986300917-64674bd600d8");

  const category = async (name: string, billboardId: string) =>
    prisma.category.create({ data: { storeId, name, billboardId } });
  const shirts = await category("Shirts", bbClothing.id);
  const outerwear = await category("Outerwear", bbClothing.id);
  const shoes = await category("Shoes", bbShoes.id);
  const accessories = await category("Accessories", bbAcc.id);

  const size = async (name: string, value: string) => prisma.size.create({ data: { storeId, name, value } });
  const [s, m, l, xl, one] = [
    await size("Small", "S"), await size("Medium", "M"), await size("Large", "L"),
    await size("Extra Large", "XL"), await size("One Size", "OS"),
  ];

  const color = async (name: string, value: string) => prisma.color.create({ data: { storeId, name, value } });
  const [black, white, red, navy, brown] = [
    await color("Black", "#111111"), await color("White", "#f5f5f5"), await color("Red", "#c0392b"),
    await color("Navy", "#1f2a44"), await color("Brown", "#7b4b2a"),
  ];

  const product = async (
    name: string, price: number, categoryId: string, sizeId: string, colorId: string,
    images: string[], flags: { isFeatured?: boolean; isArchived?: boolean } = {},
  ) => prisma.product.create({
    data: { storeId, name, price, categoryId, sizeId, colorId, ...flags, images: { create: images.map((id) => ({ url: img(id) })) } },
  });
  const products = [
    await product("Classic White Tee", 24.99, shirts.id, m.id, white.id, ["1521572163474-6864f9cf17ab"], { isFeatured: true }),
    await product("Graphic Crew Tee", 29.0, shirts.id, l.id, black.id, ["1576566588028-4147f3842f27"]),
    await product("Everyday Hoodie", 59.0, outerwear.id, xl.id, navy.id, ["1556821840-3a63f95609a7"], { isFeatured: true }),
    await product("Leather Biker Jacket", 189.0, outerwear.id, l.id, black.id, ["1551028719-00167b16eac5"]),
    await product("Slim Fit Jeans", 79.5, outerwear.id, m.id, navy.id, ["1541099649105-f69ad21f3246"]),
    await product("Runner Red Sneakers", 119.0, shoes.id, l.id, red.id, ["1542291026-7eec264c27ff", "1491553895911-0055eca6402d"], { isFeatured: true }),
    await product("Minimal Wrist Watch", 149.0, accessories.id, one.id, brown.id, ["1523275335684-37898b6baf30"]),
    await product("Wireless Headphones", 99.0, accessories.id, one.id, black.id, ["1505740420928-5e560c06d30e"], { isArchived: true }),
  ];

  // Orders spread over the current year so the overview revenue chart has several bars.
  const year = new Date().getFullYear();
  const orders: { month: number; paid: boolean; items: number[]; phone: string; address: string }[] = [
    { month: 0, paid: true, items: [0, 2], phone: "+1 555 0101", address: "12 Main St, Springfield, US" },
    { month: 1, paid: true, items: [5], phone: "+1 555 0102", address: "48 Oak Ave, Portland, US" },
    { month: 2, paid: true, items: [3, 1], phone: "+1 555 0103", address: "7 Pine Rd, Austin, US" },
    { month: 3, paid: false, items: [4], phone: "", address: "" },
    { month: 4, paid: true, items: [6, 0, 1], phone: "+1 555 0105", address: "301 Lake Dr, Chicago, US" },
    { month: 5, paid: true, items: [2, 4], phone: "+1 555 0106", address: "9 Elm St, Denver, US" },
    { month: 6, paid: false, items: [5, 6], phone: "", address: "" },
    { month: 7, paid: true, items: [3], phone: "+1 555 0108", address: "55 Bay St, Seattle, US" },
    { month: 8, paid: true, items: [5, 2, 0], phone: "+1 555 0109", address: "18 Hill Ct, Boston, US" },
    { month: 9, paid: true, items: [6, 4], phone: "+1 555 0110", address: "260 River Rd, Miami, US" },
  ];
  for (const o of orders) {
    const createdAt = new Date(year, o.month, 12);
    await prisma.order.create({
      data: {
        storeId, isPaid: o.paid, phone: o.phone, address: o.address, createdAt,
        orderItems: { create: o.items.map((i) => ({ productId: products[i].id })) },
      },
    });
  }

  console.log(`Seeded store "${store.name}" (${storeId}) for ${userId}: 3 billboards, 4 categories, 5 sizes, 5 colors, ${products.length} products, ${orders.length} orders.`);
}

main().finally(() => prisma.$disconnect());
