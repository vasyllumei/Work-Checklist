import { IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './SearchBar.module.css';

import { useKanbanContext } from '@/components/Kanban/providers/kanbanProvider/useKanbanContext';
import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';

const SearchBar = () => {
  const { handleSearchText } = useKanbanContext();
  const router = useRouter();
  const searchText = router.query.searchText ? router.query.searchText.toString() : '';

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    const currentRoute = router.pathname;
    const updatedRoute = newText ? `${currentRoute}?searchText=${newText}` : currentRoute;
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
        value={searchText}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;
