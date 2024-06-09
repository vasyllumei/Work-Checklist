import * as Yup from 'yup';
import { stringValidation } from '@/utils';

export const taskValidationSchema = Yup.object().shape({
  title: stringValidation('Title'),
  description: Yup.string().required('Description is required'),
  editMode: Yup.boolean(),
});
