import { useCallback } from 'react';
import { FormikValues, FormikTouched, FormikErrors } from 'formik';

const useFieldError = (touched: FormikTouched<FormikValues>, errors: FormikErrors<FormikValues>) => {
  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      const touchedField = touched[fieldName as keyof typeof touched];
      const errorField = errors[fieldName as keyof typeof errors];

      if (touchedField && typeof errorField === 'string') {
        return errorField;
      }
      return undefined;
    },
    [touched, errors],
  );

  return { getFieldError };
};

export default useFieldError;
