export const validateEmail = (value: string): boolean => {
  const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(String(value).toLowerCase());
};

export const validatePassword = (value: string): boolean => {
  return /^(?=.*[A-Z])(?=.*[_\W])(?=.{5,12}$)/.test(value);
};
