import { Box, Button, Dialog, DialogTitle } from "@mui/material";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import listTripApi from "../../../../utils/listTripAPI";

const CancelTripModel = ({ open, handleClose, tripData, fetchDataTrip }) => {
  const [cancelTripData, setCancelTripData] = React.useState({
    idTrip: 0,
  });

  useEffect(() => {
    setCancelTripData({
      idTrip: tripData.idTrip,
    });
  }, [tripData]);

  const handleCancelTrip = async () => {
    const isConfirm = window.confirm("Bạn thật sự muốn hủy chuyến đi này ?");
    if (isConfirm) {
      try {
        const response = await listTripApi.cancelTrip(cancelTripData.idTrip);
        toast.success(response.message);
        fetchDataTrip();
        handleClose();
      } catch (error) {
        console.log("err", error);
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("update failed !!");
        }
      }
    }
    console.log("datalog", cancelTripData);
  };

  // const handleCancelTrip = () => {
  //   toast.success("trip have been cancel !");
  //   handleClose();
  // };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Bạn có muốn hủy chuyến đi với ID: ${tripData.idTrip}  ?`}</DialogTitle>
      <Box sx={{ display: "flex", justifyContent: "space-evenly", p: "20px" }}>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "white",
            color: "red",
            border: "1px solid red",
            width: "160px",
          }}
        >
          Hủy Bỏ
        </Button>
        <Button
          onClick={handleCancelTrip}
          sx={{
            backgroundColor: "#6D6DFF",
            color: "white",
            width: "160px",
            ":hover": { bgcolor: "#6868AE" },
          }}
        >
          Xác Nhận
        </Button>
      </Box>
      <ToastContainer />
    </Dialog>
  );
};

export default CancelTripModel;
