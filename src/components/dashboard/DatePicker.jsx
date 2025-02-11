import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DatePickerComponent = ({
  selectedDate,
  onDateChange,
  label,
  maxDate,
  minDate,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={selectedDate}
        maxDate={maxDate}
        minDate={minDate}
        onChange={onDateChange}
      />
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
