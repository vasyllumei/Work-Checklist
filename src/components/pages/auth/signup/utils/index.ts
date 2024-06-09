import * as Yup from 'yup';
import { confirmPasswordValidation, emailValidation, passwordValidation } from '@/utils';
export const stringValidation = (field: string) =>
  Yup.string().min(2, `Too Short!`).max(10, `Too Long!`).required(`${field} is required`);
export const signUpValidationSchema = Yup.object().shape({
  firstName: stringValidation('First name'),
  lastName: stringValidation('Last name'),
  email: emailValidation,
  editMode: Yup.boolean(),
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
});
