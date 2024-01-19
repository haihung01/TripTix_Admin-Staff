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
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useAuth from "../../../../hook/useAuth";
import listNewsApi from "../../../../utils/listNewsAPI";

const NewsSchema = Yup.object().shape({
  title: Yup.string().required("Tiêu đề là bắt buộc !"),
  description: Yup.string()
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(8000, "Mô tả có thể dài tối đa 8000 ký tự")
    .required("Mô tả là bắt buộc !"),
  fileList: Yup.mixed().required("Một tệp là bắt buộc"),
});

const AddNewsPopup = ({ open, handleClose, fetchListNews }) => {
  const { auth } = useAuth();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle
        id="form-dialog-title"
        textAlign="center"
        variant="h5"
        sx={{
          textTransform: "uppercase",
          color: "#575656",
          backgroundImage:
            "linear-gradient(to bottom, #9b9bff, #a1a1f7, #a7a7ee, #acace5, #b2b2dc)",
        }}
      >
        Thêm Tin Tức
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{
            idStaff: auth.user.idUserSystem,
            description: "",
            title: "",
            fileList: null,
          }}
          validationSchema={NewsSchema}
          onSubmit={async (values) => {
            console.log("add busses input: ", values);
            const formData = new FormData();
            formData.append("idStaff", values.idStaff);
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("image", values.fileList);

            try {
              const response = await listNewsApi.createNews(formData);
              console.log("Buse", response);
              fetchListNews();
              toast.success(response?.message);
              handleClose();
            } catch (error) {
              console.log("errr", error.response.data.error);
              toast.error(error.response.data.error);
            }
          }}
        >
          {({ values }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Field name="idStaff">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="ID Nhân viên"
                        InputProps={{
                          readOnly: true,
                        }}
                        type="number"
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
                  <Field name="title">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
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
                        label="Nội dung tin tức"
                        multiline
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
                  <Field name="fileList">
                    {({ field, form, meta }) => (
                      <>
                        <input
                          type="file"
                          name="fileList"
                          id="fileList"
                          onChange={(event) =>
                            form.setFieldValue(
                              field.name,
                              event.currentTarget.files[0]
                            )
                          }
                        />
                        {meta.touched && meta.error && (
                          <div style={{ color: "red" }}>{meta.error}</div>
                        )}
                      </>
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
                  Cancel
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
                  Submit
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewsPopup;
