import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. GỌI API LẤY GIỎ HÀNG
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vui lòng đăng nhập!");
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. GỌI API CẬP NHẬT SỐ LƯỢNG (+ / -)
  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Không cho giảm xuống dưới 1 (Muốn xóa thì dùng nút Xóa)
    
    try {
      await axios.put(`http://localhost:5000/api/cart/${cartItemId}`, {
        quantity: newQuantity
      });
      // Cập nhật lại state ở Frontend cho nhanh (đỡ phải load lại API)
      setCartItems(cartItems.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      console.error("Lỗi cập nhật số lượng", error);
    }
  };

  // 3. GỌI API XÓA SẢN PHẨM KHỎI GIỎ
  const handleDeleteItem = async (cartItemId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`);
      // Lọc bỏ sản phẩm đã xóa khỏi danh sách hiện tại
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
    } catch (error) {
      console.error("Lỗi xóa sản phẩm", error);
    }
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Ép kiểu giá về số (nếu giá đang lưu kiểu chuỗi như "500.000đ")
      const priceString = String(item.product.price).replace(/[^0-9]/g, ''); 
      const price = parseInt(priceString) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải giỏ hàng...</div>;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '50px' }}>
      {/* HEADER ĐƠN GIẢN */}
      <header style={{ backgroundColor: '#ee4d2d', padding: '15px 20px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px' }}>⬅️</Link>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Giỏ hàng của bạn</h1>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '8px' }}>
            <h2>Giỏ hàng trống!</h2>
            <p>Vui lòng thêm sản phẩm vào giỏ hàng.</p>
            <Link to="/" style={{ color: '#ee4d2d', textDecoration: 'none', fontWeight: 'bold' }}>Quay lại mua sắm</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* DANH SÁCH SẢN PHẨM */}
            <div style={{ flex: '2', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                  
                  {/* Ảnh sản phẩm */}
                  <img src={item.product.image} alt={item.product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }} />
                  
                  {/* Tên & Giá */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#333' }}>{item.product.name}</h3>
                    <div style={{ color: '#ee4d2d', fontWeight: 'bold' }}>{item.product.price}</div>
                  </div>

                  {/* Nút tăng giảm số lượng */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px', 
                    marginRight: '20px',
                    overflow: 'hidden' // Giúp các nút bo góc đẹp hơn
                  }}>
                    {/* Nút Trừ */}
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} 
                      style={{ 
                        width: '32px', height: '32px', 
                        border: 'none', backgroundColor: '#f5f5f5', 
                        cursor: 'pointer', fontSize: '18px', color: '#555',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    >
                      -
                    </button>
                    
                    {/* Ô hiển thị số lượng */}
                    <div style={{ 
                      width: '40px', height: '32px', 
                      display: 'flex', justifyContent: 'center', alignItems: 'center', 
                      borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', 
                      fontSize: '15px', fontWeight: '500', backgroundColor: 'white'
                    }}>
                      {item.quantity}
                    </div>
                    
                    {/* Nút Cộng */}
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} 
                      style={{ 
                        width: '32px', height: '32px', 
                        border: 'none', backgroundColor: '#f5f5f5', 
                        cursor: 'pointer', fontSize: '18px', color: '#555',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    >
                      +
                    </button>
                  </div>

                  {/* Nút xóa */}
                  <button onClick={() => handleDeleteItem(item.id)} style={{ backgroundColor: 'transparent', border: 'none', color: 'gray', cursor: 'pointer', fontSize: '18px' }}>
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* CỘT TỔNG TIỀN */}
            <div style={{ flex: '1', backgroundColor: 'white', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
              <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Tóm tắt đơn hàng</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span>Tổng tiền:</span>
                <span style={{ color: '#ee4d2d', fontWeight: 'bold', fontSize: '20px' }}>
                  {calculateTotal().toLocaleString('vi-VN')} đ
                </span>
              </div>

              <button style={{ width: '100%', padding: '12px', backgroundColor: '#ee4d2d', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                Tiến hành thanh toán
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}