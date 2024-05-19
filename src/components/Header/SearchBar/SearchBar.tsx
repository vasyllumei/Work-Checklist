import { IconButton, InputBase } from '@mui/material';
import React /*, { useEffect }*/ from 'react';
import SearchIcon from '@mui/icons-material/Search';
import styles from './SearchBar.module.css';
// import { useRouter } from 'next/router';

interface SearchBarProps {
  handleSearch?: ((text: string) => void) | undefined;
  searchText?: string | undefined;
}

const SearchBar: React.FC<SearchBarProps> = ({ handleSearch, searchText }) => {
  // const router = useRouter();

  /*  const handleInteraction = (text: string) => {
    const updatedRoute = text ? `${router.pathname}?searchText=${text}` : router.pathname;
    router.replace(updatedRoute);
    handleSearchAndSave(text);
  };*/

  const handleSearchAndSave = (text: string) => {
    if (handleSearch) {
      handleSearch(text || '');
    }
    /*    localStorage.setItem('searchInputText', text);*/
  };
  /*
  useEffect(() => {
    const storedText = localStorage.getItem('searchInputText');
    storedText && handleSearchAndSave(storedText);
  }, []);*/

  return (
    <div className={styles.searchField}>
      <IconButton type="button" aria-label="search" disabled>
        <SearchIcon />
      </IconButton>
      <InputBase
        inputProps={{
          'data-testid': 'searchInput',
        }}
        className={styles.text}
        placeholder="Search"
        value={searchText}
        onChange={event => handleSearchAndSave(event.target.value)}
        /*
        onChange={event => handleInteraction(event.target.value)}
*/
      />
    </div>
  );
};

export default SearchBar;
