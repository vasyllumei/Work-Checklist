import * as Yup from 'yup';

export const stringValidation = (field: string) =>
  Yup.string().min(2, `Too Short!`).max(10, `Too Long!`).required(`${field} is required`);

export const emailValidation = Yup.string()
  .email('Invalid email address')
  .when('editMode', (editMode, schema) => (!editMode ? schema.required('Email is required') : schema))
  .required('Email is required')
  .test('email-format', 'Invalid email address', value => {
    const re =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  });

export const passwordValidation = Yup.string()
  .required('Password is required')
  .when('editMode', (editMode, schema) => (!editMode ? schema.required('Password is required') : schema))
  .test(
    'password-format',
    'Password must contain at least one uppercase letter, one special character, and be 5 to 12 characters long',
    value => {
      return /^(?=.*[A-Z])(?=.*[_\W])(?=.{5,12}$)/.test(value);
    },
  );

export const confirmPasswordValidation = Yup.string()
  .oneOf([Yup.ref('password')], 'Passwords must match')
  .required('Confirm password is required');

export const getRandomColor = (id: string) => {
  if (!id) {
    return 'defaultColor';
  }
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = ((seed % 360) + 360) % 360;
  const saturation = Math.floor(Math.random() * 50) + 50;
  const lightness = Math.floor(Math.random() * 30) + 60;
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
