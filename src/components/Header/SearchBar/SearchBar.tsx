import { IconButton, InputBase } from '@mui/material';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import styles from './SearchBar.module.css';

const SearchBar: React.FC = () => (
  <div className={styles.searchField}>
    <IconButton type="button" aria-label="search">
      <SearchIcon />
    </IconButton>
    <InputBase className={styles.text} placeholder="Search" />
  </div>
);

export default SearchBar;
