import {
  Box,
  Button,
  CardMedia,
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
import Carousel from "react-material-ui-carousel";

const ModelDetailNews = ({ open, handleClose, newsData }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ "& .MuiPaper-root": { minWidth: "40vw" } }}
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
        Chi tiết tin tức
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Carousel sx={{ margin: "auto", border: "none" }}>
          {newsData.listImg &&
            newsData.listImg.map((i, index) => (
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
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <Typography textAlign="center" fontWeight="bold" fontSize="20px">
                {newsData.title}
              </Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                label="Ngày tạo"
                value={moment(newsData.createdDate).format("DD/MM/YYYY")}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                rows={4}
                maxRows={4}
                multiline
                label="Nội dung bài viết"
                value={newsData.description}
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
          Đóng
        </Button>
      </Box>
    </Dialog>
  );
};

export default ModelDetailNews;
