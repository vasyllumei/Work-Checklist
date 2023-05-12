import React, { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import styles from './LoginStyles.module.css';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(String(event.target.value).toLowerCase())) {
      setEmailError('Invalid Email');
    } else {
      setEmailError('');
    }
  };
  const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (event.target.value.length < 5 || event.target.value.length > 12) {
      setPasswordError('Password must be longer than 5 and less than 12 characters');
    } else setPasswordError('');
  };

  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const router = useRouter();
  const login = () => {
    console.log(password);
    router.push('/');
  };

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
              {emailError && <div className={styles.errorInput}></div>}
              <TextInput
                name="email"
                value={email}
                onChange={event => emailHandler(event)}
                placeHolder="mail@simmmple.com"
                className={emailError ? styles.invalidInput : ''}
              />
            </label>
            <label className={styles.passwordLabel} htmlFor="uname">
              <b className={styles.inputField}>Password*</b>
              <TextInput
                name="password"
                value={password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => passwordHandler(event)}
                placeHolder={'Min. 5 characters'}
                className={passwordError ? styles.invalidInput : ''}
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
            <Button text="Sign In" onClick={login} />
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
