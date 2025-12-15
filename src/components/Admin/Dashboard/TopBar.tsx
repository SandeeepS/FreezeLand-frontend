import { useState, useEffect, ChangeEvent } from "react";
import { TopBarProps } from "../../../interfaces/IComponents/Admin/IAdminInterfaces";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

const TopBar: React.FC<TopBarProps> = ({ pathName, heading, searchQuery }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [inputDebounce, setinputDebounce] = useState(" ");

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setinputDebounce(inputValue as string);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [inputValue, searchQuery]);

  console.log("inputDebounce", inputDebounce);
  useEffect(() => {
    if (inputDebounce !== null) {
      if (inputDebounce.trim()) {
        console.log("pathnanme", pathName);
        navigate(`${pathName}?search= ${inputDebounce}`);
      } else {
        navigate(`${pathName}`);
      }
    }
  }, [inputDebounce, navigate, pathName]);

  return (
    <Box
      sx={{
        borderBottom: "solid #e3f2fd",
        marginTop: 2,
        background: "#4B4B4B",
        borderRadius: "0 0 0 0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 12px",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        {/* Heading Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Box
            component="span"
            sx={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.5px",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {heading}
          </Box>

          {/* <span className="text-2xl font-bold block"> {heading}</span>
          <span className="text-sm block text-stone-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </span> */}
        </Box>

        {/* <button className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded">
          <FiCalendar />
          <span>Prev 6 Months</span>
        </button> */}

        {/* Search Section */}
        <Box
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{
            maxWidth: "400px",
            minWidth: "280px",
            flex: 1,
          }}
        >
          <TextField
            id="server-search"
            placeholder="Search here..."
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: "#667eea",
                      fontSize: "1.4rem",
                    }}
                  />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "white",
                borderRadius: "10px",
                fontSize: "0.95rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "2px solid rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "2px solid rgba(255,255,255,0.6)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "2px solid white",
                  boxShadow: "0 0 0 3px rgba(255,255,255,0.2)",
                },
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transform: "translateY(-1px)",
                },
                "& input": {
                  padding: "10px 8px",
                },
              },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#667eea",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TopBar;