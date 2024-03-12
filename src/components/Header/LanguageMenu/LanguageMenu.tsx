import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectComponent } from '@/components/Select/Select';
import { languageList } from '@/utils/languageList';

export const LanguageMenu = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: string | string[]) => {
    if (typeof language === 'string') {
      i18n.changeLanguage(language);
    }
  };

  return (
    <SelectComponent
      showFlags
      label="Select assigned  user"
      value={i18n.language || ''}
      onChange={handleLanguageChange}
      options={languageList}
    />
  );
};
