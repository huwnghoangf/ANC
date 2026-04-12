const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Xóa dữ liệu cũ cho sạch sẽ (tránh lỗi trùng lặp hoặc rác)
  console.log("Đang xóa dữ liệu cũ...");
  await prisma.cartItem.deleteMany(); 
  await prisma.product.deleteMany();

  const prefixes = ["Áo thun", "Tai nghe", "Ốp lưng", "Bàn phím", "Chuột", "Sạc dự phòng", "Balo", "Đồng hồ"];
  const suffixes = ["cao cấp", "gaming", "thời trang", "chống nước", "chính hãng", "không dây", "thông minh"];

  const productsToInsert = [];

  // Vòng lặp tự động tạo 100 sản phẩm
  for(let i = 1; i <= 100; i++) {
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      const randomPrice = (Math.floor(Math.random() * 50) + 5) * 10000; 
      const randomSold = Math.floor(Math.random() * 5000) + 10;
      
      // 2. SỬA LẠI LINK ẢNH Ở ĐÂY: Dùng Picsum để có ảnh random ổn định không bị chặn
      // Chữ 'anc' + i giúp mỗi ID sản phẩm sẽ ra 1 cái ảnh cố định, không bị đổi loạn xạ mỗi khi F5
      const randomImg = `https://picsum.photos/seed/anc${i}/200/200`;

      productsToInsert.push({
          name: `${randomPrefix} ${randomSuffix} mẫu 00${i}`,
          price: `${randomPrice.toLocaleString('vi-VN')}đ`,
          sold: `${randomSold}`,
          image: randomImg
      })
  }

  console.log("Đang đẩy 100 sản phẩm mới vào Database...");
  await prisma.product.createMany({
      data: productsToInsert
  });

  console.log("Tuyệt vời! Đã thêm thành công 100 sản phẩm có ảnh đẹp!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });