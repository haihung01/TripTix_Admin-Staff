import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Divider,
} from "@mui/material";
import listUserApi from "../../../../utils/listUsersAPI";

const UpdateStaffModal = ({ open, handleClose, userData, fetchDataUser }) => {
  const [updatedUserData, setUpdatedUserData] = React.useState({
    idStaff: 0,
    assignedRegions: "",
  });

  useEffect(() => {
    setUpdatedUserData({
      idStaff: userData.idUserSystem,

      assignedRegions: userData.assignedRegions,
    });
  }, [userData]);

  const handleUpdate = async () => {
    try {
      const response = await listUserApi.updateStaff(updatedUserData); // Sử dụng updatedUserData thay vì userData
      console.log("mnhas", response);
      toast.success(response.message);
      fetchDataUser();
      handleClose();
    } catch (error) {
      console.log("err", error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("update failed !!");
      }
    }
    console.log("datalog", updatedUserData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "30vw",
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
        Cập Nhật Nhân Viên
      </DialogTitle>
      <Divider />
      <DialogContent>
        <div style={{ paddingTop: "10px" }}>
          <TextField
            label="ID nhân viên"
            name="idStaff"
            value={updatedUserData.idStaff}
            onChange={handleInputChange}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </div>

        <div style={{ paddingTop: "10px" }}>
          <FormControl fullWidth>
            <InputLabel htmlFor="area-select">Khu vực</InputLabel>
            <Select
              label="Khu vực"
              name="assignedRegions"
              value={updatedUserData.assignedRegions}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value={"Hỗn hợp"}>Liên vùng</MenuItem>
              <MenuItem value={"Bắc"}>Bắc</MenuItem>
              <MenuItem value={"Trung"}>Trung</MenuItem>
              <MenuItem value={"Nam"}>Nam</MenuItem>
            </Select>
          </FormControl>
        </div>
      </DialogContent>
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
          onClick={handleUpdate}
          sx={{
            backgroundColor: "#6D6DFF",
            color: "white",
            width: "160px",
            ":hover": { bgcolor: "#6868AE" },
          }}
        >
          Cập Nhật
        </Button>
      </Box>
      <ToastContainer />
    </Dialog>
  );
};

export default UpdateStaffModal;
