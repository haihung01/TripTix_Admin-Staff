import { Box, Button, Dialog, DialogTitle } from "@mui/material";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import listUserApi from "../../../../utils/listUsersAPI";

const UnbanStaffModal = ({ open, handleClose, userData, fetchUsersData }) => {
  const [unbanUser, setUnbanUser] = React.useState({
    idUserSystem: 0,
  });

  const handleUnban = async () => {
    const isConfirm = window.confirm(
      "Bạn chắc chắn muốn kích hoạt lại tài khoản này ?"
    );
    if (isConfirm) {
      try {
        const response = await listUserApi.unbanUser(unbanUser.idUserSystem);
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
    console.log("datalog", unbanUser);
  };

  useEffect(() => {
    setUnbanUser({
      idUserSystem: userData.idUserSystem,
    });
  }, [userData]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ "& .MuiPaper-root": { minWidth: "30vw" } }}
    >
      <DialogTitle textAlign="center">{`Bạn có muốn kích hoạt lại tài khoản của nhân viên " ${userData.fullName} " không ?`}</DialogTitle>
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
          onClick={handleUnban}
          sx={{
            backgroundColor: "#6D6DFF",
            color: "white",
            width: "160px",
            ":hover": { bgcolor: "#6868AE" },
          }}
        >
          Kích Hoạt
        </Button>
      </Box>
      <ToastContainer />
    </Dialog>
  );
};

export default UnbanStaffModal;
