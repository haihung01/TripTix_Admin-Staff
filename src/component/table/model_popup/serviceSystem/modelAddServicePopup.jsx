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
import configSystemApi from "../../../../utils/ConfigSystemAPI";

const ServiceSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, "Tên dịch vụ phải có ít nhất 5 ký tự")
    .required("Tên dịch vụ là bắt buộc"),
  value: Yup.number()
    .min(5, "Giá trị tối thiểu phải là 5")
    .required("Giá trị là bắt buộc"),
});

const AddServicePopup = ({ open, handleClose, fetchListServices }) => {
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
        Thêm dịch vụ
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{
            name: "",
            value: 0,
          }}
          validationSchema={ServiceSchema}
          onSubmit={async (values) => {
            try {
              const servicePost = {
                ...values,
              };
              const response = await configSystemApi.createService(servicePost);
              console.log("mmal", response);
              fetchListServices();
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
                  <Field name="name">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Tên dịch vụ ( loại )"
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
                  <Field name="value">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Giá trị"
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
                  hủy
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
                  Thêm dịch vụ
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddServicePopup;
