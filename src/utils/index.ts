import * as Yup from 'yup';

export const signUpValidationSchema = Yup.object()
  .shape({
    firstName: Yup.string().min(2, 'Too Short!').max(10, 'Too Long!').required('First name is required'),
    lastName: Yup.string().min(2, 'Too Short!').max(10, 'Too Long!').required('Last name is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address')
      .test('email-format', 'Invalid email address', value => {
        const re =
          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        return re.test(String(value).toLowerCase());
      })
      .when('editMode', (editMode, schema) => {
        if (!editMode[0]) return schema.required('Email is required');
        return schema;
      }),
    editMode: Yup.boolean(),

    password: Yup.string()
      .required('Password is required')
      .test(
        'password-format',
        'Password must contain at least one uppercase letter, one special character, and be 5 to 12 characters long',
        value => {
          return /^(?=.*[A-Z])(?=.*[_\W])(?=.{5,12}$)/.test(value);
        },
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  })
  .when('editMode', (editMode, schema) => {
    if (!editMode[0]) return schema.required('Password is required');
    console.log('editMode', editMode);
    return schema;
  });
export const addEditUserValidationSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name is required'),
  lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name is required'),
  email: Yup.string()
    .email('Invalid email')
    .when('editMode', (editMode, schema) => {
      if (!editMode[0]) return schema.required('Email is required');
      return schema;
    }),
  editMode: Yup.boolean(),
  password: Yup.string()
    .min(4, 'Password is too short - should be 4 chars min')
    .when('editMode', (editMode, schema) => {
      if (!editMode[0]) return schema.required('Password is required');
      console.log('editMode', editMode);
      return schema;
    }),
});
export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Invalid email address'),
  password: Yup.string().required('Password is required'),
});

export const getRandomColor = (userId: string) => {
  if (!userId) {
    return 'defaultColor';
  }
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = ((seed % 360) + 360) % 360;
  const saturation = Math.floor(Math.random() * 50) + 50; // 50-100
  const lightness = Math.floor(Math.random() * 30) + 60; // 60-90
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
export const getFieldError = (
  fieldName: string,
  touched: Record<string, boolean>,
  errors: Record<string, string>,
): string | undefined => {
  const errorField = errors[fieldName as keyof typeof errors];
  const isTouched = touched[fieldName as keyof typeof touched];

  return isTouched && errorField ? errorField : undefined;
};
export const generateFilterString = (filters: { name: string; value: string | string[] }[]): string => {
  return filters
    .map(({ name, value }) => {
      if (Array.isArray(value)) {
        return value.map(val => `${name}=${encodeURIComponent(val)}`).join('&');
      }
      return `${name}=${encodeURIComponent(value)}`;
    })
    .join('&');
};
