import { Box, Button, Dialog, DialogTitle } from "@mui/material";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import listUserApi from "../../../../utils/listUsersAPI";

const BanDriverModal = ({ open, handleClose, userData, fetchUsersData }) => {
  const [banUser, setBanUser] = React.useState({
    idUserSystem: 0,
  });

  const handleBan = async () => {
    const isConfirm = window.confirm(
      "Bạn có chắc chắn muốn vô hiệu hóa tài khoản này ?"
    );
    if (isConfirm) {
      try {
        const response = await listUserApi.banUser(banUser.idUserSystem);
        console.log("mnhas", response);
        toast.success(response.message);
        fetchUsersData();
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
    console.log("datalog", banUser);
  };

  useEffect(() => {
    setBanUser({
      idUserSystem: userData.idUserSystem,
    });
  }, [userData]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ "& .MuiPaper-root": { minWidth: "30vw" } }}
    >
      <DialogTitle textAlign="center">{`Bạn có muốn vô hiệu hóa tài khoản của tài xế" ${userData.fullName} " không ?`}</DialogTitle>
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
          onClick={handleBan}
          sx={{
            backgroundColor: "#6D6DFF",
            color: "white",
            width: "160px",
            ":hover": { bgcolor: "#6868AE" },
          }}
        >
          Vô Hiệu Hóa
        </Button>
      </Box>
      <ToastContainer />
    </Dialog>
  );
};

export default BanDriverModal;
