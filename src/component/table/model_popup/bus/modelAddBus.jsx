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
import React, { useEffect,useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import * as Yup from "yup";
import listBusesApi from "../../../../utils/listBusAPI";
import listStationApi from "../../../../utils/listStationAPI"
const StationSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, "Tên trạm phải có ít nhất 5 ký tự")
    .max(30, "Tên trạm có thể dài tối đa 30 ký tự")
    .required("Tên trạm là bắt buộc và phải là duy nhất"),
  type: Yup.string().required("Tên loại là bắt buộc !"),
  description: Yup.string()
    .min(5, "Mô tả phải có ít nhất 5 ký tự")
    .max(2000, "Mô tả có thể dài tối đa 2000 ký tự")
    .required("Mô tả là bắt buộc !"),
  licensePlates: Yup.string().required("Biển số xe là bắt buộc !"),
  fileList: Yup.mixed().required(" Ảnh mô tả bắt buộc !"),
});

const AddBusesPopup = ({ open, handleClose, fetchListbuses }) => {
  const [dataStation,setDataStation] = useState();
  useEffect(() => {
    const fetchListProvinceCity = async () => {
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
    fetchListProvinceCity();
}, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" textAlign="center"
        sx={{
          textTransform: "uppercase",
          color: "#575656",
          backgroundImage:
            "linear-gradient(to bottom, #f37106, #f8903b, #fac074, #f8aa85, #fcedc5)",
        }}
      >
        Thêm xe khách mới
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{
            name: "",
            licensePlates: "",
            type: "",
            description: "",
            capacity: 0,
            floor: 0,
            inspectionDate: "",
            belongTo: "",
            fileList: null,
          }}
          validationSchema={StationSchema}
          onSubmit={async (values) => {
            console.log("add busses input: ", values);
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("licensePlates", values.licensePlates);
            formData.append("type", values.type);
            formData.append("description", values.description);
            formData.append("capacity", values.capacity);
            formData.append("floor", values.floor);
            formData.append("belongTo", values.belongTo);

            formData.append(
              "inspectionDate",
              moment(values.inspectionDate).format("YYYY-MM-DD")
            );

            for (let i = 0; i < values.fileList.length; i++) {
              formData.append("fileList", values.fileList[i]);
            }

            try {
              const response = await listBusesApi.createNewBuses(formData);
              console.log("Buse", response);
              fetchListbuses();
              toast.success("Thêm Xe Khách Mới Thành công !");
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
                <Grid item xs={12} md={6}>
                  <Field name="name">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Tên Xe"
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
                <Grid item xs={6} md={6}>
                  <Field name="belongTo">
                    {({ field, meta }) => (
                      <FormControl fullWidth>
                        <InputLabel htmlFor="area-select">Thuộc trạm</InputLabel>
                        <Select
                          {...field}
                          label="Thuộc trạm"
                          fullWidth
                          error={meta.touched && !!meta.error}
                        >
                          {/* <MenuItem value= {dataStation.idStation} >{dataStation.name}</MenuItem> */}
                          {dataStation.map(station => (
                              <MenuItem key={station.idStation} value={station.idStation}>
                                  {station.name}  -  ( {station.address} )
                              </MenuItem>
                              ))}
                          {/* <MenuItem value="FEMALE">Female</MenuItem> */}
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
                        label="Số Lượng Ghế"
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
                        label="Mô Tả Xe"
                        multiline
                        placeholder="VD: Xe đẹp, thoải mái, có điều hòa,...."
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
                          multiple
                          type="file"
                          name="fileList"
                          id="fileList"
                          onChange={(event) =>
                            form.setFieldValue(
                              field.name,
                              event.currentTarget.files
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
                  Tạo Xe
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddBusesPopup;
