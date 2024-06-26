import { useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import managetas from '../../fakeData/managetas.json'
import { OnOffSwitch } from '../../components/Switch';
import EditIcon from '@mui/icons-material/Edit';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';

const TAtable  = () => {
  const [validationErrors, setValidationErrors] = useState({});

  const columns = useMemo(
    () => [

      {
        accessorKey: 'username',
        header: 'Username',
        enableEditing: false
      },

      {
        accessorKey: 'taName',
        header: 'TA Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.taName,
          helperText: validationErrors?.taName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              taName: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
    
      {
        accessorKey: 'location',
        header: 'Location',
        editVariant: 'select',
        editSelectOptions: managetas['locations'], // TODO: options for select location
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.location,
          helperText: validationErrors?.location,
        },
      },
      {
        accessorKey: 'timezone',
        header: 'Time Zone',
        editVariant: 'select',
        editSelectOptions: managetas['timezones'],  // options for select timezone
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.timezone,
          helperText: validationErrors?.timezone,
        },
        
      }
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();
  //call DELETE hook
  // const { mutateAsync: deleteUser, isPending: isDeletingUser } =
  //   useDeleteUser();

  //CREATE action
  const handleCreateUser = async ({ values, table }) => {
    console.log('in handleCreateUser -- ', values);
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  // const openDeleteConfirmModal = (row) => {
  //   if (window.confirm('Are you sure you want to delete this user?')) {
  //     deleteUser(row.original.id);
  //   }
  // };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers, //use the fetched data from the api
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enableRowNumbers : true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    getRowId: (row) => row.username, //unique id for each row
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        maxHeight: '60vh',
        maxWidth: '83vw',
        margin: 'auto',
        scrollbarWidth: 'thin'
      },
    },
    muiPaginationProps: {
      showRowsPerPage: false,
      variant: 'outlined',
      color: 'primary',
      sx: {
        width: '65vw',
        display: 'flex',
        justifyContent: 'center'
      },
    },
    muiBottomToolbarProps: {
      sx: {
        display: 'flex',
        justifyContent: 'center'
      },
    },
  paginationDisplayMode: 'pages',
  initialState: {
    pagination: {
      pageSize: 7,
    },
  },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Create New User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Edit User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '0.2rem' }}>
        <OnOffSwitch/>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip> */}
      </Box>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser, //isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return (
    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center' }}>
        <Box sx={{width:'68vw',display:'flex', flexDirection:'row' , justifyContent:'space-between', alignItems:'center' }}>
          <h2>Hello, Saras</h2>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#db5014', width:'150px' , height:'40px' , borderRadius: '20px' }}
            startIcon={<ControlPointOutlinedIcon />}
            onClick={() => {
              table.setCreatingRow(true); //simplest way to open the create row modal with no default values
              //or you can pass in a row object to set default values with the `createRow` helper function
              // table.setCreatingRow(
              //   createRow(table, {
              //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
              //   }),
              // );
            }}
          >
            Create TA
        </Button>
        </Box>
        <Box sx={{display:'flex'}}>
            <MaterialReactTable table={table} />
        </Box>
    </Box>
  );
  
};

//CREATE hook (post new user to api)
function useCreateUser() {
  const queryClient = useQueryClient();
  console.log('in useCreateUser --');
  return useMutation({
    mutationFn: async (user) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) => [
        ...prevUsers,
        {
          ...newUserInfo,
          username: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//READ hook (get users from api)
function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(managetas['userdata']);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.map((prevUser) =>
          prevUser.username === newUserInfo.username ? newUserInfo : prevUser,
        ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
// function useDeleteUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (userId) => {
//       //send api update request here
//       await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
//       return Promise.resolve();
//     },
//     //client side optimistic update
//     onMutate: (userId) => {
//       queryClient.setQueryData(['users'], (prevUsers) =>
//         prevUsers?.filter((user) => user.id !== userId),
//       );
//     },
//     // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
//   });
// }

const queryClient = new QueryClient();

const ManagesTAs = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <TAtable/>
  </QueryClientProvider>
);

export default ManagesTAs;

const validateRequired = (value) => !!value.length;
// const validateEmail = (email) =>
//   !!email.length &&
//   email
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//     );

function validateUser(user) {
  return {
    taName: !validateRequired(user.taName)
      ? 'Name is Required'
      : '',
    username: !validateRequired(user.username) ? 'Username is Required' : '',
    location: !validateRequired(user.location) ? 'Location is Required' : '',
  };
}
