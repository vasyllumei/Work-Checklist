import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectComponent } from '@/components/Select/Select';
import { languageList } from '@/utils/languageList';
import styles from './LanguageMenu.module.css';
export const LanguageMenu = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: string | string[]) => {
    if (typeof language === 'string') {
      i18n.changeLanguage(language);
    }
  };
  const currentLanguageObject = languageList.find(lang => lang.value === i18n.language);

  const currentLanguageWithIcon = currentLanguageObject
    ? { ...currentLanguageObject, LeftIcon: currentLanguageObject.leftIcon, label: currentLanguageObject.label }
    : null;
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
        currentLanguageWithIcon ? (
          <div className={styles.mainContainer}>
            <div className={styles.iconContainer}>
              <currentLanguageWithIcon.LeftIcon />
              {currentLanguageObject?.label}
            </div>
          </div>
        ) : null
      }
      onChange={handleLanguageChange}
      options={languageList}
    />
  );
};
