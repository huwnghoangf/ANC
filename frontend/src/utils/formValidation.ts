import * as yup from 'yup';

// Bộ quy tắc cho form Đăng ký
export const registerSchema = yup.object({
  fullName: yup.string().required('Vui lòng nhập họ và tên!'),
  email: yup
    .string()
    .email('Email không đúng định dạng!')
    .required('Vui lòng nhập email!'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự!')
    .required('Vui lòng nhập mật khẩu!'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp!')
    .required('Vui lòng xác nhận mật khẩu!'),
});

// Bộ quy tắc cho form Đăng nhập
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email không đúng định dạng!')
    .required('Vui lòng nhập email!'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu!'),
});