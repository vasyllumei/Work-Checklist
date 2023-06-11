export const validateInput = (value: string, key: string): boolean => {
  if (key === 'email') {
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  }

  if (key === 'password') {
    return /^(?=.*[A-Z])(?=.*[_\W])(?=.{5,12}$)/.test(value);
  }

  if (key === 'firstName') {
    return value.trim() !== '';
  }

  if (key === 'lastName') {
    return value.trim() !== '';
  }

  if (key === 'confirmPassword') {
    return /^(?=.*[A-Z])(?=.*[_\W])(?=.{5,12}$)/.test(value);
  }

  return true;
};
