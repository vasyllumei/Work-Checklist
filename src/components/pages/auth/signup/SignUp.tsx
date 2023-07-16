import React, { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import styles from './SignUp.module.css';
import { Button } from '@/components/Button';
import { validateInput } from '@/utils';
import { signUp } from '@/services/auth';
import { useRouter } from 'next/router';

interface ErrorType {
  [key: string]: string;
}

export const SignUp: FC = () => {
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<ErrorType>({});
  const [signUpError, setSignUpError] = useState('');

  const router = useRouter();

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

  const handleSingUp = async () => {
    try {
      if (values.email && values.password) {
        await signUp({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        });

        router.push('/users');
      }
    } catch (error: any) {
      setSignUpError(error.response.data.message);
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
              label="First Name:"
              onBlur={() => setTouchedFields(prev => ({ ...prev, firstName: true }))}
              name="firstName"
              value={values.firstName}
              onChange={newValue => inputHandler('firstName', newValue)}
              placeHolder={'Enter your first name'}
              error={touchedFields.firstName ? errors.firstName : ''}
            />
            <TextInput
              label="Last Name"
              onBlur={() => setTouchedFields(prev => ({ ...prev, lastName: true }))}
              name="lastName"
              value={values.lastName}
              onChange={newValue => inputHandler('lastName', newValue)}
              placeHolder={'Enter your first name'}
              error={touchedFields.lastName ? errors.lastName : ''}
            />
            <TextInput
              label="Email"
              onBlur={() => setTouchedFields(prev => ({ ...prev, email: true }))}
              name="email"
              value={values.email}
              onChange={newValue => inputHandler('email', newValue)}
              placeHolder={'Enter your email address'}
              error={touchedFields.email ? errors.email : ''}
            />
            <TextInput
              label="Password"
              onBlur={() => setTouchedFields(prev => ({ ...prev, password: true }))}
              name="password"
              value={values.password || ''}
              onChange={newValue => inputHandler('password', newValue)}
              placeHolder={'Min. 8 characters'}
              error={touchedFields.password ? errors.password : ''}
              type="password"
            />
            <TextInput
              label="Confirm Password"
              onBlur={() => setTouchedFields(prev => ({ ...prev, confirmPassword: true }))}
              name="confirmPassword"
              value={values.confirmPassword || ''}
              onChange={newValue => inputHandler('confirmPassword', newValue)}
              placeHolder={'Min. 8 characters'}
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
            <Button disabled={signUpDisabled} text="Sign Up" onClick={handleSingUp} />
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

export default SignUp;
