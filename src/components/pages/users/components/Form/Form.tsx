import React from 'react';
import { TextInput } from '@/components/TextInput';
import { getFieldError } from '@/utils';
import { FormControl, MenuItem, Select } from '@mui/material';
import { UserRoleType } from '@/types/User';
import styles from '@/components/pages/users/Users.module.css';
import { useUsersContext } from '@/components/pages/users/providers/userProvider';

const Form = () => {
  const { formik, isEditMode } = useUsersContext();
  return (
    <>
      <div>
        <TextInput
          dataTestId="firstName"
          label="First Name"
          name="firstName"
          value={formik.values.firstName || ''}
          onChange={value => {
            formik.setFieldValue('firstName', value);
          }}
          placeholder="Enter first name"
          error={getFieldError('firstName', formik.touched, formik.errors)}
        />
      </div>
      <div>
        <TextInput
          dataTestId="lastName"
          label="Last Name"
          name="lastName"
          value={formik.values.lastName || ''}
          onChange={value => {
            formik.setFieldValue('lastName', value);
          }}
          placeholder="Enter last name"
          error={getFieldError('lastName', formik.touched, formik.errors)}
        />
      </div>
      <div>
        <TextInput
          dataTestId="email"
          label="Email"
          name="email"
          type="email"
          value={formik.values.email || ''}
          onChange={value => formik.setFieldValue('email', value)}
          placeholder="Enter email address"
          error={getFieldError('email', formik.touched, formik.errors)}
          disabled={isEditMode}
        />
      </div>
      {!isEditMode && (
        <TextInput
          dataTestId="password"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password || ''}
          onChange={value => formik.setFieldValue('password', value)}
          placeholder="Enter password"
          error={getFieldError('password', formik.touched, formik.errors)}
        />
      )}
      <div data-testid="modalActionsButtons">
        <FormControl variant="standard" sx={{ m: 2, minWidth: 300 }}>
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
            <div className={styles.createUserError}>
              {getFieldError('createUserError', formik.touched, formik.errors)}
            </div>
          )}
        </FormControl>
      </div>
    </>
  );
};

export default Form;
