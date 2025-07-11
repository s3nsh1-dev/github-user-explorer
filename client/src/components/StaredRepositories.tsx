import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router-dom";

const StaredRepositories = () => {
  const navigate = useNavigate();
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    navigate(`/user/${value}`);
  };

  return (
    <FormControl sx={{ minWidth: 140 }}>
      <InputLabel id="demo-simple-select-label">Favorites ⛦</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label="Favorites ⛦"
        onChange={handleChange}
        aria-placeholder="Started Users"
      >
        {/* <MenuItem value="select">-----select-----</MenuItem> */}
        <MenuItem value="s3nsh1-dev">s3nsh1-dev</MenuItem>
        <MenuItem value="google">google</MenuItem>
      </Select>
    </FormControl>
  );
};

export default StaredRepositories;
