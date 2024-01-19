import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import listNewsApi from "../../../../utils/listNewsAPI";

const NewsSchema = yup.object().shape({
  title: yup
    .string()
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .required("Tiêu đề là bắt buộc"),
  description: yup
    .string()
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(8000, "Mô tả có thể dài tối đa 8000 ký tự")
    .required("Mô tả là bắt buộc"),
});

const ModelUpdateNews = ({ open, handleClose, newsData, fetchListNews }) => {
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
        Cập Nhật Tin Tức
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{
            idNews: newsData?.idNews,
            idStaff: newsData?.idStaff,
            title: newsData?.title,
            description: newsData?.description,
          }}
          validationSchema={NewsSchema}
          onSubmit={async (values) => {
            try {
              const newsPut = {
                ...values,
              };
              const response = await listNewsApi.updateNews(newsPut);
              console.log("mmal", response);
              fetchListNews();
              toast.success(response?.message);
              handleClose();
            } catch (error) {
              console.log("errr", error.response.data.message);
              toast.error(error.response.data.message);
            }
          }}
        >
          {({ values }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Field name="idNews">
                    {({ field }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="ID Tin tức"
                        type="text"
                        fullWidth
                        inputProps={{ readOnly: true }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Field name="idStaff">
                    {({ field }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="ID nhân viên tạo"
                        type="number"
                        fullWidth
                        inputProps={{ readOnly: true }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Field name="title">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        multiline
                        label="Tiêu đề"
                        type="text"
                        fullWidth
                        error={meta.touched && !!meta.error}
                        helperText={
                          meta.touched && meta.error ? meta.error : ""
                        }
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Field name="description">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        rows={4}
                        maxRows={4}
                        multiline
                        label="Nội dung tin tức"
                        type="text"
                        fullWidth
                        error={meta.touched && !!meta.error}
                        helperText={
                          meta.touched && meta.error ? meta.error : ""
                        }
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
              <DialogActions
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  p: "20px",
                }}
              >
                <Button
                  onClick={handleClose}
                  type="button"
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
                  type="submit"
                  sx={{
                    backgroundColor: "#6D6DFF",
                    color: "white",
                    width: "160px",
                    ":hover": { bgcolor: "#6868AE" },
                  }}
                >
                  Cập Nhật
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ModelUpdateNews;
