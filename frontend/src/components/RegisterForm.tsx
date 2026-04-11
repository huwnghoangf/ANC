import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { registerSchema } from '../utils/formValidation';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  // Khởi tạo React Hook Form kết hợp với Yup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  // Hàm xử lý khi bấm nút Đăng ký
  const onSubmit = async (data: any) => {
    try {
      setServerError('');
      // Gọi API sang Backend (cổng 5000 mà chúng ta đã code)
      const response = await axios.post('http://localhost:5000/api/register', {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      alert(response.data.message); // Báo thành công
      navigate('/login'); // Chuyển hướng người dùng sang trang Đăng nhập
      
    } catch (error: any) {
      // Bắt lỗi từ Server trả về (ví dụ: Trùng email)
      if (error.response) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Không thể kết nối đến máy chủ!');
      }
    }
  };

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Tạo Tài Khoản</h3>
      
      {/* Hiển thị lỗi từ server nếu có */}
      {serverError && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{serverError}</div>}

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Ô nhập Họ Tên */}
        <div>
          <input 
            type="text" 
            placeholder="Họ và tên" 
            {...register('fullName')} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          {errors.fullName && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.fullName.message}</p>}
        </div>

        {/* Ô nhập Email */}
        <div>
          <input 
            type="email" 
            placeholder="Email" 
            {...register('email')} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.email.message}</p>}
        </div>

        {/* Ô nhập Mật khẩu */}
        <div>
          <input 
            type="password" 
            placeholder="Mật khẩu" 
            {...register('password')} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          {errors.password && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.password.message}</p>}
        </div>

        {/* Ô Nhập lại Mật khẩu */}
        <div>
          <input 
            type="password" 
            placeholder="Xác nhận mật khẩu" 
            {...register('confirmPassword')} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          {errors.confirmPassword && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.confirmPassword.message}</p>}
        </div>

        {/* Nút Submit */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: '12px', backgroundColor: isSubmitting ? '#9ca3af' : '#2563eb', 
            color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
          }}
        >
          {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký'}
        </button>

      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        Đã có tài khoản? <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Đăng nhập</Link>
      </p>
    </div>
  );
}