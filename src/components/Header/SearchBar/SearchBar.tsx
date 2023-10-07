import { IconButton, InputBase } from '@mui/material';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  handleSearch: (text: string) => void;
  searchText?: string | undefined;
}

const SearchBar: React.FC<SearchBarProps> = ({ handleSearch, searchText }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(event.target.value);
  };

  const handleSearchButtonClick = () => {
    if (searchText) {
      handleSearch(searchText);
    }
  };

  return (
    <div className={styles.searchField}>
      <IconButton type="button" aria-label="search" onClick={handleSearchButtonClick}>
        <SearchIcon />
      </IconButton>
      <InputBase
        id="searchInput"
        className={styles.text}
        placeholder="Search"
        value={searchText}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;
