import React, { createContext, useCallback, useEffect, useState } from 'react';
import { UserRoleType, UserType } from '@/types/User';
import { GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';
import { useFilters } from '@/hooks/useFilters';
import { useDialogControl } from '@/hooks/useDialogControl';
import { useFormik } from 'formik';
import { addEditUserValidationSchema, generateFilterString } from '@/utils';
import { createUser, deleteAllUsers, deleteUser, getAllUsers, updateUser } from '@/services/user/userService';
import { FilterType } from '@/types/Filter';
import { usePagination } from '@/hooks/usePagination';

export interface UsersContext {
  users: UserType[];
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  isEditMode: boolean;
  handleCloseDeleteAllUsersModal: () => void;
  handleOpenDeleteAllUsersModal: (userIds: string[]) => void;
  rowsWithIds: UserType[];
  handleDeleteButtonClick: () => void;
  formik: any;
  fetchUsers: () => void;
  isDeleteAllUsersModalOpen: boolean;
  handleFilterChange: (filterName: string, selectedOptions: string | string[]) => void;
  isDialogOpen: boolean;
  handleDialogOpen: () => void;
  handleSearch: any;
  searchText: string;
  isSuperAdmin: boolean;
  selectedRows: GridRowSelectionModel;
  currentUserId: string | null;
  filters: FilterType[];
  setSelectedRows: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
  handleDialogClose: () => void;
  handleUserEdit: (userId: string) => void;
  handleOpenDeleteModal: (userId: string) => void;
  handleCloseDeleteModal: () => void;
  handleUserDelete: (userId: string) => void;
  isDeleteModalOpen: boolean;
  userIdToDelete: string;
  paginationModel: { pageSize: number; page: number };
  handlePaginationModelChange: (newPaginationModel: { pageSize: number; page: number }) => void;
  sortField: string | null;
  handleSortModelChange: (sortModel: GridSortModel | null) => void;
}

const initialUserForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: UserRoleType.USER,
  id: '',
  iconColor: '',
  editMode: false,
  createUserError: '',
};

export const UsersContext = createContext<UsersContext | null>(null);

export const UsersProvider = ({ children }: { children: JSX.Element }) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteAllUsersModalOpen, setIsDeleteAllUsersModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [sortField, setSortField] = useState<string | null>(null);
  const { paginationModel, handlePaginationModelChange } = usePagination();
  const { filters, handleFilterChange } = useFilters();
  const { isOpen: isDialogOpen, openDialog: openUserDialog, closeDialog: closeUserDialog } = useDialogControl();
  const formik = useFormik({
    initialValues: initialUserForm,
    validationSchema: addEditUserValidationSchema,
    onSubmit: async () => {
      try {
        if (formik.values.id) {
          await handleSaveUpdatedUser();
        } else {
          await handleUserCreate();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  const isEditMode = formik.values.editMode;

  const handleUserCreate = async () => {
    try {
      await createUser(formik.values);
      await fetchUsers();
      handleDialogClose();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        formik.setErrors({ createUserError: error.response.data.message });
      }
    }
  };

  const handleUserDelete = async (userId: string): Promise<void> => {
    try {
      await deleteUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting the user:', error);
    }
  };

  const handleDeleteAllUsers = async (userIds: string[]) => {
    try {
      await deleteAllUsers(userIds);
      await fetchUsers();
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting selected users:', error);
    }
  };

  const handleUserEdit = (userId: string) => {
    try {
      const userData = users.find(user => user.id === userId);
      if (userData) {
        formik.setValues({
          ...initialUserForm,
          ...userData,
          editMode: true,
        });
        openUserDialog();
      }
    } catch (error) {
      console.error('Error updating the user', error);
    }
  };

  const handleSaveUpdatedUser = async (): Promise<void> => {
    try {
      await updateUser(formik.values.id, formik.values);
      await fetchUsers();
      handleDialogClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleOpenDeleteModal = (userId: string) => {
    setUserIdToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setUserIdToDelete('');
    setIsDeleteModalOpen(false);
  };

  const handleDialogOpen = () => {
    formik.setValues(initialUserForm);
    openUserDialog();
  };

  const handleDialogClose = () => {
    formik.resetForm();
    closeUserDialog();
  };

  const handleDeleteButtonClick = () => {
    if (selectedRows.length > 0) {
      const userIds = selectedRows.map(rowId => rowId.toString());
      handleDeleteAllUsers(userIds);
    }
  };

  const handleOpenDeleteAllUsersModal = (userIds: string[]) => {
    setSelectedRows(userIds);
    setIsDeleteAllUsersModalOpen(true);
  };

  const handleCloseDeleteAllUsersModal = () => {
    setIsDeleteAllUsersModalOpen(false);
  };

  const filterParams = generateFilterString(filters);
  const handleSortModelChange = (model: GridSortModel | null) => {
    if (model && model.length > 0) {
      const { field } = model[0];
      setSortField(field);
    } else {
      setSortField(null);
    }
  };
  const fetchUsers = useCallback(async () => {
    try {
      const { page, pageSize } = paginationModel;

      const fetchedUsersData = await getAllUsers({
        search: searchText,
        filter: filterParams,
        limit: pageSize,
        skip: page * pageSize,
        sort: sortField !== null ? sortField : undefined,
      });
      console.log('fetchedUsersData', fetchedUsersData);
      const fetchedUsers = fetchedUsersData.data;
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error retrieving the list of users:', error);
    }
  }, [searchText, filterParams, paginationModel, sortField]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };
  const rowsWithIds = users.map((user: UserType) => ({ ...user, id: user.id }));

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const isSuperAdmin = currentUser?.user.role === UserRoleType.SUPER_ADMIN;
  const currentUserId = currentUser?.user?._id;

  const value = {
    handleUserEdit,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleUserDelete,
    isDeleteModalOpen,
    userIdToDelete,
    users,
    setUsers,
    isEditMode,
    handleCloseDeleteAllUsersModal,
    handleOpenDeleteAllUsersModal,
    rowsWithIds,
    handleDeleteButtonClick,
    formik,
    fetchUsers,
    searchText,
    handleSearch,
    isDeleteAllUsersModalOpen,
    handleFilterChange,
    isDialogOpen,
    handleDialogOpen,
    isSuperAdmin,
    selectedRows,
    currentUserId,
    filters,
    setSelectedRows,
    handleDialogClose,
    handlePaginationModelChange,
    paginationModel,
    sortField,
    handleSortModelChange,
  };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
};
