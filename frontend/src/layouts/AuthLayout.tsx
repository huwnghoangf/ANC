import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f3f4f6' 
    }}>
      <div style={{ 
        padding: '2rem', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '450px' 
      }}>
        {/* Tiêu đề chung cho cả 2 trang */}
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          ANC Store
        </h2>
        
        {/* Component <Outlet /> cực kỳ quan trọng! 
            Đây là vị trí mà Router sẽ "bơm" cái form Login hoặc Register vào */}
        <Outlet />
      </div>
    </div>
  );
}