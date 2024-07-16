import { GridColDef } from '@mui/x-data-grid';

export const menuColumns: GridColDef[] = [
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
