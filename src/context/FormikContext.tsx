import React, { createContext, useContext } from 'react';
import { useFormik, FormikConfig, FormikValues } from 'formik';

interface FormikContextProps<T = FormikValues> {
  initialValues: T;
  onSubmit: FormikConfig<T>['onSubmit'];
  validate?: FormikConfig<T>['validate'];
  children: any;
}

const FormikContext = createContext<ReturnType<typeof useFormik> | undefined>(undefined);

export const FormikProvider: React.FC<FormikContextProps> = ({ initialValues, onSubmit, validate, children }) => {
  const formikBag = useFormik({
    initialValues,
    onSubmit,
    validate,
  });

  return <FormikContext.Provider value={formikBag}>{children}</FormikContext.Provider>;
};

export const useFormikContext = () => {
  const context = useContext(FormikContext);
  if (!context) {
    throw new Error('useFormikContext must be used within a FormikProvider');
  }
  return context;
};
