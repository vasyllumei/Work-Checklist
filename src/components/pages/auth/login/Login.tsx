import React, { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import styles from './LoginStyles.module.css';
import { validateEmail, validatePassword } from '@/utils';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  console.log(errors);
  const emailHandler = (value: string) => {
    setEmail(value);
    if (!validateEmail(value)) {
      setErrors(prevState => ({
        ...prevState,
        email: 'Invalid Email',
      }));
    } else {
      setErrors(prevState => {
        delete prevState.email;
        return prevState;
      });
    }
  };
  const passwordHandler = (value: string) => {
    setPassword(value);
    if (!validatePassword(value)) {
      setErrors(prevState => ({
        ...prevState,
        password: 'Invalid Password',
      }));
    } else {
      setErrors(prevState => {
        delete prevState.password;
        return prevState;
      });
    }
  };

  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const router = useRouter();
  const login = () => {
    console.log(password);
    router.push('/');
  };
  const signInDisabled = !email || !password || Object.keys(errors).length !== 0;
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
            <label htmlFor="uname">
              <b className={styles.inputField}>Email*</b>
              <TextInput
                name="email"
                value={email}
                onChange={emailHandler}
                placeHolder="mail@simmmple.com"
                error={errors.email}
              />
            </label>
            <label className={styles.passwordLabel} htmlFor="uname">
              <b className={styles.inputField}>Password*</b>
              <TextInput
                name="password"
                value={password}
                onChange={passwordHandler}
                placeHolder={'Min. 5 characters'}
                error={errors.password}
              />
              <div className={styles.eyePassword}></div>
            </label>
            <div className={styles.checkboxContainer}>
              <label>
                <input type="checkbox" checked={rememberMe} onChange={handleRememberMe} name="remember" />
                Keep me logged in
              </label>
              <a className={styles.authLink} href="/signup">
                Forget password?
              </a>
            </div>
            <Button disabled={signInDisabled} text="Sign In" onClick={login} />
            <div className={styles.forgotText}>
              Not registered yet?
              <a className={styles.authLink} href="/signup">
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
