import { Button } from '@/components/Button';
import { useRouter } from 'next/router';
import styles from './Login.module.css';
import { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import { login } from '@/services/auth';
import Cookies from 'js-cookie';
import { LanguageMenu } from '@/components/Header/LanguageMenu';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { getFieldError } from '@/utils/index';
import { loginValidationSchema } from '@/components/pages/auth/login/utils';

const initialLoginForm = {
  email: '',
  password: '',
  loginError: '',
};

export const Login: FC = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: initialLoginForm,
    validationSchema: loginValidationSchema,
    onSubmit: async () => {
      await handleLogin();
    },
  });

  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    if (isChecked) {
      Cookies.set('isUserAuthenticated', 'true', { expires: 7, secure: true });
    } else {
      Cookies.remove('isUserAuthenticated');
    }
  };
  const router = useRouter();
  const handleLogin = async () => {
    try {
      await login({ email: formik.values.email, password: formik.values.password });
      await router.push('/');
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        formik.setErrors({ loginError: error.response.data.message });
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.form}>
          <LanguageMenu /> <div className={styles.backLink} />
          <div>
            <div className={styles.headText}> {t('signIn')} </div>
            <div className={styles.frontText}>{t('enterEmail')}</div>
            <div className={styles.lineGroup}>
              <hr className={styles.lineForm} />
              <hr className={styles.lineForm} />
            </div>

            <TextInput
              dataTestId="emailInput"
              label={t('userEmail')}
              type="email"
              name="email"
              value={formik.values.email || ''}
              onChange={value => formik.setFieldValue('email', value)}
              placeholder="mail@simmmple.com"
              error={getFieldError('email', formik.touched, formik.errors)}
            />
            <TextInput
              dataTestId="passwordInput"
              label={t('userPassword')}
              type="password"
              name="password"
              value={formik.values.password || ''}
              onChange={value => formik.setFieldValue('password', value)}
              placeholder={t('minLength')}
              error={getFieldError('password', formik.touched, formik.errors)}
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
            <Button dataTestId="buttonSubmit" text={t('signIn')} onClick={formik.handleSubmit} size={'medium'} />
            <div className={styles.forgotText}>
              {t('notRegistered')}
              <a className={styles.authLink} href="/signUp" onClick={() => router.push('/signUp')}>
                {t('createAccount')}
              </a>
            </div>
          </div>
          <footer>
            <div className={styles.leftFooter}>© 2022 Horizon UI. All Rights Reserved. Made with love by Simmmple!</div>
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
