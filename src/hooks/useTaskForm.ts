import { useFormik } from 'formik';
import { taskValidationSchema } from '@/utils';

const initialTaskForm = {
  id: '',
  userId: '',
  assignedTo: '',
  title: '',
  description: '',
  statusId: '',
  avatar: '',
  image: '',
  buttonState: '',
  order: 0,
  editMode: false,
  projectId: '',
};

const useTaskForm = (handleSaveUpdatedTask: () => Promise<void>, handleTaskCreate: () => Promise<void>) => {
  return useFormik({
    initialValues: initialTaskForm,
    validationSchema: taskValidationSchema,
    onSubmit: async values => {
      try {
        if (values.description && values.title) {
          if (values.id) {
            await handleSaveUpdatedTask();
          } else {
            await handleTaskCreate();
          }
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });
};

export default useTaskForm;
