import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Home from './components/Home';

// 👇 1. IMPORT COMPONENT CART VÀO ĐÂY
// (Nếu bạn lưu ở thư mục khác thì nhớ sửa lại đường dẫn nhé)
import Cart from './components/Cart'; 

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />, 
  },
  // 👇 2. THÊM KHỐI NÀY VÀO: Định nghĩa đường dẫn cho Giỏ hàng
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: 'register',
        element: <RegisterForm />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;