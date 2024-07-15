import { GridColDef } from '@mui/x-data-grid';
import { ProjectType } from '@/types/Project';
import * as Yup from 'yup';
import { stringValidation } from '@/utils';
export const projectsList: GridColDef<ProjectType>[] = [
  {
    field: 'id',
    headerName: 'ID',
    headerClassName: 'theme--header',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 210,
    sortable: false,
  },
  {
    field: 'title',
    headerName: 'Title',
    headerClassName: 'theme--header',
    headerAlign: 'center',
    align: 'center',
    minWidth: 90,
    flex: 1,
    sortable: false,
  },
  {
    field: 'description',
    headerName: 'Description',
    headerClassName: 'theme--header',
    headerAlign: 'center',
    align: 'center',
    minWidth: 90,
    flex: 1,
    sortable: false,
  },
  {
    field: 'color',
    headerName: 'Color',
    headerClassName: 'theme--header',
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: params => <div style={{ backgroundColor: params.value, width: 20, height: 20 }} />,
  },
];

export const breadcrumbsConfig = [
  { title: 'Dashboard', link: '/' },
  { title: 'Configs', link: '/configs' },
];

export const styleBox = {
  height: 300,
  width: '100%',
  '& .theme--header': {
    color: 'rgb(168, 158, 158)',
  },
  '& .MuiDataGrid-footerContainer': {
    display: 'none',
  },
  '& .MuiDataGrid-row:hover': {
    color: 'primary.main',
  },
};

export const columnValidationSchema = Yup.object().shape({
  title: stringValidation('Title'),
});
