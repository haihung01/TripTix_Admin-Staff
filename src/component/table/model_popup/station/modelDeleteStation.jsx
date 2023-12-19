import { Box, Button, Dialog, DialogTitle } from "@mui/material";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import listStationApi from "../../../../utils/listStationAPI";

const ModelDeleteStation = ({
  open,
  handleClose,
  stationData,
  fetchStationsData,
}) => {
  const [deleteStation, setDeleteStation] = React.useState({
    idStation: 0,
  });

  const handledeleteStation = async () => {
    const isConfirm = window.confirm(
      "Bạn có chắc chắn rằng sẽ xóa đi trạm xe này không ?"
    );
    if (isConfirm) {
      try {
        const response = await listStationApi.deleteStaion(
          deleteStation.idStation
        );
        console.log("mnhas", response);
        toast.success(response.message);
        fetchStationsData();
        handleClose();
      } catch (error) {
        console.log("err", error);
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Delete failed !!");
        }
      }
    }
    console.log("datalog", deleteStation);
  };

  useEffect(() => {
    setDeleteStation({
      idStation: stationData.idStation,
    });
  }, [stationData]);

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
      <DialogTitle textAlign="center">{`Bạn có muốn xóa đi trạm xe " ${stationData.name} " không ?`}</DialogTitle>
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
          Hủy
        </Button>{" "}
        <Button
          onClick={handledeleteStation}
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

export default ModelDeleteStation;
