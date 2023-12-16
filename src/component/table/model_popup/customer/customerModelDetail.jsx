import {
  Avatar,
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
import moment from "moment";
import React from "react";

const ModalDriverPopup = ({ open, handleClose, userData }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
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
        Thông Tin Người Dùng
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item>
            <Box sx={{ pl: "9rem" }}>
              <Avatar
                sx={{
                  height: "250px",
                  width: "250px",
                }}
                src={userData.img}
                alt={userData.fullName}
              />
            </Box>
          </Grid>
          <Grid item>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <TextField
                    sx={{ width: "550px" }}
                    label="Ngày tạo"
                    value={moment(userData.createdDate).format("DD/MM/YYYY")}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    sx={{ width: "265px" }}
                    label="Họ tên"
                    value={userData.fullName}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    sx={{ width: "265px" }}
                    label="Ngày sinh"
                    value={moment(userData.birthday * 1000).format(
                      "DD/MM/YYYY"
                    )}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    sx={{ width: "265px" }}
                    label="Email"
                    value={userData.email}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    sx={{ width: "265px" }}
                    label="Số điện thoại"
                    value={userData.phone}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    sx={{ width: "550px" }}
                    label="Địa chỉ"
                    multiline
                    value={userData.address}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
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
      </DialogActions>
    </Dialog>
  );
};

export default ModalDriverPopup;
