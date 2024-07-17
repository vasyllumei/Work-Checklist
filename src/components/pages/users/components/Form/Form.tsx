import React from 'react';
import { TextInput } from '@/components/TextInput';
import { FormControl, MenuItem, Select } from '@mui/material';
import { UserRoleType } from '@/types/User';
import { useUsersContext } from '@/components/pages/users/providers/userProvider';
import useFieldError from '@/hooks/useFieldError';
import styles from './Form.module.css';
export const Form = () => {
  const { formik, isEditMode } = useUsersContext();
  const { getFieldError } = useFieldError(formik.touched, formik.errors);

  return (
    <form>
      <TextInput
        dataTestId="firstName"
        label="First Name"
        name="firstName"
        value={formik.values.firstName || ''}
        onChange={value => {
          formik.setFieldValue('firstName', value);
        }}
        placeholder="Enter first name"
        error={getFieldError('firstName')}
      />
      <TextInput
        dataTestId="lastName"
        label="Last Name"
        name="lastName"
        value={formik.values.lastName || ''}
        onChange={value => {
          formik.setFieldValue('lastName', value);
        }}
        placeholder="Enter last name"
        error={getFieldError('lastName')}
      />

      <TextInput
        dataTestId="email"
        label="Email"
        name="email"
        type="email"
        value={formik.values.email || ''}
        onChange={value => formik.setFieldValue('email', value)}
        placeholder="Enter email address"
        error={getFieldError('email')}
        disabled={isEditMode}
      />

      {!isEditMode && (
        <TextInput
          dataTestId="password"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password || ''}
          onChange={value => formik.setFieldValue('password', value)}
          placeholder="Enter password"
          error={getFieldError('password')}
        />
      )}
      <div data-testid="modalActionsButtons">
        <FormControl variant="standard" sx={{ m: 2, minWidth: 150 }}>
          <Select
            data-testid="role-select"
            value={formik.values?.role || UserRoleType.USER}
            onChange={event => {
              formik.setFieldValue('role', event.target.value as UserRoleType);
            }}
          >
            <MenuItem value={UserRoleType.USER}>User</MenuItem>
            <MenuItem value={UserRoleType.ADMIN}>Admin</MenuItem>
          </Select>
          {formik.errors.createUserError && (
            <div className={styles.createUserError}>{getFieldError('createUserError')}</div>
          )}
        </FormControl>
      </div>
    </form>
  );
};
