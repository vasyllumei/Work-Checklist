import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectComponent } from '@/components/Select/Select';
import styles from './LanguageMenu.module.css';
import { languageList } from '@/utils/languageSetup';
export const LanguageMenu = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: string | string[]) => {
    if (typeof language === 'string') {
      i18n.changeLanguage(language);
    }
  };
  const currentLanguageObject = languageList.find(lang => lang.value === i18n.language);

  if (!currentLanguageObject) {
    return null;
  }
  return (
    <SelectComponent
      sx={{
        boxShadow: 'none',
        '.MuiOutlinedInput-notchedOutline': { border: 0 },
        width: '100px',
        '& .MuiSvgIcon-root': {
          visibility: 'hidden',
        },
      }}
      label={
        <div className={styles.mainContainer}>
          <div className={styles.iconContainer}>
            <currentLanguageObject.leftIcon />
            {currentLanguageObject?.label}
          </div>
        </div>
      }
      onChange={handleLanguageChange}
      options={languageList}
    />
  );
};
