const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Một vài ảnh mẫu mượn tạm từ Shopee
  const sampleImages = [
    'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsmr0k80v2yv15_tn',
    'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsth4s30iit5ce_tn',
    'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ls8u7v1tq8fxf6_tn',
    'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsmr0k80whip43_tn',
    'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsmr0k80xx3545_tn'
  ];

  const prefixes = ["Áo thun", "Tai nghe", "Ốp lưng", "Bàn phím", "Chuột", "Sạc dự phòng", "Balo", "Đồng hồ"];
  const suffixes = ["cao cấp", "gaming", "thời trang", "chống nước", "chính hãng", "không dây", "thông minh"];

  const productsToInsert = [];

  // Vòng lặp tự động tạo 100 sản phẩm
  for (let i = 1; i <= 100; i++) {
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const randomPrice = (Math.floor(Math.random() * 50) + 5) * 10000; // Giá ngẫu nhiên từ 50k - 550k
    const randomSold = Math.floor(Math.random() * 5000) + 10; // Đã bán ngẫu nhiên
    const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    productsToInsert.push({
      name: `${randomPrefix} ${randomSuffix} mẫu 00${i}`,
      price: `${randomPrice.toLocaleString('vi-VN')}đ`,
      sold: `${randomSold}`,
      image: randomImg
    });
  }

  console.log("Đang đẩy 100 sản phẩm vào Database...");
  // Lệnh lưu 1 cục 100 sản phẩm vào db
  await prisma.product.createMany({
    data: productsToInsert
  });
  console.log("Tuyệt vời! Đã thêm thành công 100 sản phẩm!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });