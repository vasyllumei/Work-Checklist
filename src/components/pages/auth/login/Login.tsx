import { AuthBaseTemplate } from '@/components/pages/auth/components/AuthBaseTemplate';
import { Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import styles from './LoginStyles.module.css';

export const Login: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
    };

    const router = useRouter();
    const login = () => {
        console.log(password);
        router.push('/');
    };
    return (
        <AuthBaseTemplate headTitle="Portal | Login">
            <form className={styles.loginForm}>
                <Stack justifyContent="start">
                    <Typography variant="h4" className={styles.headText}>
                        Sign In
                    </Typography>
                    <Typography variant="subtitle1" className={styles.frontText}>
                        Enter your email and password to sign in!
                    </Typography>
                    <div className={styles.lineGroup}>
                        <hr className={styles.line} />
                        <div className={styles.or}>or</div>
                        <hr className={styles.line} />
                    </div>
                    <label htmlFor="uname">
                        <b className={styles.inputEmail}>Email*</b>
                        <TextInput value={email} onChange={setEmail} placeHolder="mail@simmmple.com" />
                    </label>
                    <label htmlFor="uname">
                        <b className={styles.inputPassword}>Password*</b>
                        <TextInput value={password} onChange={setPassword} placeHolder={'Min. 8 characters'} />
                    </label>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={handleRememberMe}
                                name="remember"
                                className={styles.checkbox}
                            />{' '}
                            Keep me logged in
                        </label>
                    </div>
                    <Button text={'Sign In'} onClick={login} />
                    <div className={styles.forgotText}>
                        Not registered yet? <a href="/signup">Create an Account</a>
                    </div>
                </Stack>
            </form>
        </AuthBaseTemplate>
    );
};
