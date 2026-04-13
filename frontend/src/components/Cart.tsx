import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  // XỬ LÝ THANH TOÁN THẬT VỚI API BACKEND
  const handlePayment = async () => {
    // 1. Lấy token để xác thực người dùng
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vui lòng đăng nhập để thanh toán!");
      navigate('/login');
      return;
    }

    setIsProcessingPayment(true); // Bật hiệu ứng loading xoay xoay

    try {
      // 2. Gọi API POST chốt đơn, kèm Header chứa Token
      const response = await axios.post(
        'http://localhost:5000/api/checkout', 
        {
          cartItems: cartItems, // Truyền danh sách giỏ hàng hiện tại
          totalAmount: calculateTotal() // Truyền tổng tiền
        }, 
        {
          headers: { 
            'Authorization': `Bearer ${token}` // <--- ĐÂY LÀ CHỖ ĐỂ CHÈN TOKEN NÈ
          }
        }
      );

      // 3. Xử lý khi Backend báo thành công
      if (response.data.success) {
        setIsProcessingPayment(false); // Tắt loading
        setShowPaymentModal(false);    // Đóng popup
        
        // Báo thành công kèm mã đơn hàng lấy từ Backend trả về
        alert(`🎉 ${response.data.message}\nMã đơn hàng của bạn là: ${response.data.order.orderNumber}`);
        
        // Xóa rỗng giỏ hàng trên giao diện (tránh phải gọi lại API fetchCart)
        setCartItems([]); 
        
        // Chuyển hướng về trang chủ
        navigate('/');
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Có lỗi xảy ra khi kết nối với ngân hàng (hoặc server). Vui lòng thử lại!");
      setIsProcessingPayment(false);
    }
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

              <button 
                onClick={() => setShowPaymentModal(true)} 
                style={{ width: '100%', padding: '12px', backgroundColor: '#ee4d2d', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                Tiến hành thanh toán
              </button>
            </div>

          </div>
        )}
      </main>
      {/* POPUP THANH TOÁN GIẢ LẬP */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '12px',
            width: '400px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ color: '#ee4d2d', marginTop: 0 }}>ANC Mock Pay</h2>
            <p style={{ color: '#555', marginBottom: '20px' }}>
              Số tiền cần thanh toán: <strong style={{ color: '#ee4d2d', fontSize: '18px' }}>{calculateTotal().toLocaleString('vi-VN')} đ</strong>
            </p>

            {isProcessingPayment ? (
              <div style={{ padding: '20px 0' }}>
                <div style={{ 
                  border: '4px solid #f3f3f3', borderTop: '4px solid #ee4d2d', 
                  borderRadius: '50%', width: '40px', height: '40px', 
                  animation: 'spin 1s linear infinite', margin: '0 auto', marginBottom: '15px' 
                }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <p>Đang kết nối với ngân hàng...</p>
              </div>
            ) : (
              <>
                <button 
                  onClick={handlePayment}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0070ba', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
                  💳 Quẹt thẻ nội địa / Visa
                </button>
                <button 
                  onClick={handlePayment}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#a50064', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
                  📱 Thanh toán qua MoMo
                </button>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  style={{ width: '100%', padding: '10px', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
                  Hủy bỏ
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}