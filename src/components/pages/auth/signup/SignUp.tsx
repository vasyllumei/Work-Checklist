import React, { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import { useRouter } from 'next/router';
import styles from './SignUp.module.css';
import { Button } from '@/components/Button';

export const SignUp: FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    router.push('/success');
  };
  const login = () => {
    console.log(password);
    router.push('/');
  };
  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.form}>
          <div>
            <div className={styles.headText}> Sign Up </div>
            <div className={styles.lineGroup}>
              <hr className={styles.lineForm} />
              <div className={styles.orForm}>or</div>
              <hr className={styles.lineForm} />
            </div>
            <form onSubmit={handleSubmit}>
              <label>
                First Name:
                <TextInput
                  name="first name"
                  value={firstName}
                  onChange={setFirstName}
                  placeHolder={'Min. 8 characters'}
                />
              </label>
              <label>
                Last Name:
                <TextInput name="last name" value={lastName} onChange={setLastName} placeHolder={'Min. 8 characters'} />
              </label>
              <label>
                Email:
                <TextInput name="email" value={email} onChange={setEmail} placeHolder={'Enter your email address'} />
              </label>
              <label>
                Password:
                <TextInput name="password" value={password} onChange={setPassword} placeHolder={'Min. 8 characters'} />
              </label>
              <label>
                Confirm Password:
                <TextInput
                  name="confirmPasswoird"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeHolder={'Min. 8 characters'}
                />
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
              </div>
              <Button text="Sign In" onClick={login} />
            </form>
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
