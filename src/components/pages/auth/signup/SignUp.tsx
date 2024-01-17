import React, { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import styles from './SignUp.module.css';
import { Button } from '@/components/Button';
import { validateInput } from '@/utils';
import { signUp } from '@/services/auth';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { LOCAL_STORAGE_TOKEN } from '@/constants';

interface ErrorType {
  [key: string]: string;
}

export const SignUp: FC = () => {
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<ErrorType>({});
  const [signUpError, setSignUpError] = useState('');

  const inputHandler = (name: string, inputValue: string) => {
    setValues(prevValue => ({ ...prevValue, [name]: inputValue }));

    const errorMessages: ErrorType = {
      firstName: 'Enter you first name',
      lastName: 'Enter you last name',
      email: 'Invalid email',
      password: 'Password must have 5-12 characters, special symbol, and uppercase letter',
    };

    const inputValid = validateInput(inputValue, name);
    const updatedErrors = { ...errors };

    if (!inputValid && inputValue !== '') {
      updatedErrors[name] = errorMessages[name];
    } else {
      delete updatedErrors[name];
    }

    if (name === 'confirmPassword') {
      if (inputValue !== values.password) {
        updatedErrors.confirmPassword = 'Password did not match';
      } else {
        delete updatedErrors.confirmPassword;
      }
    }
    setErrors(updatedErrors);
  };

  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };
  const router = useRouter();
  const handleSingUp = async () => {
    try {
      const response = await signUp({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });

      if (response && response.token) {
        const token = response.token;
        if (typeof window !== 'undefined') {
          await Cookies.set(LOCAL_STORAGE_TOKEN, token, { expires: 7, secure: true });
          await router.push('/');
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setSignUpError(error.response.data.message);
      } else {
        console.error('Error during registration:', error);
      }
    }
  };

  const signUpDisabled =
    !values.firstName ||
    !values.lastName ||
    !values.email ||
    !values.password ||
    !values.confirmPassword ||
    Object.keys(errors).length !== 0;

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.form}>
          <div className={styles.contentForm}>
            <div className={styles.headText}> Sign Up</div>
            <TextInput
              label="First Name"
              onBlur={() => setTouchedFields(prev => ({ ...prev, firstName: true }))}
              name="firstName"
              value={values.firstName}
              onChange={newValue => inputHandler('firstName', newValue)}
              placeholder={'Enter your first name'}
              error={touchedFields.firstName ? errors.firstName : ''}
            />
            <TextInput
              label="Last Name"
              onBlur={() => setTouchedFields(prev => ({ ...prev, lastName: true }))}
              name="lastName"
              value={values.lastName}
              onChange={newValue => inputHandler('lastName', newValue)}
              placeholder={'Enter your last name'}
              error={touchedFields.lastName ? errors.lastName : ''}
            />
            <TextInput
              label="Email"
              type="email"
              onBlur={() => setTouchedFields(prev => ({ ...prev, email: true }))}
              name="email"
              value={values.email}
              onChange={newValue => inputHandler('email', newValue)}
              placeholder={'Enter your email address'}
              error={touchedFields.email ? errors.email : ''}
            />
            <TextInput
              label="Password"
              type="password"
              onBlur={() => setTouchedFields(prev => ({ ...prev, password: true }))}
              name="password"
              value={values.password || ''}
              onChange={newValue => inputHandler('password', newValue)}
              placeholder={'Min. 8 characters'}
              error={touchedFields.password ? errors.password : ''}
            />
            <TextInput
              label="Confirm password"
              onBlur={() => setTouchedFields(prev => ({ ...prev, confirmPassword: true }))}
              name="confirmPassword"
              value={values.confirmPassword || ''}
              onChange={newValue => inputHandler('confirmPassword', newValue)}
              placeholder={'Min. 8 characters'}
              error={touchedFields.confirmPassword ? errors.confirmPassword : ''}
              type="password"
            />
            {signUpError && <div className={styles.signUpError}>{signUpError}</div>}
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
            <Button disabled={signUpDisabled} text="Sign Up" onClick={handleSingUp} size={'medium'} />
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
