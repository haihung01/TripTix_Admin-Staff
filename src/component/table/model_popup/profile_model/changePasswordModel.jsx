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
import * as Yup from "yup";
import listUserApi from "../../../../utils/listUsersAPI";
import { useNavigate } from "react-router-dom";

const StationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(6, "Mật khẩu cũ phải có ít nhất 6 ký tự")
    .max(20, "Mật khẩu cũ có thể dài tối đa 20 ký tự")
    .required("Mật khẩu cũ là bắt buộc !!"),
  newPassword: Yup.string()
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
    .max(20, "Mật khẩu mới có thể dài tối đa 20 ký tự")
    .required("Mật khẩu mới là bắt buộc !!"),
  confirmPassword: Yup.string()
    .required("Xác nhận mật khẩu là bắt buộc !!")
    .oneOf(
      [Yup.ref("newPassword"), null],
      "Xác nhận mật khẩu phải khớp với mật khẩu mới"
    ),
});

const ChangePasswordModal = ({ open, handleClose, id }) => {
  const navigate = useNavigate();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle
        id="form-dialog-title"
        textAlign="center"
        sx={{
          textTransform: "uppercase",
          color: "#575656",
          backgroundImage:
            "linear-gradient(to bottom, #9b9bff, #a1a1f7, #a7a7ee, #acace5, #b2b2dc)",
        }}
      >
        thay đổi mật khẩu
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={StationSchema}
          onSubmit={async (values) => {
            try {
              const changePassword = {
                idUser: id,
                newPassword: values.newPassword,
                oldPassword: values.oldPassword,
              };

              const response = await listUserApi.changePassword(changePassword);
              console.log("mmal", response);
              toast.success(response?.message);
              handleClose();
              const isConfirm = window.confirm(
                "Đổi mật khẩu thành công, bạn có muốn đăng xuất tài khoản khỏi thiết bị này?"
              );
              if (isConfirm) {
                localStorage.clear();
                navigate("/login-page");
              }
            } catch (error) {
              console.log("errr", error?.response?.data?.message);
              toast.error(error?.response?.data?.message);
            }
          }}
        >
          {({ values }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Field name="oldPassword">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Mật Khẩu Cũ"
                        required
                        type="password"
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
                  <Field name="newPassword">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Mật Khẩu Mới"
                        required
                        type="password"
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
                  <Field name="confirmPassword">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Xác Nhận Mật Khẩu"
                        required
                        type="password"
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
                  Thay Đổi
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
