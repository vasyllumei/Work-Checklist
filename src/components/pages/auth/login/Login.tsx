import { Button } from '@/components/Button';
import { useRouter } from 'next/router';
import styles from './Login.module.css';
import { validateInput } from '@/utils';
import { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import { login } from '@/services/auth';
import { LOCAL_STORAGE_TOKEN } from '@/constants';
import Cookies from 'js-cookie';

interface ErrorType {
  [key: string]: string;
}

export const Login: FC = () => {
  const [value, setValue] = useState<{ [key: string]: string }>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<ErrorType>({});
  const [touchedFields, setTouchFields] = useState<{ [key: string]: boolean }>({});
  const [loginError, setLoginError] = useState('');

  const inputHandler = (name: string, value: string) => {
    setValue(prevValue => ({ ...prevValue, [name]: value }));

    if (name === 'email') {
      if (!validateInput(value, name) && value !== '') {
        setErrors(prevState => ({
          ...prevState,
          email: 'Invalid Email',
        }));
      } else {
        setErrors(prevState => {
          const updatedErrors = { ...prevState };
          delete updatedErrors[name];
          return updatedErrors;
        });
      }
    } else if (name === 'password') {
      if (!validateInput(value, name) && value !== '') {
        setErrors(prevState => ({
          ...prevState,
          password: 'Password must have 5-12 characters, special symbol, and uppercase letter',
        }));
      } else {
        setErrors(prevState => {
          const updatedErrors = { ...prevState };
          delete updatedErrors[name];
          return updatedErrors;
        });
      }
    }
  };

  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    if (isChecked) {
      Cookies.set('isUserAuthenticated', 'true', { expires: 7, secure: true });
    } else {
      Cookies.remove('isUserAuthenticated');
    }
  };
  const user = {
    userId: 'userId',
    assignedTo: 'assignedTo',
  };
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const response = await login({ email: value.email, password: value.password });

      if (response && response.token) {
        const token = response.token;
        if (typeof window !== 'undefined') {
          Cookies.set(LOCAL_STORAGE_TOKEN, token, { expires: 7, secure: true });
          localStorage.setItem('userId', user.userId);
          localStorage.setItem('assignedTo', user.assignedTo);
          await router.push('/');
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setLoginError(error.response.data.message);
      }
    }
  };

  const signInDisabled = !value.email || !value.password || Object.keys(errors).length !== 0;

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.form}>
          <div className={styles.backLink}>
            <a className={styles.backDashboard} href="/signup">
              &#8249; Back to dashboard
            </a>
          </div>
          <div>
            <div className={styles.headText}> Sign In </div>
            <div className={styles.frontText}>Enter your email and password to sign in!</div>
            <div className={styles.lineGroup}>
              <hr className={styles.lineForm} />
              <div className={styles.orForm}>or</div>
              <hr className={styles.lineForm} />
            </div>

            <TextInput
              label="Email"
              type="email"
              onBlur={() => setTouchFields(prev => ({ ...prev, email: true }))}
              name="email"
              value={value.email || ''}
              onChange={newValue => inputHandler('email', newValue)}
              placeholder="mail@simmmple.com"
              error={touchedFields.email ? errors.email : ''}
            />
            <TextInput
              label="Password"
              type="password"
              onBlur={() => setTouchFields(prev => ({ ...prev, password: true }))}
              name="password"
              value={value.password || ''}
              onChange={newValue => inputHandler('password', newValue)}
              placeholder={'Min. 5 characters'}
              error={touchedFields.password ? errors.password : ''}
            />
            {loginError && <div className={styles.loginError}>{loginError}</div>}
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
              <a className={styles.authLink} href="/signup">
                Forget password?
              </a>
            </div>
            <Button disabled={signInDisabled} text="Sign In" onClick={handleLogin} />
            <div className={styles.forgotText}>
              Not registered yet?
              <a className={styles.authLink} href="/signUp" onClick={() => router.push('/signUp')}>
                Create an Account
              </a>
            </div>
          </div>
          <footer>
            <div className={styles.leftFooter}>
              {' '}
              © 2022 Horizon UI. All Rights Reserved. Made with love by Simmmple!
            </div>
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
