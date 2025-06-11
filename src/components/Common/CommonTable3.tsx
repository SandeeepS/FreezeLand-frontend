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
import IconButton from "@mui/material/IconButton";
import SortIcon from "@mui/icons-material/Sort";

// Interface for the simplified table props
interface CommonTable3Props {
  columns: Array<{
    id: string;
    label: string;
    minWidth?: number;
    align?: "left" | "right" | "center";
  }>;
  data: Array<{
    _id: string;
    name: string;
    email?: string;
    [key: string]: string | number | boolean | undefined;
  }>;
  handleViewMore: (id: string) => void;
  title?: string;
}

const CommonTable3: React.FC<CommonTable3Props> = ({
  columns,
  data,
  handleViewMore,
  title = "Data Table",
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Sort Data by name
  const sortedData = [...data].sort((a, b) => {
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

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
      {/* Header with title and sort option */}
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Sort by Name ({sortOrder === "asc" ? "A-Z" : "Z-A"})
          </span>
          <IconButton onClick={handleSort} size="small">
            <SortIcon />
          </IconButton>
        </div>
      </div>

      <TableContainer sx={{ flexGrow: 1 }}>
        <Table stickyHeader aria-label="simple view table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  style={{ minWidth: column.minWidth || 170 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  {item.email && <TableCell>{item.email}</TableCell>}
                  {/* Render additional columns based on the columns prop */}
                  {columns.slice(2).map((column) => (
                    <TableCell key={column.id} align={column.align || "left"}>
                      {item[column.id] || "-"}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleViewMore(item._id)}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.875rem",
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
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

export default CommonTable3;
