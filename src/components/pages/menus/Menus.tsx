import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { MenuDocumentType } from '@/models/Menu';
import { getAllMenus } from '@/services/menu/menuService';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { menuColumns } from '@/components/pages/menus/utils';

export const Menus: React.FC = () => {
  const [menus, setMenus] = useState<MenuDocumentType[]>([]);

  const fetchMenus = async () => {
    try {
      const fetchedMenusData = await getAllMenus();
      const fetchedMenus: MenuDocumentType[] = fetchedMenusData.data;
      setMenus(fetchedMenus);
    } catch (error) {
      console.error('Error retrieving the list of menus:', error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <Layout
      headTitle="Menus"
      breadcrumbs={[
        { title: 'Dashboard', link: '/' },
        { title: 'Settings', link: '/menulist' },
      ]}
    >
      <Box
        sx={{
          height: 400,
          width: '100%',
          '& .theme--header': {
            backgroundColor: 'rgba(67, 24, 254, 100)',
            color: 'rgba(255,255,255,100)',
          },
        }}
      >
        <DataGrid
          rows={menus}
          columns={menuColumns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnSelector
        />
        {/* <Grid container justifyContent="left">
          <Button onClick={handleDialogOpen} text="Add Menu" />
        </Grid>*/}
      </Box>
    </Layout>
  );
};
