import { Box, Button, Dialog, DialogTitle } from "@mui/material";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import listBusesApi from "../../../../utils/listBusAPI";

const ModelDeleteBus = ({ open, handleClose, busData, fetchBusesData }) => {
  const [deleteBus, setDeleteBus] = React.useState({
    idBus: 0,
  });

  const handleDeleteBus = async () => {
    try {
      const response = await listBusesApi.deleteBus(deleteBus.idBus);
      console.log("mnhas", response);
      toast.success(response.message);
      fetchBusesData();
      handleClose();
    } catch (error) {
      console.log("err", error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Delete failed !!");
      }
    }

    console.log("datalog", deleteBus);
  };

  useEffect(() => {
    setDeleteBus({
      idBus: busData.idBus,
    });
  }, [busData]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Bạn có muốn xóa chiếc xe tên " ${busData.name} " không ?`}</DialogTitle>
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
        </Button>
        <Button
          onClick={handleDeleteBus}
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

export default ModelDeleteBus;
