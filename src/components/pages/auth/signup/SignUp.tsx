import React, { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import styles from './SignUp.module.css';
import { Button } from '@/components/Button';
import { signUp } from '@/services/auth';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { LOCAL_STORAGE_TOKEN } from '@/constants';
import { useFormik } from 'formik';
import { signUpValidationSchema } from '@/components/pages/auth/signup/utils';
import useFieldError from '@/hooks/useFieldError';
import { LanguageMenu } from 'src/components/LanguageMenu';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: initialUserForm,
    validationSchema: signUpValidationSchema,
    onSubmit: async () => {
      await handleSignUp();
    },
  });

  const { getFieldError } = useFieldError(formik.touched, formik.errors);

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
    <main className={styles.signUpContainer}>
      <section className={styles.formSection}>
        <span className={styles.languageMenu}>
          <LanguageMenu />
        </span>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <header>
            <h1 className={styles.formHeader}> {t('signUp')}</h1>
            <p className={styles.formSubheader}> {t('completeForms')} </p>
          </header>
          <hr className={styles.lineForm} />
          <TextInput
            label={t('fName')}
            name="firstName"
            value={formik.values.firstName}
            onChange={value => formik.setFieldValue('firstName', value)}
            placeholder={t('firstName')}
            error={getFieldError('firstName')}
          />
          <TextInput
            label={t('lName')}
            name="lastName"
            value={formik.values.lastName}
            onChange={value => formik.setFieldValue('lastName', value)}
            placeholder={t('lastName')}
            error={getFieldError('lastName')}
          />
          <TextInput
            label={t('userEmail')}
            type="email"
            name="email"
            value={formik.values.email}
            onChange={value => formik.setFieldValue('email', value)}
            placeholder={t('enterYourEmail')}
            error={getFieldError('email')}
          />
          <TextInput
            label={t('userPassword')}
            type="password"
            name="password"
            value={formik.values.password}
            onChange={value => formik.setFieldValue('password', value)}
            placeholder={t('confirmPassword')}
            error={getFieldError('password')}
          />
          <TextInput
            label={t('confirmPassword')}
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={value => formik.setFieldValue('confirmPassword', value)}
            placeholder="Min. 8 characters"
            error={getFieldError('confirmPassword')}
          />
          {formik.errors.signUpError && <div className={styles.loginError}>{formik.errors.signUpError}</div>}
          <div className={styles.checkboxContainer}>
            <label>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMe}
                name="remember"
              />
              {t('keepLogged')}
            </label>
          </div>
          <Button onClick={formik.handleSubmit} text={t('signUp')} type="submit" size="large" />
        </form>
      </section>
      <aside className={styles.infoSection}>
        <div className={styles.infoContainer}>
          <div className={styles.logoContainer}></div>
          <div className={styles.infoBox}>
            <p className={styles.learnInfo}>Welcome! </p>
            <p className={styles.infoLink}>Log in to access your dashboard.</p>
          </div>
        </div>
      </aside>
    </main>
  );
};

export default SignUp;
