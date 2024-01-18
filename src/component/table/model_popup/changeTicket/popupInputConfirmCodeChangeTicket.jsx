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
import listTripApi from "../../../../utils/listTripAPI";

const ModelEnterConfirmChangeTicketCode = ({
  open,
  handleClose,
  bookingData,
}) => {
  const navigate = useNavigate();
  const [confirmCode, setConfirmCode] = useState();

  const handleConfirmCode = async () => {
    console.log("max: ", bookingData?.ticketCode);
    console.log("max1: ", bookingData);
    if (!confirmCode) {
      toast.error("Vui lòng nhập mã !");
      return;
    }
    if (bookingData?.ticketCode?.toString() !== confirmCode) {
      toast.error("Mã vé không trùng khớp !");
      return;
    }
    try {
      const response = await listTripApi.findSeatTrip({
        idStationPickUp: bookingData?.onStation?.idStation,
        idStationDropOff: bookingData?.offStation?.idStation,
        idTrip: bookingData?.idTrip,
      });
      console.log("max2: ", response);
      navigate(`/change-seating/${bookingData?.idTicket}`, {
        state: response?.data,
      });
    } catch (error) {
      console.log(error);
    }
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
            "linear-gradient(to bottom, #9b9bff, #a1a1f7, #a7a7ee, #acace5, #b2b2dc)",
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
            backgroundColor: "#6D6DFF",
            color: "white",
            width: "160px",
            ":hover": { bgcolor: "#6868AE" },
          }}
        >
          Xác Nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModelEnterConfirmChangeTicketCode;
