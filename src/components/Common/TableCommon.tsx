import React, { useState } from 'react';
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
  name: string;
  email: string;
  status: string;
  isBlocked: boolean;
}

function createData(name: string, email: string, status: string, isBlocked: boolean): Data {
  return { name, email, status, isBlocked };
}

const initialRows = [
  createData('India', 'IN', 'Active', false),
  createData('China', 'CN', 'Active', false),
  createData('Italy', 'IT', 'Active', true),
  createData('United States', 'US', 'Active', false),
  createData('Canada', 'CA', 'Active', false),
  createData('Australia', 'AU', 'Active', true),
  createData('Germany', 'DE', 'Active', false),
  createData('Ireland', 'IE', 'Active', false),
  createData('Mexico', 'MX', 'Active', true),
  createData('Japan', 'JP', 'Active', false),
  createData('France', 'FR', 'Active', true),
  createData('United Kingdom', 'GB', 'Active', false),
  createData('Russia', 'RU', 'Active', true),
  createData('Nigeria', 'NG', 'Active', false),
  createData('Brazil', 'BR', 'Active', false),
];

function TableCommon() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState(initialRows);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleBlockUnblock = (email: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.email === email ? { ...row, isBlocked: !row.isBlocked } : row
      )
    );
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.email}>
                  {columns.map((column) => {
                    const value = row[column.id as keyof Data];
                    if (column.id === 'actions') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <ToggleButton
                            value="check"
                            selected={!row.isBlocked}
                            onChange={() => handleBlockUnblock(row.email)}
                            sx={{
                              backgroundColor: row.isBlocked ? 'red' : '#90ee90', // Light green for unblocked, red for blocked
                              color: 'white', // Text color remains white
                              width: '120px', // Fixed width to avoid resizing
                              '&.Mui-selected': {
                                backgroundColor: row.isBlocked ? 'red' : '#90ee90', // Enforce background color when selected
                              },
                              '&:hover': {
                                backgroundColor: row.isBlocked ? '#ff4d4d' : '#81c784', // Slight hover adjustment for both states
                              },
                            }}
                          >
                            {row.isBlocked ? 'Blocked' : 'Unblocked'}
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
                            onClick={() => handleEdit(row.email)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(row.email)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default TableCommon;
