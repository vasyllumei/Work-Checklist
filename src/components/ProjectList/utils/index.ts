import * as Yup from 'yup';
import { stringValidation } from '@/utils';

export const projectValidationSchema = Yup.object().shape({
  title: stringValidation('Title'),
  description: Yup.string().required('Description is required'),
});
