import { IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './SearchBar.module.css';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';

const SearchBar = () => {
  const [inputText, setInputText] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const storedInputText = localStorage.getItem('searchInputText');
    if (storedInputText) {
      setInputText(storedInputText);
    }
  }, []);

  const handleSearchText = (text: string) => {
    setInputText(text);
    localStorage.setItem('searchInputText', text);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    const currentRoute = router.pathname;
    const updatedRoute = newText ? `${currentRoute}?inputText=${newText}` : currentRoute;
    router.replace(updatedRoute);
    handleSearchText(newText);
  };

  return (
    <div className={styles.searchField}>
      <IconButton type="button" aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        id="searchInput"
        className={styles.text}
        placeholder="Search"
        value={inputText}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;
