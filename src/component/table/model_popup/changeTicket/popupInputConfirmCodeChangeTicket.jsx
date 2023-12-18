import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ModelEnterConfirmChangeTicketCode = ({
  open,
  handleClose,
  bookingData,
}) => {
  const navigate = useNavigate();
  const [confirmCode, setConfirmCode] = useState();

  const handleConfirmCode = async () => {
    console.log("max: ", bookingData.bookingCode);
    if (!confirmCode) {
      toast.error("Vui lòng nhập mã !");
      return;
    }
    if (bookingData?.bookingCode?.toString() !== confirmCode) {
      toast.error("Mã vé không trùng khớp !");
      return;
    }
    navigate(`/change-seating/${bookingData?.idBooking}`);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "35vw",
        },
      }}
    >
      <DialogTitle
        textAlign="center"
        variant="h5"
        sx={{
          textTransform: "uppercase",
          color: "#575656",
          backgroundImage:
            "linear-gradient(to bottom, #f37106, #f8903b, #fac074, #f8aa85, #fcedc5)",
        }}
      >
        Nhập Mã Xác Nhận
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                label="Mã Xác Nhận"
                // type="number"
                onChange={(e) => {
                  setConfirmCode(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{ display: "flex", justifyContent: "space-evenly", p: "20px" }}
      >
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "white",
            color: "red",
            border: "1px solid red",
            width: "160px",
          }}
        >
          Đóng
        </Button>
        <Button
          onClick={handleConfirmCode}
          sx={{
            backgroundColor: "#FF5B94",
            color: "white",
            width: "160px",
            ":hover": { bgcolor: "#F84180" },
          }}
        >
          Xác Nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModelEnterConfirmChangeTicketCode;
