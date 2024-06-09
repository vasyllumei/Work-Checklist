import * as Yup from 'yup';
import { emailValidation } from '@/utils';

export const loginValidationSchema = Yup.object().shape({
  email: emailValidation,
  password: Yup.string().required('Password is required'),
});
