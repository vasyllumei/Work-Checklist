import React, { ChangeEvent } from 'react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/router';
import styles from './Login.module.css';
import { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import { login } from '@/services/auth';
import Cookies from 'js-cookie';
import { LanguageMenu } from 'src/components/LanguageMenu';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { loginValidationSchema } from '@/components/pages/auth/login/utils';
import useFieldError from '@/hooks/useFieldError';
import Loader from '@/components/Loader/Loader';

const initialLoginForm = {
  email: '',
  password: '',
  loginError: '',
};

export const Login: FC = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: initialLoginForm,
    validationSchema: loginValidationSchema,
    onSubmit: async () => {
      await handleLogin();
    },
  });
  const { getFieldError } = useFieldError(formik.touched, formik.errors);
  const router = useRouter();

  const handleRememberMe = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    if (isChecked) {
      Cookies.set('isUserAuthenticated', 'true', { expires: 7, secure: true });
    } else {
      Cookies.remove('isUserAuthenticated');
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login({ email: formik.values.email, password: formik.values.password });
      await router.push('/');
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        formik.setErrors({ loginError: error.response.data.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.loginContainer}>
      <section className={styles.formSection}>
        <span className={styles.languageMenu}>
          <LanguageMenu />
        </span>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <header>
            <h1 className={styles.formHeader}> {t('signIn')} </h1>
            <p className={styles.formSubheader}>{t('enterEmail')}</p>
          </header>
          <hr className={styles.lineForm} />
          <TextInput
            dataTestId="emailInput"
            label={t('userEmail')}
            type="email"
            name="email"
            value={formik.values.email || ''}
            onChange={value => formik.setFieldValue('email', value)}
            placeholder="mail@simmmple.com"
            error={getFieldError('email')}
          />
          <TextInput
            dataTestId="passwordInput"
            label={t('userPassword')}
            type="password"
            name="password"
            value={formik.values.password || ''}
            onChange={value => formik.setFieldValue('password', value)}
            placeholder={t('minLength')}
            error={getFieldError('password')}
          />
          {formik.errors.loginError && <div className={styles.loginError}>{formik.errors.loginError}</div>}
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
            <a className={styles.authLink} href="/signup">
              {t('forgetPassword')}
            </a>
          </div>
          <Button
            dataTestId="buttonSubmit"
            type="submit"
            text={t('signIn')}
            onClick={formik.handleSubmit}
            size={'large'}
          />
          <div className={styles.createAccount}>
            {t('notRegistered')}
            <a className={styles.authLink} href="/signUp" onClick={() => router.push('/signUp')}>
              {t('createAccount')}
            </a>
          </div>
        </form>
      </section>
      <aside className={styles.infoSection}>
        <div className={styles.infoContainer}>
          <div className={styles.logoContainer}></div>
          <div className={styles.infoBox}>
            <p className={styles.learnInfo}>Learn more about Horizon UI on </p>
            <p className={styles.infoLink}>horizon-ui.com</p>
          </div>
        </div>
      </aside>
      {isLoading && (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      )}
    </main>
  );
};
