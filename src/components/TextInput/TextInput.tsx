import { FC } from 'react';
import styles from './TextInput.module.css';

interface InputPropsType {
    value: string;
    onChange: (value: string) => void;
    placeHolder: string;
}
export const TextInput: FC<InputPropsType> = ({ onChange, value, placeHolder }) => {
    return (
        <input
            className={styles.input}
            value={value}
            onChange={event => onChange(event.target.value)}
            placeholder={placeHolder}
        />
    );
};
