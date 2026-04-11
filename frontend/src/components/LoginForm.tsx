import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { loginSchema } from '../utils/formValidation';

export default function LoginForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setServerError('');
      const response = await axios.post('http://localhost:5000/api/login', {
        email: data.email,
        password: data.password,
      });

      // 1. Thông báo thành công
      alert(response.data.message); 

      // 2. Lưu Token và thông tin User vào LocalStorage để dùng dần
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // 3. Chuyển hướng người dùng vào trang chủ (Dashboard / Home)
      // Hiện tại mình cho tạm về trang chủ, lát nữa chúng ta sẽ tạo trang này!
      navigate('/'); 
      
    } catch (error: any) {
      if (error.response) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Không thể kết nối đến máy chủ!');
      }
    }
  };

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Đăng Nhập</h3>
      
      {serverError && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{serverError}</div>}

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <input 
            type="email" 
            placeholder="Email của bạn" 
            {...register('email')} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.email.message}</p>}
        </div>

        <div>
          <input 
            type="password" 
            placeholder="Mật khẩu" 
            {...register('password')} 
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          {errors.password && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.password.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: '12px', backgroundColor: isSubmitting ? '#9ca3af' : '#2563eb', 
            color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
          }}
        >
          {isSubmitting ? 'Đang kiểm tra...' : 'Đăng Nhập'}
        </button>

      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        Chưa có tài khoản? <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none' }}>Đăng ký ngay</Link>
      </p>
    </div>
  );
}