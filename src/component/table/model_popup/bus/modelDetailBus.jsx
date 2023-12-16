import {
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";
import Carousel from "react-material-ui-carousel";

const ModelDetailBus = ({ open, handleClose, busData }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "45vw",
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
            "linear-gradient(to bottom, #f37106, #f8903b, #fac074, #f8aa85, #fcedc5)",
        }}
      >
        **Thông Tin Chiếc Xe**
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Carousel sx={{ margin: "auto", border: "none", pb: "20px" }}>
          {busData.imgLink &&
            busData.imgLink.map((i, index) => (
              <CardMedia
                key={index}
                component="img"
                height="345"
                image={i}
                alt="img"
                sx={{ objectFit: "cover" }}
              />
            ))}
        </Carousel>

        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                label="ID Chiếc Xe"
                value={busData.idBus}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên Xe"
                value={busData.name}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Biển Số Xe"
                value={busData.licensePlates}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Loại"
                value={busData.type}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Số Lượng Chố Ngồi"
                value={busData.capacity}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Số Tầng"
                value={busData.floor}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                multiline
                label="Mô Tả"
                value={busData.description}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </Box>
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

export default ModelDetailBus;
