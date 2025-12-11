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
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import { TableCommonProps } from "../../interfaces/IComponents/Common/ICommonInterfaces";
import { useLocation } from "react-router-dom";

const TableCommon: React.FC<TableCommonProps> = ({
  columns,
  data,
  updateStatus,
  blockUnblockFunciton,
  role,
  handleViewMore,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
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

  const handleChangePage = (_: unknown, newPage: number) => {
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
          if (blockUnblockFunciton) {
            blockUnblockFunciton(id).then((result) => {
              if (result?.success) {
                updateStatus(id, !isCurrentlyBlocked, false);
                Swal.fire({
                  title: "Success!",
                  icon: "success",
                });
              } else {
                toast.error(result?.message);
              }
            });
          } else {
            toast.error("Block/Unblock function is not defined.");
          }
        }
      });
    } catch (error) {
      console.log(error as Error);
    }
  };

  // const handleEdit = (_id: string | undefined) => {
  //   navigate(`${navLink}${_id}`);
  // };

  // const handleDelete = async (id: string, isCurrentlyDeleted: boolean) => {
  //   try {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       icon: "question",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes!",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         deleteFunction(id).then((result) => {
  //           if (result?.success) {
  //             updateStatus(id, isCurrentlyDeleted, true);
  //             Swal.fire({ title: "Deleted!", icon: "success" });
  //           } else toast.error(result?.message);
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error as Error);
  //   }
  // };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
        height: 500,
      }}
    >
      {/* Filter & Sort Options */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          padding: "20px 24px",
          borderBottom: "2px solid #e3f2fd",
        }}
      >
        {/* Filter Icon Button with Dropdown */}
        <IconButton
          onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            color: "#667eea",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "white",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            },
          }}
        >
          <FilterListIcon />
        </IconButton>

        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              mt: 1,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setFilter("all");
              setFilterAnchorEl(null);
            }}
            selected={filter === "all"}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#e3f2fd",
                "&:hover": { backgroundColor: "#bbdefb" },
              },
            }}
          >
            All Users
          </MenuItem>
          <MenuItem
            onClick={() => {
              setFilter("blocked");
              setFilterAnchorEl(null);
            }}
            selected={filter === "blocked"}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#ffebee",
                "&:hover": { backgroundColor: "#ffcdd2" },
              },
            }}
          >
            Blocked Users
          </MenuItem>
          <MenuItem
            onClick={() => {
              setFilter("unblocked");
              setFilterAnchorEl(null);
            }}
            selected={filter === "unblocked"}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#e8f5e9",
                "&:hover": { backgroundColor: "#c8e6c9" },
              },
            }}
          >
            Unblocked Users
          </MenuItem>
        </Menu>

        {/* Sort Icon Button */}
        <IconButton
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            color: "#667eea",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "white",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            },
          }}
        >
          <SortIcon
            sx={{
              transform: sortOrder === "desc" ? "rotate(180deg)" : "none",
              transition: "transform 0.3s ease",
            }}
          />
        </IconButton>
      </Box>

      <TableContainer sx={{ maxHeight: 600, minHeight: 350 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={
                    column.align as
                      | "center"
                      | "left"
                      | "right"
                      | "inherit"
                      | "justify"
                      | undefined
                  }
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    backgroundColor: "#f5f7fa",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#2c3e50",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e0e0e0",
                    padding: "16px",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((datas, index) => (
                <TableRow
                  hover
                  key={datas._id}
                  sx={{
                    transition: "all 0.2s ease",
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafbfc",
                    "&:hover": {
                      backgroundColor: "#f0f4ff !important",
                      transform: "scale(1.002)",
                      boxShadow: "0 2px 8px rgba(102, 126, 234, 0.1)",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#34495e",
                      fontSize: "0.95rem",
                    }}
                  >
                    {datas.name}
                  </TableCell>
                  {datas.email && (
                    <TableCell sx={{ color: "#5a6c7d", fontSize: "0.9rem" }}>
                      {datas.email}
                    </TableCell>
                  )}
                  {currentPath !== "/admin/complaints" && (
                    <TableCell>
                      <Chip
                        label={datas.isBlocked ? "Blocked" : "Active"}
                        size="small"
                        sx={{
                          backgroundColor: datas.isBlocked
                            ? "#ffebee"
                            : "#e8f5e9",
                          color: datas.isBlocked ? "#c62828" : "#2e7d32",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          border: `1px solid ${
                            datas.isBlocked ? "#ef9a9a" : "#a5d6a7"
                          }`,
                        }}
                      />
                    </TableCell>
                  )}
                  {currentPath !== "/admin/complaints" && (
                    <TableCell>
                      <ToggleButton
                        value="check"
                        selected={datas.isBlocked}
                        onChange={() =>
                          handleBlockUnblock(
                            datas._id,
                            datas.isBlocked ?? false
                          )
                        }
                        sx={{
                          backgroundColor: datas.isBlocked
                            ? "#f44336"
                            : "#4caf50",
                          height: "36px",
                          color: "white",
                          width: "120px",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          borderRadius: "8px",
                          border: "none",
                          transition: "all 0.3s ease",
                          "&.Mui-selected": {
                            backgroundColor: datas.isBlocked
                              ? "#f44336"
                              : "#4caf50",
                            color: "white",
                          },
                          "&:hover": {
                            backgroundColor: datas.isBlocked
                              ? "#d32f2f"
                              : "#388e3c",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                          },
                        }}
                      >
                        {datas.isBlocked ? "Blocked" : "Unblocked"}
                      </ToggleButton>
                    </TableCell>
                  )}
                  {/* <TableCell>
                    <Button onClick={() => handleEdit(datas._id)}>
                      Edit
                    </Button>
                  </TableCell> */}
                  {/* <TableCell>
                    <Button
                      onClick={() => handleDelete(datas._id, datas.isDeleted)}
                    >
                      Delete
                    </Button>
                  </TableCell> */}
                  {role && handleViewMore && role === "admin" && (
                    <TableCell>
                      <Button
                        onClick={() => handleViewMore(datas._id)}
                        variant="contained"
                        sx={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          textTransform: "none",
                          borderRadius: "8px",
                          padding: "8px 20px",
                          boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                          },
                        }}
                      >
                        View More
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        // rowsPerPageOptions={[2, 5, 10, 25]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: "2px solid #e3f2fd",
          backgroundColor: "#fafbfc",
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontWeight: 600,
              color: "#5a6c7d",
            },
          "& .MuiTablePagination-select": {
            borderRadius: "6px",
            border: "1px solid #e0e0e0",
          },
        }}
      />
    </Paper>
  );
};

export default TableCommon;
