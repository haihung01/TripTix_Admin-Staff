import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Button,
  Dialog,
  DialogActions,
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
import moment from "moment";
import React from "react";
import ReactDatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import listUserApi from "../../../../utils/listUsersAPI";

const UserSchema = yup.object().shape({
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .test(
      "is-positive-number",
      "Số điện thoại phải là kiểu số và là số dương",
      (value) => {
        return /^\d+$/.test(value);
      }
    ),
  fullName: yup.string().required("Họ và tên là bắt buộc"),
  address: yup.string().required("Địa chỉ là bắt buộc"),
  sinhnhat: yup.date().required("Ngày sinh là bắt buộc"),
  gender: yup.string().required("Giới tính là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  citizenIdentityCard: yup.string().required("Chứng minh nhân dân là bắt buộc"),
  assignedRegions: yup.string().required("Vùng được giao là bắt buộc"),
});

const ChangeProfileModal = ({
  open,
  handleClose,
  userData,
  fetchUserProfile,
}) => {
  const formatBirthday = new Date(userData.birthday * 1000);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        textAlign="center"
        variant="h5"
        sx={{
          textTransform: "uppercase",
          color: "#575656",
          backgroundImage:
            "linear-gradient(to bottom, #fd4887, #ff77a2, #ff9ebb, #fdc2d3, #f8e4ea)",
        }}
      >
        Cập nhật thông tin cá nhân
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{
            idUserSystem: userData?.idUserSystem,
            phone: userData?.phone,
            address: userData?.address,
            fullName: userData?.fullName,
            sinhnhat: formatBirthday,
            gender: userData?.gender,
            email: userData?.email,
            citizenIdentityCard: userData?.citizenIdentityCard,
            assignedRegions: userData?.assignedRegions,
          }}
          validationSchema={UserSchema}
          onSubmit={async (values) => {
            console.log("update profile: ", values);
            try {
              const userProfileUpdate = {
                ...values,
                sinhnhat: moment(values.sinhnhat).format("DD-MM-YYYY"),
              };
              const response = await listUserApi.changeProfile(
                userProfileUpdate
              );
              console.log("mmal", response);
              fetchUserProfile();
              toast.success("Update profile Success !");
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
                  <Field name="citizenIdentityCard">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Chứng Minh Nhân Dân"
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
                <Grid item xs={12} md={4}>
                  <Field name="fullName">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Họ Tên"
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
                <Grid item xs={12} md={4}>
                  <Field name="sinhnhat">
                    {({ field, form, meta }) => (
                      <ReactDatePicker
                        {...field}
                        className="react-datepicker-wrapper"
                        customInput={
                          <TextField
                            {...field}
                            label="Ngày Sinh"
                            margin="dense"
                            sx={{
                              "& .MuiInputBase-root": {
                                borderRadius: 1,
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarTodayIcon />
                                </InputAdornment>
                              ),
                            }}
                            error={meta.touched && !!meta.error}
                            helperText={
                              meta.touched && meta.error ? meta.error : ""
                            }
                          />
                        }
                        selectsRange={false}
                        selected={values.sinhnhat || null}
                        onChange={(val) => {
                          form.setFieldValue("sinhnhat", val);
                        }}
                        placeholderText="Pick Time"
                        dateFormat="dd/MM/yyyy"
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field name="gender">
                    {({ field, meta }) => (
                      <FormControl fullWidth margin="dense">
                        <InputLabel>Giới Tính</InputLabel>
                        <Select
                          {...field}
                          label="Giới Tính"
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
                <Grid item xs={12} md={12}>
                  <Field name="address">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        multiline
                        label="Địa Chỉ"
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
                <Grid item xs={12} md={6}>
                  <Field name="email">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        multiline
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
                <Grid item xs={12} md={6}>
                  <Field name="phone">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Số Điện Thoại"
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
                    backgroundColor: "#FF5B94",
                    color: "white",
                    width: "160px",
                    ":hover": { bgcolor: "#F84180" },
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

export default ChangeProfileModal;
