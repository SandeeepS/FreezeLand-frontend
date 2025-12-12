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
  serverSide,
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

  const finalData = data ?? [];

  // use count:
  const count = serverSide?.total ?? 0;

  // pagination handlers:
  const handlePageChange = (_: unknown, newPage: number) => {
    if (serverSide) serverSide.onPageChange(newPage);
    else setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = +e.target.value;
    if (serverSide) {
      serverSide.onRowsPerPageChange(newLimit);
    } else {
      setRowsPerPage(newLimit);
      setPage(0);
    }
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

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Filter & Sort Options */}
      <Box
        display="flex"
        justifyContent="flex-end"
        gap={2}
        p={2}
        sx={{
          borderBottom: "1px solid #e0e0e0",
          flexShrink: 0,
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
          <SortIcon />
        </IconButton>
      </Box>

      {/* Table Container with proper scrolling */}
      <TableContainer
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#555",
            },
          },
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align as "center" | "left" | "right" | "inherit" | "justify"}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    backgroundColor: "#f8f9fa",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#333",
                    borderBottom: "2px solid #667eea",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {finalData?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{
                    py: 8,
                    color: "#999",
                    fontSize: "1.1rem",
                  }}
                >
                  No Data Found
                </TableCell>
              </TableRow>
            ) : (
              (
                finalData as unknown as Array<
                  Record<string, any> & {
                    _id: string;
                    name: string;
                    email?: string;
                    isBlocked?: boolean;
                  }
                >
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(
                  (
                    datas: Record<string, any> & {
                      _id: string;
                      name: string;
                      email?: string;
                      isBlocked?: boolean;
                    },
                    index: number
                  ) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={datas.name}
                          sx={{
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                          }}
                        />
                      </TableCell>
                      {datas.email && (
                        <TableCell>
                          <Chip
                            label={datas.email}
                            sx={{
                              backgroundColor: "#fff3e0",
                              color: "#f57c00",
                              fontWeight: 500,
                              fontSize: "0.85rem",
                            }}
                          />
                        </TableCell>
                      )}

                      {currentPath !== "/admin/complaints" && (
                        <TableCell>
                          <Chip
                            label={datas.isBlocked ? "Blocked" : "Active"}
                            sx={{
                              backgroundColor: datas.isBlocked
                                ? "#ffebee"
                                : "#e8f5e9",
                              color: datas.isBlocked ? "#d32f2f" : "#2e7d32",
                              fontWeight: 600,
                              fontSize: "0.85rem",
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
                                boxShadow:
                                  "0 4px 12px rgba(102, 126, 234, 0.4)",
                              },
                            }}
                          >
                            View More
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination - Fixed at bottom */}
      <TablePagination
        rowsPerPageOptions={[4, 8, 12, 16]}
        component="div"
        count={serverSide ? count : finalData.length}
        rowsPerPage={rowsPerPage}
        page={serverSide?.page ?? page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        sx={{
          borderTop: "1px solid #e0e0e0",
          flexShrink: 0,
          ".MuiTablePagination-toolbar": {
            minHeight: "56px",
          },
          ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
            margin: 0,
          },
        }}
      />
    </Paper>
  );
};

export default TableCommon;