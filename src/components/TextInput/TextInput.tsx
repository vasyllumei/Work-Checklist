import React, { useState } from 'react';
import styles from './TextInput.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import classNames from 'classnames';
import HtmlEditor from '@/components/TextInput/HtmlEditor/HtmlEditor';

interface TextInputProps {
  name?: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | undefined;
  disabled?: boolean;
  onBlur?: () => void;
  label?: string;
  isEditing?: boolean;
  dataTestId?: string;
}

export function TextInput({
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  dataTestId,
  disabled,
  onBlur,
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
    <div className={styles.inputContainer}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      {isEditing ? (
        <HtmlEditor dataAid={dataTestId} onChange={onChange} value={value || ''} />
      ) : (
        <input
          data-testid={dataTestId}
          className={classNames(styles.input, { [styles.inputError]: error })}
          name={name}
          value={value || ''}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          type={inputType}
          disabled={disabled}
          onBlur={onBlur}
        ></input>
      )}
      {error && <span className={styles.error}>{error}</span>}{' '}
      {type === 'password' && (
        <div className={styles.eyePassword} onClick={togglePasswordVisibility}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      )}
    </div>
  );
}
