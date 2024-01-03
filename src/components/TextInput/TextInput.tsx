import React, { useState } from 'react';
import styles from './TextInput.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import classNames from 'classnames';

interface TextInputProps {
  name?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | undefined;
  disabled?: boolean;
  onBlur?: () => void;
  label?: string;
  isEditing?: boolean;
}

export function TextInput({
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled,
  label,
  isEditing = false,
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
    setInputType(prevInputType => (prevInputType === 'password' ? 'text' : 'password'));
  };

  return (
    <div className={styles.container}>
      {type === 'password' && (
        <div className={styles.eyePassword} onClick={togglePasswordVisibility}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      )}
      {label && <label className={styles.inputLabel}>{label}</label>}
      {isEditing ? (
        <textarea
          className={classNames(styles.textArea, { [styles.inputError]: error })}
          name={name}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          className={classNames(styles.input, { [styles.inputError]: error })}
          name={name}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          type={inputType}
          disabled={disabled}
        />
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
