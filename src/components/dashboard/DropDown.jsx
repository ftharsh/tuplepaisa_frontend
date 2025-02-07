import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const Dropdown = ({ options, onInputChange, loading, value, onChange }) => {
  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      options={options}
      loading={loading}
      onInputChange={(event, value) => onInputChange(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Recipient Username"
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
};

export default Dropdown;
