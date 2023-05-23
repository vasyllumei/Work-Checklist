import { Button } from '@/components/Button';
import { useRouter } from 'next/router';
import styles from './LoginStyles.module.css';
import { validateInput } from '@/utils';
import { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';

interface ErrorType {
  email?: string;
  password?: string;
}

export const Login: FC = () => {
  const [value, setValue] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchFields] = useState<{ [key: string]: boolean }>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<ErrorType>({});

  const inputHandler = (name: string, value: string) => {
    setValue(prevValue => ({ ...prevValue, [name]: value }));

    setTouchFields(prev => ({ ...prev, [name]: true }));

    if (name === 'email') {
      if (!validateInput(value, name) && touchedFields[name]) {
        setErrors(prevState => ({
          ...prevState,
          email: 'Invalid Email',
        }));
      } else {
        setErrors(prevState => {
          const { email, ...restErrors } = prevState;
          return restErrors;
        });
      }
    } else if (name === 'password') {
      if (!validateInput(value, name) && touchedFields[name]) {
        setErrors(prevState => ({
          ...prevState,
          password: 'Password must have 5-12 characters, special symbol, and uppercase letter',
        }));
      } else {
        setErrors(prevState => {
          const { password, ...restErrors } = prevState;
          return restErrors;
        });
      }
    }
  };
  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const router = useRouter();
  const login = () => {
    console.log(value);
    router.push('/');
  };
  const signUp = () => {
    console.log(value);
    router.push('/signUp');
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
            <label className={styles.emailLabel} htmlFor="uname">
              <b className={styles.inputField}>Email*</b>
              <div className={styles.mailInput}>
                <TextInput
                  name="email"
                  value={value.email || ''}
                  onChange={newValue => inputHandler('email', newValue)}
                  placeHolder="mail@simmmple.com"
                  error={errors.email}
                />
              </div>
            </label>
            <label className={styles.passwordLabel} htmlFor="uname">
              <b className={styles.inputField}>Password*</b>
              <div className={styles.passwordInput}>
                <TextInput
                  name="password"
                  value={value.password || ''}
                  onChange={newValue => inputHandler('password', newValue)}
                  placeHolder={'Min. 5 characters'}
                  error={errors.password}
                  type="password"
                />
              </div>
            </label>
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
            <Button disabled={signInDisabled} text="Sign In" onClick={login} />
            <div className={styles.forgotText}>
              Not registered yet?
              <a className={styles.authLink} href="/signUp" onClick={signUp}>
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
