import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CompOffLeaveSettlementModal = ({
  open,
  handleClose,
  selectedRowData,
}) => {
  const [compOffOption, setCompOffOption] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (selectedRowData?.date) {
      const formattedDate = new Date(selectedRowData.date)
        .toISOString()
        .split("T")[0];
      setDate(formattedDate);
    }
  }, [selectedRowData]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("empId", selectedRowData.employeeId);
    formData.append("compOffOption", compOffOption);
    formData.append("date", date);
    formData.append("amount", amount);
    try {
      const response = await axios.post(
        "/apigateway/payroll/timeSheet/handleCompOffLeaveSettlement",
        formData
      );
      console.log("Success:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Comp Off Leave Settlement
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Comp Off Option</InputLabel>
          <Select
            value={compOffOption}
            onChange={(e) => setCompOffOption(e.target.value)}
          >
            <MenuItem value="leaveIncrement">Leave Increment</MenuItem>
            <MenuItem value="bonus">Bonus</MenuItem>
            <MenuItem value="goodWill">Good Will</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <TextField
            label="Date"
            type="date"
            value={date}
            disabled
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>

        {compOffOption === "bonus" && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormControl>
        )}

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CompOffLeaveSettlementModal;
