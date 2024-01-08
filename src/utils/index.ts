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
