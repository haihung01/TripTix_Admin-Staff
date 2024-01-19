import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  TextField
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import listBusesApi from "../../../../utils/listBusAPI";
import listStationApi from "../../../../utils/listStationAPI";
import listTripApi from "../../../../utils/listTripAPI";
import listUserApi from "../../../../utils/listUsersAPI";
import "./modelUpdateTrip.scss";

const TripSchema = Yup.object({
  idDriver: Yup.string().required("Required"),
  idBus: Yup.string().required("Required"),
  startTime: Yup.date()
    .min(new Date(), "Must choose starting tomorrow!")
    .required("This field must be selected !"),
  endTime: Yup.date()
    .min(Yup.ref("startTime"), "End time must be after start time")
    .test(
      "is-greater",
      "Arrival time must be after start time",
      function (value) {
        const { startTime } = this.parent;
        return value > startTime;
      }
    )
    .required("This field must be selected !"),
});

const UpdateTrip = ({ open, handleClose, tripData, fetchListTrip }) => {
  console.log("lấy data: ", tripData);
  //DATA BUS
  const [busData, setBusData] = useState([]);

  useEffect(() => {
    const fetchListBus = async () => {
      try {
        const response = await listBusesApi.getAll({});
        setBusData(response.data);
      } catch (error) {
        console.log("err", error);
        setBusData([]);
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Load Data failed !");
        }
      }
    };
    fetchListBus();
  }, []);

  //DATA DRIVER
  const [driverData, setDriverData] = useState([]);

  const fetchListUser = async () => {
    try {
      const response = await listUserApi.getAll({
        role: "DRIVER",
      });
      setDriverData(response.data);
    } catch (error) {
      console.log("err", error);
      setDriverData([]);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Load Data failed !");
      }
    }
  };
  useEffect(() => {
    fetchListUser();
  }, []);

  //DATA STATION
  const [dataStation, setDataStation] = useState([]);

  useEffect(() => {
    const fetchListStation = async () => {
      try {
        const response = await listStationApi.getAll({});
        console.log("dataTBL", response);
        setDataStation(response.data);
      } catch (error) {
        console.log("err", error);
        setDataStation([]);
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Load Data failed !");
        }
      }
    };
    fetchListStation();
  }, []);

  const formatStartTime = new Date(tripData.departureDateLT * 1000);
  formatStartTime.setHours(formatStartTime.getHours() - 7);
  const formatEndTime = new Date(tripData.endDateLT * 1000);
  formatEndTime.setHours(formatEndTime.getHours() - 7);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "45%",
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
        Cập Nhật Chuyến Đi
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{
            idTrip: tripData?.idTrip,
            idDriver: tripData?.driver?.idUserSystem,
            idBus: tripData?.vehicle?.idBus,
            status: tripData?.status,
            fare: tripData?.fare,
            startTime: formatStartTime,
            endTime: formatEndTime,
            adminCheck: tripData?.adminCheck,
          }}
          validationSchema={TripSchema}
          onSubmit={async (values) => {
            try {
              const tripPost = {
                idTrip: values.idTrip,
                idDriver: values.idDriver,
                idBus: values.idBus,
              };

              const response = await listTripApi.updateTrip(tripPost);
              console.log("testdata", response);
              handleClose();
              toast.success(response?.message);
              // fetchListTrip();
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
                  <Field name="idTrip">
                    {({ field }) => (
                      <TextField
                        {...field}
                        required
                        margin="dense"
                        label="ID Chuyến Đi"
                        type="number"
                        inputProps={{ readOnly: true }}
                        fullWidth
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Field name="idDriver">
                    {({ field, form, meta }) => (
                      <Autocomplete
                        {...field}
                        options={driverData}
                        getOptionLabel={(option) => option.fullName}
                        value={
                          driverData.find(
                            (option) => option.idUserSystem === values.idDriver
                          ) || null
                        }
                        onChange={(_, newValue) =>
                          form.setFieldValue(
                            "idDriver",
                            newValue ? newValue.idUserSystem : null
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...field}
                            label="Tài Xế"
                            error={meta.touched && !!meta.error}
                            helperText={
                              meta.touched && meta.error ? meta.error : ""
                            }
                          />
                        )}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Field name="idBus">
                    {({ field, form, meta }) => (
                      <Autocomplete
                        {...field}
                        options={busData}
                        getOptionLabel={(option) => option.name}
                        value={
                          busData.find(
                            (option) => option.idBus === values.idBus
                          ) || null
                        }
                        onChange={(_, newValue) =>
                          form.setFieldValue(
                            "idBus",
                            newValue ? newValue.idBus : null
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...field}
                            label="Xe Khách"
                            error={meta.touched && !!meta.error}
                            helperText={
                              meta.touched && meta.error ? meta.error : ""
                            }
                          />
                        )}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field name="startTime">
                    {({ field, form, meta }) => (
                      <ReactDatePicker
                        {...field}
                        showTimeSelect
                        customInput={
                          <TextField
                            {...field}
                            fullWidth
                            label="Thời Gian Bắt Đầu ( Dự Kiến )"
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
                        selected={values.startTime || null}
                        onChange={(val) => {
                          form.setFieldValue("startTime", val);
                        }}
                        placeholderText="Chọn Ngày/Giờ"
                        dateFormat="dd/MM/yyyy hh:mm a"
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field name="endTime">
                    {({ field, form, meta }) => (
                      <ReactDatePicker
                        className="react-datepicker-wrapper"
                        {...field}
                        showTimeSelect
                        customInput={
                          <TextField
                            {...field}
                            fullWidth
                            label="Thời Gian Kết Thúc ( Dự Kiến )"
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
                        selected={values.endTime || null}
                        onChange={(val) => {
                          form.setFieldValue("endTime", val);
                        }}
                        placeholderText="Chọn Ngày/Giờ"
                        dateFormat="dd/MM/yyyy hh:mm a"
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
                  Hủy Bỏ
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

export default UpdateTrip;
