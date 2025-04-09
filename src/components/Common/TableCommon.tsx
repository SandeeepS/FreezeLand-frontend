import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import { TableCommonProps } from "../../interfaces/IComponents/Common/ICommonInterfaces";


const TableCommon: React.FC<TableCommonProps> = ({
  columns,
  data,
  updateStatus,
  blockUnblockFunciton,
  deleteFunction,
  navLink,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [filter, setFilter] = useState<"all" | "blocked" | "unblocked">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );

  // Filter Data
  const filteredData = data.filter((user) => {
    if (filter === "blocked") return user.isBlocked;
    if (filter === "unblocked") return !user.isBlocked;
    return true;
  });

  // Sort Data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "asc") return a.name.localeCompare(b.name);
    return b.name.localeCompare(a.name);
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleBlockUnblock = async (
    id: string,
    isCurrentlyBlocked: boolean
  ) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
      }).then((result) => {
        if (result.isConfirmed) {
          blockUnblockFunciton(id).then((result) => {
            if (result?.success) {
              updateStatus(id, !isCurrentlyBlocked, false);
              Swal.fire({ title: "Success!", icon: "success" });
            } else {
              toast.error(result?.message);
            }
          });
        }
      });
    } catch (error) {
      console.log(error as Error);
    }
  };

  const handleEdit = (_id: string | undefined) => {
    navigate(`${navLink}${_id}`);
  };

  const handleDelete = async (id: string, isCurrentlyDeleted: boolean) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteFunction(id).then((result) => {
            if (result?.success) {
              updateStatus(id, isCurrentlyDeleted, true);
              Swal.fire({ title: "Deleted!", icon: "success" });
            } else toast.error(result?.message);
          });
        }
      });
    } catch (error) {
      console.log(error as Error);
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Filter & Sort Options */}
      <div className="flex justify-end p-4 space-x-4">
        {/* Filter Icon Button with Dropdown */}
        <div>
          <IconButton onClick={(e) => setFilterAnchorEl(e.currentTarget)}>
            <FilterListIcon />
          </IconButton>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={() => setFilterAnchorEl(null)}
          >
            <MenuItem
              selected={filter === "all"}
              onClick={() => {
                setFilter("all");
                setFilterAnchorEl(null);
              }}
            >
              All Users
            </MenuItem>
            <MenuItem
              selected={filter === "blocked"}
              onClick={() => {
                setFilter("blocked");
                setFilterAnchorEl(null);
              }}
            >
              Blocked Users
            </MenuItem>
            <MenuItem
              selected={filter === "unblocked"}
              onClick={() => {
                setFilter("unblocked");
                setFilterAnchorEl(null);
              }}
            >
              Unblocked Users
            </MenuItem>
          </Menu>
        </div>

        {/* Sort Icon Button */}
        <IconButton
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          <SortIcon />
        </IconButton>
      </div>

      <TableContainer sx={{ flexGrow: 1 }}>
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
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((datas) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={datas._id}>
                  <TableCell>{datas.name}</TableCell>
                  {datas.email && <TableCell>{datas.email}</TableCell>}
                  <TableCell align="right">
                    {datas.isBlocked ? "Blocked" : "Active"}
                  </TableCell>
                  <TableCell align="right">
                    <ToggleButton
                      value="check"
                      selected={!datas.isBlocked}
                      onChange={() =>
                        handleBlockUnblock(datas._id, datas.isBlocked)
                      }
                      sx={{
                        backgroundColor: datas.isBlocked ? "red" : "#90ee90",
                        color: "white",
                        width: "120px",
                        "&.Mui-selected": {
                          backgroundColor: datas.isBlocked ? "red" : "#90ee90",
                        },
                        "&:hover": {
                          backgroundColor: datas.isBlocked
                            ? "#ff4d4d"
                            : "#81c784",
                        },
                      }}
                    >
                      {datas.isBlocked ? "Blocked" : "Unblocked"}
                    </ToggleButton>
                    <Button
                      variant="outlined"
                      sx={{ marginLeft: "10px" }}
                      onClick={() => handleEdit(datas._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(datas._id, datas.isDeleted)}
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
        rowsPerPageOptions={[4, 10, 25]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableCommon;
