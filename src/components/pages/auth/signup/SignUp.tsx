import React, { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import { useRouter } from 'next/router';
import styles from './SignUp.module.css';

export const SignUp: FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    router.push('/success');
  };

  return (
    <div className={styles.mainContainer}>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <TextInput value={firstName} onChange={setFirstName} placeHolder={'Min. 8 characters'} />
        </label>
        <label>
          Last Name:
          <TextInput value={lastName} onChange={setLastName} placeHolder={'Min. 8 characters'} />
        </label>
        <label>
          Email:
          <TextInput value={email} onChange={setEmail} placeHolder={'Enter your email address'} />
        </label>
        <label>
          Password:
          <TextInput value={password} onChange={setPassword} placeHolder={'Min. 8 characters'} />
        </label>
        <label>
          Confirm Password:
          <TextInput value={confirmPassword} onChange={setConfirmPassword} placeHolder={'Min. 8 characters'} />
        </label>
      </form>
    </div>
  );
};
