import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(" Seed işlemi başlatıldı...");

  // Kategorileri oluştur
  const categories = await prisma.category.createMany({
    data: [{ name: "Elektronik" }, { name: "Moda" }, { name: "Ev & Yaşam" }],
    skipDuplicates: true,
  });

  const elektronik = await prisma.category.findFirst({
    where: { name: "Elektronik" },
  });

  // Ürünleri oluştur
  await prisma.product.createMany({
    data: [
      {
        name: "Kablosuz Kulaklık",
        description: "Bluetooth 5.0, yüksek ses kalitesi",
        price: 749.99,
        stock: 100,
        categoryId: elektronik.id,
        image: "https://picsum.photos/300/200?1",
      },
      {
        name: "Akıllı Saat",
        description: "Spor takibi ve kalp ritmi ölçer",
        price: 1299,
        stock: 50,
        categoryId: elektronik.id,
        image: "https://picsum.photos/300/200?2",
      },
    ],
  });

  console.log(" Veriler başarıyla yüklendi.");
}

main()
  .catch((e) => {
    console.error(" Seed hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
