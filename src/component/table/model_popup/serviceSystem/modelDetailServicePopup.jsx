import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";

const ModelDetailService = ({ open, handleClose, serviceData }) => {
  console.log("laasy data service: ", serviceData);
  return (
    <Dialog open={open} onClose={handleClose}>
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
        Thông Tin Dịch Vụ
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ ml: "30px" }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <Typography textAlign="center" fontWeight="bold" fontSize="20px">
                {serviceData.title}
              </Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                sx={{ width: "492px" }}
                label="ID Dịch vụ"
                value={serviceData.idConfigSystem}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                sx={{ width: "492px" }}
                label="Ngày tạo"
                value={moment(serviceData.createdDate).format("DD/MM/YYYY")}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                sx={{ width: "492px" }}
                label="Tên dịch vụ ( loại )"
                value={serviceData.name}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                sx={{ width: "492px" }}
                label="Giá trị"
                value={serviceData.value}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          m: "20px",
        }}
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
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default ModelDetailService;
