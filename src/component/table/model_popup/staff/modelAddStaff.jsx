import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import moment from "moment-timezone";
import React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import listUserApi from "../../../../utils/listUsersAPI";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Họ và tên là bắt buộc"),
  citizenIdentityCard: Yup.string()
    .required("Chứng minh nhân dân là bắt buộc")
    .matches(/^[0-9]+$/, "Chứng minh nhân dân chỉ được chứa số")
    .test(
      "isCitizenIdentityCard",
      "Chứng minh nhân dân không hợp lệ",
      (value) => /^[0-9]{10,12}$/.test(value)
    ),
  address: Yup.string().required("Địa chỉ là bắt buộc"),
  userName: Yup.string()
    .min(3, "Tên tài khoản phải có ít nhất 6 ký tự")
    .max(15, "Tên tài khoản chỉ được tối đa 15 ký tự")
    .required("Tên tài khoản là bắt buộc"),
  phone: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
    .test("isPhoneNumber", "Số điện thoại không hợp lệ", (value) =>
      /^[0-9]{10}$/.test(value)
    ),
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(15, "Mật khẩu chỉ được tối đa 15 ký tự"),
  birthday: Yup.date().required("Ngày sinh là bắt buộc"),
  gender: Yup.string().required("Giới tính là bắt buộc"),
  assignedRegions: Yup.string().required("Vùng được giao là bắt buộc"),
});

const AddUserModal = ({ open, handleClose, fetchUserData }) => {
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
        Thêm Nhân Viên
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{
            fullName: "",
            citizenIdentityCard: "",
            userName: "",
            address: "",
            phone: "",
            email: "",
            password: "",
            birthday: "",
            gender: "",
            assignedRegions: "",
            role: "STAFF",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const birthdayFormat = moment(values.birthday).format("DD-M-yyyy");
            console.log("birthday: ", birthdayFormat);
            console.log("birthDa23: ", values.birthday);
            try {
              const userPost = {
                ...values,
                birthday: birthdayFormat,
              };
              const response = await listUserApi.createNewUser(userPost);
              console.log("mmal", response);
              fetchUserData();
              handleClose();
              toast.success("Create User Success !");
            } catch (error) {
              console.log("errr", error.response.data.data);
              toast.error(error.response.data.data);
            }
          }}
        >
          {({ values }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                  <Field name="fullName">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Họ tên"
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

                <Grid item xs={6} md={6}>
                  <Field name="phone">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Số diện thoại"
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

                <Grid item xs={6} md={12}>
                  <Field name="citizenIdentityCard">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="CMND/CCCD"
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

                <Grid item xs={6} md={6}>
                  <Field name="address">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Địa chỉ"
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

                <Grid item xs={6} md={6}>
                  <Field name="email">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Email"
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
                <Grid item xs={6} md={6}>
                  <Field name="userName">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Tài khoản"
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
                <Grid item xs={6} md={6}>
                  <Field name="password">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Mật khẩu"
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

                <Grid item xs={4} md={4}>
                  <Field name="birthday">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        type="date"
                        className="MuiInputBase-input"
                        fullWidth
                        label="Ngày sinh"
                        InputLabelProps={{
                          shrink: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarTodayIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: 2,
                          },
                        }}
                        error={meta.touched && !!meta.error}
                        helperText={
                          meta.touched && meta.error ? meta.error : ""
                        }
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={4} md={4}>
                  <Field name="gender">
                    {({ field, form, meta }) => (
                      <FormControl fullWidth>
                        <InputLabel htmlFor="area-select">Giới tính</InputLabel>
                        <Select
                          {...field}
                          label="Giới tính"
                          fullWidth
                          error={meta.touched && !!meta.error}
                        >
                          <MenuItem value="MALE">Male</MenuItem>
                          <MenuItem value="FEMALE">Female</MenuItem>
                        </Select>
                        <Typography
                          color="#D80032"
                          sx={{ fontSize: "12px", p: 0.5 }}
                        >
                          {meta.touched && meta.error ? meta.error : ""}
                        </Typography>
                      </FormControl>
                    )}
                  </Field>
                </Grid>

                <Grid item xs={4} md={4}>
                  <Field name="assignedRegions">
                    {({ field, form, meta }) => (
                      <FormControl fullWidth>
                        <InputLabel htmlFor="area-select">Khu vực</InputLabel>
                        <Select
                          {...field}
                          label="Khu vực"
                          fullWidth
                          error={meta.touched && !!meta.error}
                        >
                          <MenuItem value="Hỗn hợp">Hỗn hợp</MenuItem>
                          <MenuItem value="Bắc">Bắc</MenuItem>
                          <MenuItem value="Trung">Trung</MenuItem>
                          <MenuItem value="Nam">Nam</MenuItem>
                        </Select>
                        <Typography
                          color="#D80032"
                          sx={{ fontSize: "12px", p: 0.5 }}
                        >
                          {meta.touched && meta.error ? meta.error : ""}
                        </Typography>
                      </FormControl>
                    )}
                  </Field>
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  p: "20px",
                }}
              >
                <Button
                  type="button"
                  sx={{
                    backgroundColor: "white",
                    color: "red",
                    border: "1px solid red",
                    width: "160px",
                  }}
                  onClick={handleClose}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  sx={{
                    backgroundColor: "#FF5B94",
                    color: "white",
                    width: "160px",
                    ":hover": { bgcolor: "#F84180" },
                  }}
                >
                  Tạo Nhân Viên
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;