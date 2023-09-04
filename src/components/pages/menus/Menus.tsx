import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { MenuDocumentType } from '@/models/Menu';
import { getAllMenus } from '@/services/menu/menuService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';

export const Menus = () => {
  const [menus, setMenus] = useState<MenuDocumentType[]>([]);
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Title',
      headerClassName: 'theme--header',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
    },
    {
      field: 'link',
      headerName: 'Link',
      headerClassName: 'theme--header',
      headerAlign: 'center',
      flex: 1,
      editable: false,
      sortable: false,
    },
    {
      field: 'order',
      headerName: 'Order',
      headerClassName: 'theme--header',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      maxWidth: 70,
      editable: false,
      sortable: false,
    },
    {
      field: 'children',
      headerName: 'Children',
      headerClassName: 'theme--header',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
    },
    /*{
      field: 'actions',
      headerName: 'Actions',
      headerClassName: 'theme--header',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      width: 150,
      editable: false,
    },*/
  ];
  useEffect(() => {
    fetchedMenus();
  }, []);

  const fetchedMenus = async () => {
    try {
      const fetchedMenusData = await getAllMenus();
      const fetchedMenus: MenuDocumentType[] = fetchedMenusData.data;
      setMenus(fetchedMenus);
    } catch (error) {
      console.error('Error retrieving the list of menus:', error);
    }
  };

  return (
    <Layout
      handleSearch={() => ''}
      searchText={''}
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
          columns={columns}
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
