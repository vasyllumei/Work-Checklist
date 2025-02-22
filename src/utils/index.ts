import * as Yup from 'yup';

export const stringValidation = (field: string) =>
  Yup.string().min(2, `Too Short!`).max(14, `Too Long!`).required(`${field} is required`);

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
  .test('password-format', 'Add uppercase, special character (5-10long)', value => {
    return /^(?=.*[A-Z])(?=.*[_\W])(?=.{5,12}$)/.test(value);
  });

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

export const taskValidationSchema = Yup.object().shape({
  title: stringValidation('Title'),
  description: Yup.string().required('Description is required'),
  editMode: Yup.boolean(),
});

export const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, '');

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
};
