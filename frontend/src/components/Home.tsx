import { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = [
  { id: 1, name: 'Thời Trang Nam', icon: '👕' },
  { id: 2, name: 'Điện Thoại & Phụ Kiện', icon: '📱' },
  { id: 3, name: 'Thiết Bị Điện Tử', icon: '💻' },
  { id: 4, name: 'Sức Khỏe & Sắc Đẹp', icon: '💄' },
  { id: 5, name: 'Giày Dép', icon: '👟' },
  { id: 6, name: 'Đồng Hồ', icon: '⌚' },
];

export default function Home() {
  const navigate = useNavigate();
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // --- STATES ---
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States mới cho tính năng Gợi ý tìm kiếm
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // --- API CALLS ---
  const fetchProducts = async (keyword = '') => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products?search=${keyword}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Effect lắng nghe khi gõ phím để gọi API lấy gợi ý
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim() === '') {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/products?search=${searchTerm}`);
        setSuggestions(response.data.slice(0, 8)); 
        setShowSuggestions(true);
      } catch (error) {
        console.error("Lỗi khi tải gợi ý:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Effect ẩn gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- HANDLERS ---
  const handleSearch = () => {
    setShowSuggestions(false);
    fetchProducts(searchTerm);
  };

  const handleSuggestionClick = (suggestionName: string) => {
    setSearchTerm(suggestionName);
    setShowSuggestions(false);
    fetchProducts(suggestionName);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // HÀM MỚI: XỬ LÝ THÊM VÀO GIỎ HÀNG
  const handleAddToCart = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Bạn cần đăng nhập để thêm vào giỏ hàng!');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/cart',
        { productId: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);
      
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ');
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '50px' }}>
      <header style={{ backgroundColor: '#ee4d2d', padding: '15px 0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <h1 onClick={() => { setSearchTerm(''); fetchProducts(''); }} style={{ color: 'white', margin: 0, fontSize: '24px', cursor: 'pointer' }}>🛒 ANC Store</h1>
          
          <div ref={searchRef} style={{ flex: 1, margin: '0 40px', display: 'flex', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm, thương hiệu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => { if(searchTerm.trim() !== '') setShowSuggestions(true); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
              style={{ width: '100%', padding: '10px 15px', borderRadius: '2px', border: 'none', outline: 'none' }} 
            />
            <button 
              onClick={handleSearch}
              style={{ backgroundColor: '#fb5533', color: 'white', border: 'none', padding: '0 20px', cursor: 'pointer', borderRadius: '0 2px 2px 0' }}
            >
              Tìm
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 2px)',
                left: 0,
                width: 'calc(100% - 68px)',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: '2px',
                zIndex: 1000,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {suggestions.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.name)}
                    style={{
                      padding: '12px 15px',
                      cursor: 'pointer',
                      color: '#333',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      borderBottom: '1px solid #f5f5f5'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <span style={{ fontSize: '12px', color: '#888' }}>🔍</span> 
                    {item.name}
                  </div>
                ))}
              </div>
            )}
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

        <h3 style={{ margin: '0 0 15px 0', color: '#ee4d2d', backgroundColor: 'white', padding: '15px', borderBottom: '2px solid #ee4d2d' }}>
          {searchTerm && !showSuggestions ? `KẾT QUẢ TÌM KIẾM CHO "${searchTerm}"` : 'GỢI Ý HÔM NAY'}
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
          {products.length > 0 ? (
            products.map(product => (
              <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '2px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)'}>
                <div style={{ width: '100%', paddingTop: '100%', position: 'relative', backgroundColor: '#fafafa' }}>
                  <img src={product.image} alt={product.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#333', lineHeight: '16px', height: '32px', overflow: 'hidden', marginBottom: '10px' }}>{product.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#ee4d2d', fontWeight: 'bold', fontSize: '16px' }}>{product.price}</span>
                      <span style={{ fontSize: '12px', color: 'gray' }}>Đã bán {product.sold}</span>
                    </div>
                  </div>
                  
                  {/* NÚT THÊM VÀO GIỎ HÀNG */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                      handleAddToCart(product.id);
                    }}
                    style={{
                      marginTop: '12px',
                      width: '100%',
                      padding: '8px 0',
                      backgroundColor: '#ee4d2d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d73e1f'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ee4d2d'}
                  >
                    Thêm vào giỏ
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div style={{ padding: '20px', gridColumn: '1 / -1', textAlign: 'center', color: '#555' }}>
              Không tìm thấy sản phẩm nào!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}