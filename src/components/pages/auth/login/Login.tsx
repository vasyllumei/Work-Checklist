
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
        <div className={styles.Container}>
        <div className={styles.leftContainer}>

            <div className={styles.form}>
                <div className={styles.a}>
                <a className={styles.back} href="/signup"> &#8249; Back to dashboard</a>
                </div>
                <div className={styles.headText}> Sign In </div>
                <div className={styles.frontText}>Enter your email and password to sign in!</div>
                <div className={styles.lineGroup}>
                    <hr className={styles.line}/>
                    <div className={styles.or}>or</div>
                    <hr className={styles.line}/>
                </div>
                <label htmlFor="uname">
                    <b className={styles.inputEmail}>Email*</b>
                    <TextInput value={email} onChange={setEmail} placeHolder="mail@simmmple.com"/>
                </label>
                <label htmlFor="uname">
                    <b className={styles.inputPassword}>Password*</b>
                    <TextInput value={password} onChange={setPassword} placeHolder={'Min. 8 characters'}/>
                </label>
                <div className={styles.checkboxContainer}>
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={handleRememberMe}
                            name="remember"
                        />
                        Keep me logged in
                    </label>
                    <a className={styles.create} href="/signup">Forget password?</a>
                </div>
                <Button text={'Sign In'} onClick={login}/>
                <div className={styles.forgotText}>
                    Not registered yet? <a className={styles.create} href="/signup">Create an Account</a>
                </div>
                <div className={styles.footer}>
                <footer>
                    © 2022 Horizon UI. All Rights Reserved. Made with love by Simmmple!</footer>
                </div>
            </div>

        </div>

        <div className={styles.rightContainer}>
            <div >
                <div className={styles.logoContainer}>
                <img src="https://i.ibb.co/Tq5b2hy/Screenshot-2.png" alt="Логотип" className={styles.logo}/>
                </div>
            </div>
        </div>
        </div>
    );
};