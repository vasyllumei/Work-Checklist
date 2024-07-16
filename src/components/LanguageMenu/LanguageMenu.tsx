import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectComponent } from '@/components/Select/Select';
import styles from './LanguageMenu.module.css';
import { languageList } from '@/utils/languageSetup';
import { FC } from 'react';
import { selectStyles } from '@/components/LanguageMenu/utils';

export const LanguageMenu: FC = () => {
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
    <div data-testid="headerLanguage">
      <SelectComponent
        sx={selectStyles}
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
        testId="languageSelector"
      />
    </div>
  );
};
