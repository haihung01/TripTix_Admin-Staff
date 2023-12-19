import { Box, Button, Dialog, DialogTitle } from "@mui/material";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import listNewsApi from "../../../../utils/listNewsAPI";

const ModelDeleteNews = ({ open, handleClose, newsData, fetchNewsData }) => {
  const [deleteNews, setDeleteNews] = React.useState({
    idNews: 0,
  });

  const handleDeleteNews = async () => {
    const isConfirm = window.confirm("Bạn chắc chắn muốn xóa ?");
    if (isConfirm) {
      try {
        const response = await listNewsApi.deleteNews(deleteNews.idNews);
        console.log("mnhas", response);
        toast.success(response.message);
        fetchNewsData();
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
    console.log("datalog", deleteNews);
  };

  useEffect(() => {
    setDeleteNews({
      idNews: newsData.idNews,
    });
  }, [newsData]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle textAlign="center">{`Bạn có muốn xóa tin tức : ${newsData.title} ?`}</DialogTitle>
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
          onClick={handleDeleteNews}
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

export default ModelDeleteNews;
