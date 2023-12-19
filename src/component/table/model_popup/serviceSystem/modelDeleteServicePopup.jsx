import { Box, Button, Dialog, DialogTitle } from "@mui/material";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import configSystemApi from "../../../../utils/ConfigSystemAPI";

const ModelDeleteService = ({
  open,
  handleClose,
  serviceData,
  fetchServicesData,
}) => {
  const [deleteService, setDeleteService] = React.useState({
    idConfigSystem: 0,
  });

  const handleDeleteService = async () => {
    const isConfirm = window.confirm("Bạn chắc chắn muốn xóa dịch vụ này ?");
    if (isConfirm) {
      try {
        const response = await configSystemApi.deleteService(
          deleteService.idConfigSystem
        );
        console.log("mnhas", response);
        toast.success(response.message);
        fetchServicesData();
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
  };

  useEffect(() => {
    setDeleteService({
      idConfigSystem: serviceData.idConfigSystem,
    });
  }, [serviceData]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Bạn muốn xóa dịch vụ: ${serviceData.name} ?`}</DialogTitle>
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
          không
        </Button>
        <Button
          onClick={handleDeleteService}
          sx={{
            backgroundColor: "#6D6DFF",
            color: "white",
            width: "160px",
            ":hover": { bgcolor: "#6868AE" },
          }}
        >
          xác nhận
        </Button>
      </Box>
      <ToastContainer />
    </Dialog>
  );
};

export default ModelDeleteService;
