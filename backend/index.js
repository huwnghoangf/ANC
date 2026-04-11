const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt'); // Thư viện mã hóa
const jwt = require('jsonwebtoken'); // Thư viện tạo Token

const app = express();
const prisma = new PrismaClient();

// Chìa khóa bí mật để tạo Token (Thực tế đi làm sẽ giấu vào file .env)
const SECRET_KEY = "chuoi_bao_mat_cua_anc_store"; 

app.use(cors());
app.use(express.json());

// ==========================================
// API: ĐĂNG KÝ TÀI KHOẢN
// ==========================================
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Kiểm tra email đã có người dùng chưa
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được sử dụng!' });
    }

    // 2. Mã hóa mật khẩu (băm 10 vòng)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Lưu User mới vào Database
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword, // Lưu mật khẩu đã mã hóa, tuyệt đối không lưu password gốc
      },
    });

    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
});

// ==========================================
// API: ĐĂNG NHẬP
// ==========================================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm User trong Database theo Email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    // 2. So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong Database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    // 3. Tạo Token (Vé thông hành) có hạn dùng trong 1 ngày
    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      SECRET_KEY, 
      { expiresIn: '1d' }
    );

    // 4. Trả về Token và thông tin User (không trả về password)
    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
});

// ==========================================
// API: LẤY DANH SÁCH & TÌM KIẾM SẢN PHẨM
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    // 1. Lấy từ khóa 'search' từ đường dẫn URL
    const { search } = req.query; 

    // 2. Tạo điều kiện lọc (chứa từ khóa, phân biệt hoa thường tuỳ database)
    const whereCondition = search 
      ? { 
          name: { 
            contains: search 
          } 
        } 
      : {}; 

    // 3. Lấy dữ liệu từ Database
    const products = await prisma.product.findMany({ 
      where: whereCondition,
      orderBy: { createdAt: 'desc' } 
    });
    
    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm' });
  }
});

// Khởi động server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});