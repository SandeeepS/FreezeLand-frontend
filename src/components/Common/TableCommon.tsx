import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { blockUser } from '../../Api/admin';

interface Column {
  id: 'name' | 'email' | 'status' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 170, align: 'right' },
  { id: 'actions', label: 'Actions', minWidth: 150, align: 'right' },
];

interface Data {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

interface TableCommonProps {
  users: Data[]; // Array of user data
  updateUserStatus: (id: string, isBlocked: boolean) => void; // Function to update user status

}

const  TableCommon :React.FC<TableCommonProps> = ({users,updateUserStatus}) =>  {
  const [block, setBlock] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  // Fetch the data on mount and whenever block state changes
  useEffect(() => {
    console.log("Fetched users: ", users);
  }, [users, block]);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleBlockUnblock = async (id: string,isCurrentlyBlocked:boolean) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
      }).then((result) => {
        if (result.isConfirmed) {
          blockUser(id).then((result) => {
            if (result?.data.success) {
              updateUserStatus(id,!isCurrentlyBlocked)
              Swal.fire({
                title: "Success!",
                text: "",
                icon: "success",
              });
            } else {
              toast.error(result?.data.message);
            }
          });
        }
      });
    } catch (error) {
      console.log(error as Error);
    }
  };

  const handleEdit = (email: string) => {
    console.log(`Edit action for: ${email}`);
  };

  const handleDelete = (email: string) => {
    console.log(`Delete action for: ${email}`);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((users) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={users._id}>
                  <TableCell>{users.name}</TableCell>
                  <TableCell>{users.email}</TableCell>
                  <TableCell align="right">{users.isBlocked ? 'Blocked' : 'Active'}</TableCell>
                  <TableCell align="right">
                    <ToggleButton
                      value="check"
                      selected={!users.isBlocked}
                      onChange={() => handleBlockUnblock(users._id,users.isBlocked)}
                      sx={{
                        backgroundColor: users.isBlocked ? 'red' : '#90ee90', // Light green for unblocked, red for blocked
                        color: 'white', // Text color remains white
                        width: '120px', // Fixed width to avoid resizing
                        '&.Mui-selected': {
                          backgroundColor: users.isBlocked ? 'red' : '#90ee90', // Enforce background color when selected
                        },
                        '&:hover': {
                          backgroundColor: users.isBlocked ? '#ff4d4d' : '#81c784', // Slight hover adjustment for both states
                        },
                      }}
                    >
                      {users.isBlocked ? 'Blocked' : 'Unblocked'}
                    </ToggleButton>
                    <Button
                      variant="outlined"
                      sx={{
                        marginLeft: '10px',
                        marginRight: '10px',
                        color: 'blue',
                        borderColor: 'blue',
                        '&:hover': {
                          backgroundColor: '#e0f7fa',
                          borderColor: 'blue',
                        },
                      }}
                      onClick={() => handleEdit(users.email)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(users.email)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default TableCommon;
