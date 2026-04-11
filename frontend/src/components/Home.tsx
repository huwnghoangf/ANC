import { useNavigate, Navigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 1, name: 'Thời Trang Nam', icon: '👕' },
  { id: 2, name: 'Điện Thoại & Phụ Kiện', icon: '📱' },
  { id: 3, name: 'Thiết Bị Điện Tử', icon: '💻' },
  { id: 4, name: 'Sức Khỏe & Sắc Đẹp', icon: '💄' },
  { id: 5, name: 'Giày Dép', icon: '👟' },
  { id: 6, name: 'Đồng Hồ', icon: '⌚' },
];

const PRODUCTS = [
  { id: 1, name: 'Áo thun nam cotton thoáng mát', price: '99.000đ', sold: '1,2k', image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsmr0k80v2yv15_tn' },
  { id: 2, name: 'Tai nghe Bluetooth không dây', price: '250.000đ', sold: '850', image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsth4s30iit5ce_tn' },
  { id: 3, name: 'Ốp lưng iPhone 15 Pro Max', price: '50.000đ', sold: '5,4k', image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ls8u7v1tq8fxf6_tn' },
  { id: 4, name: 'Bàn phím cơ gaming RGB', price: '890.000đ', sold: '340', image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsmr0k80whip43_tn' },
  { id: 5, name: 'Chuột không dây Logitech', price: '199.000đ', sold: '2k', image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsmr0k80xx3545_tn' },
  { id: 6, name: 'Sạc dự phòng 10000mAh', price: '320.000đ', sold: '1,5k', image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsmr0k80zblld6_tn' },
];

export default function Home() {
  const navigate = useNavigate();
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '50px' }}>
      <header style={{ backgroundColor: '#ee4d2d', padding: '15px 0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <h1 style={{ color: 'white', margin: 0, fontSize: '24px', cursor: 'pointer' }}>🛒 ANC Store</h1>
          <div style={{ flex: 1, margin: '0 40px', display: 'flex' }}>
            <input type="text" placeholder="Tìm kiếm sản phẩm, thương hiệu..." style={{ width: '100%', padding: '10px 15px', borderRadius: '2px', border: 'none', outline: 'none' }} />
            <button style={{ backgroundColor: '#fb5533', color: 'white', border: 'none', padding: '0 20px', cursor: 'pointer', borderRadius: '0 2px 2px 0' }}>Tìm</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'white' }}>
            <span style={{ fontSize: '14px' }}>Chào, <strong>{user.fullName}</strong></span>
            <button onClick={handleLogout} style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Đăng Xuất</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
        <div style={{ width: '100%', height: '250px', backgroundColor: '#ffd5cd', borderRadius: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ee4d2d', fontSize: '24px', fontWeight: 'bold' }}>
          MỪNG BẠN ĐẾN VỚI ANC STORE - SIÊU SALE GIẢM GIÁ 50%
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>DANH MỤC</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px', cursor: 'pointer', padding: '10px', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{cat.icon}</div>
                <span style={{ fontSize: '14px', textAlign: 'center', color: '#555' }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 style={{ margin: '0 0 15px 0', color: '#ee4d2d', backgroundColor: 'white', padding: '15px', borderBottom: '2px solid #ee4d2d' }}>GỢI Ý HÔM NAY</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
          {PRODUCTS.map(product => (
            <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '2px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)'}>
              <div style={{ width: '100%', paddingTop: '100%', position: 'relative', backgroundColor: '#fafafa' }}>
                <img src={product.image} alt={product.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div style={{ fontSize: '12px', color: '#333', lineHeight: '16px', height: '32px', overflow: 'hidden', marginBottom: '10px' }}>{product.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#ee4d2d', fontWeight: 'bold', fontSize: '16px' }}>{product.price}</span>
                  <span style={{ fontSize: '12px', color: 'gray' }}>Đã bán {product.sold}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}