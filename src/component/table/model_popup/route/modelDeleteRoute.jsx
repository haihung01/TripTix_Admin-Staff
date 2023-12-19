import { Box, Button, Dialog, DialogTitle } from "@mui/material";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import listRouteApi from "../../../../utils/listRouteAPI";

const ModelDeleteRoute = ({ open, handleClose, routeData, fetchRouteData }) => {
  const [deleteRoute, setDeleteRoute] = React.useState({
    idRoute: 0,
  });

  const handledeleteRoute = async () => {
    const isConfirm = window.confirm(
      "Bạn có chắc chắn rằng sẽ xóa đi tuyến đường này không ?"
    );
    if (isConfirm) {
      try {
        const response = await listRouteApi.deleteRoute(deleteRoute.idRoute);
        console.log("mnhas", response);
        toast.success(response.message);
        fetchRouteData();
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
    console.log("datalog", deleteRoute);
  };

  useEffect(() => {
    setDeleteRoute({
      idRoute: routeData.idRoute,
    });
  }, [routeData]);

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
      <DialogTitle textAlign="center">{`Bạn có muốn xóa đi tuyến đường này không ?`}</DialogTitle>
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
          onClick={handledeleteRoute}
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

export default ModelDeleteRoute;
