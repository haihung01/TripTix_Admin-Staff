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
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import listBusesApi from "../../../../utils/listBusAPI";
import ReactDatePicker from "react-datepicker";
import "./modelUpdateBus.scss";
import moment from "moment";

const BusesSchema = yup.object().shape({
  name: yup
    .string()
    .min(5, "Tên xe ít nhất phải có 5 kí tự !")
    .max(30, "Tối đa độ dài của tên xe là 30 kí tự !")
    .required("Tên xe là bắt buộc !"),
  licensePlates: yup.string().required("Biển số xe là bắt buộc !"),
  type: yup.string().required("Trường này là bắt buộc, hãy chọn loại xe !"),
  description: yup
    .string()
    .min(10, "Phần mô tả cần ít nhất phải có 10 kí tự !")
    .max(2000, "Độ dài tối đa cho phần mô tả là 2000 kí tự !")
    .required("Mô tả cho chiếc xe là cần thiết và bắt buộc !"),
  capacity: yup.number().required("Số chỗ ngồi cần phải được điền !"),
  floor: yup.number().required("Số tầng của chiếc xe điền !"),
  inspectionDate: yup.date().required("Hạn kiểm định phải được khai báo !"),
  status: yup
    .string()
    .required("Trường này là bắt buộc, hãy chọn trạng thái cho chiếc xe !"),
});

const ModelUpdateBus = ({ open, handleClose, busData, fetchListBuses }) => {
  //Format InspectionDate
  const formatInspectionDate = new Date(busData?.inspectionDate * 1000);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "38vw",
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
            "linear-gradient(to bottom, #9b9bff, #a1a1f7, #a7a7ee, #acace5, #b2b2dc)",
        }}
      >
        Cập Nhật Chiếc Xe
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{
            idBus: busData?.idBus,
            name: busData?.name,
            licensePlates: busData?.licensePlates,
            type: busData?.type,
            description: busData?.description,
            capacity: busData?.capacity,
            floor: busData?.floor,
            inspectionDate: formatInspectionDate,
            status: busData?.status,
          }}
          validationSchema={BusesSchema}
          onSubmit={async (values) => {
            try {
              const busPut = {
                ...values,
                inspectionDate: moment(values.inspectionDate).format(
                  "YYYY-MM-DD"
                ),
              };
              const response = await listBusesApi.updateBus(busPut);
              console.log("mmal", response);
              fetchListBuses();
              toast.success("Update Buses Success !");
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
                  <Field name="idBus">
                    {({ field }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="ID Chiếc Xe"
                        type="number"
                        fullWidth
                        inputProps={{ readOnly: true }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field name="name">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Tên Chiếc Xe"
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
                  <Field name="licensePlates">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Biển Số Xe"
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
                  <Field name="type">
                    {({ field, meta }) => (
                      <FormControl fullWidth>
                        <InputLabel htmlFor="area-select">Loại</InputLabel>
                        <Select
                          {...field}
                          label="Loại"
                          fullWidth
                          error={meta.touched && !!meta.error}
                        >
                          <MenuItem value="LIMOUSINE">LIMOUSINE</MenuItem>
                          <MenuItem value="GHE">GHE</MenuItem>
                          <MenuItem value="GIUONG">GIUONG</MenuItem>
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
                <Grid item xs={12} md={4}>
                  <Field name="capacity">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        label="Số Lượng Chỗ Ngồi"
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
                <Grid item xs={12} md={4}>
                  <Field name="floor">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        label="Số Tầng"
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
                  <Field name="inspectionDate">
                    {({ field, form, meta }) => (
                      <ReactDatePicker
                        className="react-datepicker-wrapper"
                        {...field}
                        customInput={
                          <TextField
                            {...field}
                            label="Hạn Kiểm Định"
                            sx={{
                              "& .MuiInputBase-root": {
                                borderRadius: 2,
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
                        selected={values.inspectionDate || null}
                        onChange={(val) => {
                          form.setFieldValue("inspectionDate", val);
                        }}
                        placeholderText="Chọn Ngày"
                        dateFormat="dd/MM/yyyy"
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
                        label="Mô Tả"
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
                    border: "1px solid red",
                    color: "red",
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

export default ModelUpdateBus;
