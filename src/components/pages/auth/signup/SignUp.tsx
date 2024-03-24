import React, { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import styles from './SignUp.module.css';
import { Button } from '@/components/Button';
import { signUp } from '@/services/auth';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { LOCAL_STORAGE_TOKEN } from '@/constants';
import { useFormik } from 'formik';
import { getFieldError, signUpValidationSchema } from '@/utils';

const initialUserForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  iconColor: '',
  signUpError: '',
};
export const SignUp: FC = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: initialUserForm,
    validationSchema: signUpValidationSchema,
    onSubmit: async () => {
      await handleSignUp();
    },
  });

  const handleSignUp = async () => {
    try {
      const response = await signUp(formik.values);
      if (response && response.token) {
        const token = response.token;
        Cookies.set(LOCAL_STORAGE_TOKEN, token, { expires: 7, secure: true });
        router.push('/');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        formik.setErrors({ signUpError: error.response.data.message });
      }
    }
  };

  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.form}>
          <div className={styles.contentForm}>
            <div className={styles.headText}> Sign Up</div>
            <TextInput
              label="First Name"
              name="firstName"
              value={formik.values.firstName}
              onChange={value => formik.setFieldValue('firstName', value)}
              placeholder="Enter your first name"
              error={getFieldError('firstName', formik.touched, formik.errors)}
            />
            <TextInput
              label="Last Name"
              name="lastName"
              value={formik.values.lastName}
              onChange={value => formik.setFieldValue('lastName', value)}
              placeholder="Enter your last name"
              error={getFieldError('lastName', formik.touched, formik.errors)}
            />
            <TextInput
              label="Email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={value => formik.setFieldValue('email', value)}
              placeholder="Enter your email address"
              error={getFieldError('email', formik.touched, formik.errors)}
            />
            <TextInput
              label="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={value => formik.setFieldValue('password', value)}
              placeholder="Min. 5 characters"
              error={getFieldError('password', formik.touched, formik.errors)}
            />
            <TextInput
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={value => formik.setFieldValue('confirmPassword', value)}
              placeholder="Min. 8 characters"
              error={getFieldError('confirmPassword', formik.touched, formik.errors)}
            />
            {formik.errors.signUpError && (
              <div className={styles.signUpError}>{getFieldError('signUpError', formik.touched, formik.errors)}</div>
            )}
            <div className={styles.checkboxContainer}>
              <label>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                  name="remember"
                />
                Keep me logged in
              </label>
            </div>
            <Button onClick={formik.handleSubmit} text="Sign Up" type="submit" size="medium" />
          </div>
          <footer>
            <div className={styles.leftFooter}>© 2022 Horizon UI. All Rights Reserved. Made with love by Simple!</div>
          </footer>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.logo}>
          <div className={styles.logoContainer}></div>
          <div className={styles.infoBox}>
            <p className={styles.learnInfo}>Learn more about Horizon UI on </p>
            <p className={styles.infoLink}>horizon-ui.com</p>
          </div>
          <footer>
            <ul className={styles.rightFooter}>
              <li>
                <a>Marketplace</a>
              </li>
              <li>
                <a>License</a>
              </li>
              <li>
                <a>Terms of Use</a>
              </li>
              <li>
                <a>Blog</a>
              </li>
            </ul>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
