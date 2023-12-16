import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Autocomplete,
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
import { Field, FieldArray, Form, Formik } from "formik";
import moment from "moment";
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
  // fare: Yup.number()
  //   .min(0, "Fare can not less than 0 !")
  //   .required("Required"),
  // listTripStop: Yup.string().required("Required"),
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
  // fare: Yup.number()
  //   .positive("Fare must be a positive number")
  //   .required("Fare is required"),
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

  const formatStartTime = new Date(tripData.startTimee * 1000);
  formatStartTime.setHours(formatStartTime.getHours() - 7);
  const formatEndTime = new Date(tripData.endTimee * 1000);
  formatEndTime.setHours(formatEndTime.getHours() - 7);

  const listTripStopFormat = tripData?.listtripStopDTO?.map((p) => {
    let timeComess = new Date(p.timeComess * 1000);
    timeComess.setHours(timeComess.getHours() - 7);
    return {
      ...p,
      timeComess: timeComess,
    };
  });
  console.log("lisstTripStop: ", listTripStopFormat);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "50vw",
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
            "linear-gradient(to bottom, #f37106, #f8903b, #fac074, #f8aa85, #fcedc5)",
        }}
      >
        Cập Nhật Chuyến Đi
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{
            idTrip: tripData.idTrip,
            idDriver: tripData.idDriver,
            idBus: tripData.idBus,
            status: tripData.status,
            fare: tripData.fare,
            startTime: formatStartTime,
            endTime: formatEndTime,
            adminCheck: tripData.adminCheck,
            listTripStop: listTripStopFormat,
          }}
          validationSchema={TripSchema}
          onSubmit={async (values) => {
            console.log("valuh", values);
            const TripStopFormatData = values.listTripStop.map((p) => {
              return {
                idStation: p.idStation,
                type: p.type,
                costsIncurred: p.costsIncurred,
                timeComes: moment(p.timeComess).format("DD-MM-yyyy HH:mm:ss"),
              };
            });
            console.log("dataAS: ", TripStopFormatData);
            try {
              const tripPost = {
                ...values,
                listTripStop: TripStopFormatData,
                startTime: moment(values.startTime)
                  // .subtract(7, "hours")
                  .format("DD-MM-yyyy HH:mm:ss"),
                endTime: moment(values.endTime)
                  // .subtract(7, "hours")
                  .format("DD-MM-yyyy HH:mm:ss"),
              };
              console.log("startTimeeee: ", tripPost.startTime);
              const response = await listTripApi.updateTrip(tripPost);
              console.log("testdata", response);
              handleClose();
              toast.success("Update Trip Success !");
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
                {/* <Grid item xs={12} md={12}>
                  <Field name="fare">
                    {({ field }) => (
                      <TextField
                        {...field}
                        required
                        margin="dense"
                        label="Giá Vé"
                        type="number"
                        fullWidth
                      />
                    )}
                  </Field>
                </Grid> */}
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
                <Grid item xs={12} md={12}>
                  <FieldArray name="listTripStop">
                    {({ push, remove }) => (
                      <div>
                        {values.listTripStop.map((st, index) => (
                          <div key={index}>
                            <Typography sx={{ mb: 1 }}>
                              Trạm {index + 1}
                            </Typography>

                            <Grid container spacing={2}>
                              <Grid item xs={12} md={4}>
                                <Field name={`listTripStop.${index}.idStation`}>
                                  {({ field, form, meta }) => (
                                    <Autocomplete
                                      {...field}
                                      options={dataStation}
                                      getOptionLabel={(option) => option.name}
                                      value={
                                        dataStation.find(
                                          (option) =>
                                            option.idStation === field.value
                                        ) || null
                                      }
                                      onChange={(event, newValue) => {
                                        form.setFieldValue(
                                          `listTripStop.${index}.idStation`,
                                          newValue ? newValue.idStation : ""
                                        );
                                      }}
                                      onBlur={form.handleBlur}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          margin="dense"
                                          label="Trạm"
                                          error={meta.touched && !!meta.error}
                                          helperText={
                                            meta.touched && meta.error
                                              ? meta.error
                                              : ""
                                          }
                                        />
                                      )}
                                    />
                                  )}
                                </Field>
                              </Grid>

                              {/* <Grid item xs={12} md={2}>
                                <Field name={`listTripStop.${index}.type`}>
                                  {({ field, meta }) => (
                                    <FormControl fullWidth margin="dense">
                                      <InputLabel>Loại</InputLabel>
                                      <Select
                                        {...field}
                                        label="Loại"
                                        error={meta.touched && !!meta.error}
                                      >
                                        <MenuItem value="PICKUP">
                                          Pickup
                                        </MenuItem>
                                        <MenuItem value="DROPOFF">
                                          Dropoff
                                        </MenuItem>
                                      </Select>
                                      {meta.touched && meta.error && (
                                        <div style={{ color: "red" }}>
                                          {meta.error}
                                        </div>
                                      )}
                                    </FormControl>
                                  )}
                                </Field>
                              </Grid> */}
                              <Grid item xs={12} md={3}>
                                <Field
                                  name={`listTripStop.${index}.costsIncurred`}
                                >
                                  {({ field, meta }) => (
                                    <TextField
                                      {...field}
                                      required
                                      margin="dense"
                                      label="Giá Trạm"
                                      type="number"
                                      fullWidth
                                      error={meta.touched && !!meta.error}
                                      helperText={
                                        meta.touched && meta.error
                                          ? meta.error
                                          : ""
                                      }
                                    />
                                  )}
                                </Field>
                              </Grid>

                              <Grid item xs={12} md={4}>
                                <Field
                                  name={`listTripStop.${index}.timeComess`}
                                >
                                  {({ field, form, meta }) => (
                                    <ReactDatePicker
                                      {...field}
                                      showTimeSelect
                                      customInput={
                                        <TextField
                                          {...field}
                                          margin="dense"
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
                                            meta.touched && meta.error
                                              ? meta.error
                                              : ""
                                          }
                                        />
                                      }
                                      selectsRange={false}
                                      selected={
                                        values.listTripStop[index].timeComess ||
                                        null
                                      }
                                      onChange={(val) => {
                                        form.setFieldValue(
                                          `listTripStop.${index}.timeComess`,
                                          val
                                        );
                                      }}
                                      placeholderText="Pick Time"
                                      dateFormat="dd/MM/yyyy hh:mm a"
                                    />
                                  )}
                                </Field>
                              </Grid>

                              <Grid item xs={12} md={1}>
                                <Button
                                  type="button"
                                  sx={{
                                    mb: "20px",
                                    color: "red",
                                  }}
                                  onClick={() => remove(index)}
                                >
                                  <HighlightOffIcon />
                                </Button>
                              </Grid>
                            </Grid>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="contained"
                          sx={{
                            backgroundColor: "#2196F3 ",
                            width: "105px",
                            color: "white",
                            mt: "20px",
                          }}
                          onClick={() =>
                            push({
                              idStation: 0,
                              type: "",
                              timeComes: "",
                            })
                          }
                        >
                          <AddIcon />
                        </Button>
                      </div>
                    )}
                  </FieldArray>
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

export default UpdateTrip;
