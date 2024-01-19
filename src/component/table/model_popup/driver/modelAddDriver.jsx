import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Autocomplete,
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
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import listUserApi from "../../../../utils/listUsersAPI";
import listStationApi from "../../../../utils/listStationAPI";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Họ và tên là bắt buộc"),
  userName: Yup.string()
    .min(6, "Tên tài khoản ít nhất phải 6 kí tự")
    .required("Tên tài khoản là bắt buộc"),
  citizenIdentityCard: Yup.string()
    .required("Chứng minh nhân dân là bắt buộc")
    .matches(/^[0-9]+$/, "Chứng minh nhân dân chỉ được chứa số")
    .test(
      "isCitizenIdentityCard",
      "Chứng minh nhân dân không hợp lệ",
      (value) => /^[0-9]{10,12}$/.test(value)
    ),
  address: Yup.string().required("Địa chỉ là bắt buộc"),
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
});

const AddDriverModel = ({ open, handleClose, fetchUserData }) => {
  const [dataStation, setDataStation] = useState([]);

  useEffect(() => {
    const fetchListStation = async () => {
      try {
        const stationResponse = await listStationApi.getAll({});
        console.log("dataTBL123", stationResponse.data);
        setDataStation(stationResponse.data);
      } catch (error) {
        console.log("err", error);
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Load Data failed !");
        }
      }
    };
    fetchListStation();
  }, []);

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
        Thêm tài xế
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
            password: "123456",
            birthday: "",
            gender: "",
            role: "DRIVER",
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
              toast.success(response?.message);
            } catch (error) {
              console.log("errr", error.response.data.message);
              toast.error(error.response.data.message);
            }
          }}
        >
          {({ values }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6} md={12}>
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
                <Grid item xs={12} md={12}>
                  <Field name="belongTo">
                    {({ field, form, meta }) => (
                      <>
                        <Autocomplete
                          // {...field}
                          isOptionEqualToValue={(option, value) =>
                            option === value
                          }
                          options={dataStation}
                          getOptionLabel={(option) =>
                            `Trạm số: ${option?.idStation} - ${option?.name} - (${option?.address})`
                          }
                          onChange={(event, newValue) => {
                            form.setFieldValue(
                              "belongTo",
                              newValue ? newValue.idStation : ""
                            );
                          }}
                          onBlur={form.handleBlur}
                          renderInput={(params) => (
                            <TextField
                              {...field}
                              {...params}
                              label="Trạm"
                              error={meta.touched && !!meta.error}
                              helperText={
                                meta.touched && meta.error ? meta.error : ""
                              }
                            />
                          )}
                        />
                      </>
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
                  <Field name="phone">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Số điện thoại"
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
                        label="Tên tài khoản"
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
                        }}
                        InputProps={{
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

                <Grid item xs={6} md={6}>
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
                          <MenuItem value="MALE">Nam</MenuItem>
                          <MenuItem value="FEMALE">Nữ</MenuItem>
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
                    backgroundColor: "#6D6DFF",
                    color: "white",
                    width: "160px",
                    ":hover": { bgcolor: "#6868AE" },
                  }}
                >
                  Tạo Tài Xế
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverModel;
