import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputAdornment,
  Typography,
  TextField,
} from "@mui/material";
import { Field, FieldArray, Form, Formik } from "formik";
import moment from "moment-timezone";
import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactDatePicker from "react-datepicker";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useAuth from "../../hook/useAuth";
import listBusesApi from "../../utils/listBusAPI";
import listRouteApi from "../../utils/listRouteAPI";
import listStationApi from "../../utils/listStationAPI";
import listTripApi from "../../utils/listTripAPI";
import listUserApi from "../../utils/listUsersAPI";
import formatFormApi from "../../utils/formFormatAPI";

export default function CreateTrip() {
  const { auth } = useAuth();
  const formikRef = useRef();
  const [routeData, setRouteData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [busData, setBusData] = useState([]);
  const [isFetchData, setIsFetchData] = useState(true);
  const [dataStation, setDataStation] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await listUserApi.getAll({ role: "DRIVER" });
        console.log("dataDrivers", userResponse);
        setDriverData(userResponse.data);

        const routeResponse = await listRouteApi.getAll({});
        console.log("dataRoute", routeResponse);
        setRouteData(routeResponse.data);

        const busResponse = await listBusesApi.getAll({});
        console.log("dataBuses", busResponse);
        setBusData(busResponse.data);

        const stationResponse = await listStationApi.getAll({});
        console.log("dataTBL", stationResponse);
        setDataStation(stationResponse.data);
      } catch (error) {
        console.log("err", error);
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Lỗi khi tải dữ liệu!");
        }
      }
    };
    if (isFetchData) {
      fetchData();
      setIsFetchData(false);
    }
  }, [isFetchData]);

  //DATA FORMAT

  const handleFormatForm = useCallback(
    async (idRoute) => {
      try {
        const response = await formatFormApi.formatCreateForm({ idRoute });
        console.log("list trip stop data", response.data.listTripStop);
        if (formikRef.current) {
          const listTripStopFormatAPI = response.data.listTripStop.map((m) => {
            return {
              idStation: m.idStation,
              type: m.type,
              costsIncurred: m.costsIncurred,
              timeComes: moment(m.timeComes, "DD-MM-YYYY HH:mm:ss").toDate(),
            };
          });
          formikRef.current.setFieldValue("fare", response.data.fare);
          formikRef.current.setFieldValue(
            "startTime",
            moment(response.data.startTime, "DD-MM-YYYY HH:mm:ss").toDate()
          );
          formikRef.current.setFieldValue(
            "endTime",
            moment(response.data.endTime, "DD-MM-YYYY HH:mm:ss").toDate()
          );
          formikRef.current.setFieldValue(
            "listTripStop",
            listTripStopFormatAPI
          );
        }
      } catch (error) {
        console.log("err", error);
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Load Data failed !");
        }
      }
    },
    [formikRef]
  );

  const validationSchema = Yup.object({
    idRoute: Yup.string().required("Phải chọn tuyến đường !"),
    idDriver: Yup.string().required("Phải chọn tài xế !"),
    idBus: Yup.string().required("Phải chọn xe buýt !"),
    // fare: Yup.number()
    //   .positive("Giá vé phải là số dương")
    //   .integer("Giá vé phải là số nguyên")
    //   .required("Phải nhập giá vé !")
    //   .min(1000, "Giá vé phải ít nhất 1000"),
    startTime: Yup.date()
      .min(new Date(), "Phải chọn từ ngày mai trở đi!")
      .required("Phải chọn trường này !"),
    endTime: Yup.date()
      .min(
        Yup.ref("startTime"),
        "Thời gian kết thúc phải sau thời gian bắt đầu"
      )
      .test(
        "is-greater",
        "Thời gian đến phải sau thời gian khởi hành",
        function (value) {
          const { startTime } = this.parent;
          return value > startTime;
        }
      )
      .required("Phải chọn trường này !"),
    listTripStop: Yup.array().of(
      Yup.object().shape({
        idStation: Yup.string().required("Phải chọn trường này !"),
        // type: Yup.string()
        //   .oneOf(["PICKUP", "DROPOFF"])
        //   .required("Phải chọn trường này !"),
        costsIncurred: Yup.number()
          .positive("Giá vé phải là số dương")
          .integer("Giá vé phải là số nguyên")
          .required("Phải nhập giá vé !")
          .min(0, "Giá vé không được âm tiền"),
        timeComes: Yup.date().required("Phải chọn trường này !"),
      })
    ),
  });

  const handleSaveTemplate = async (values) => {
    try {
      // Format dữ liệu cho listTripStop
      const listTripStopFormat = values.listTripStop.map((p) => ({
        idStation: p.idStation,
        type: p.type,
        costsIncurred: p.costsIncurred,
        timeComes: moment(p.timeComes).format("DD-MM-yyyy HH:mm:ss"),
      }));

      // Tạo object để gửi lên API
      const tripPost = {
        ...values,
        listTripStop: listTripStopFormat,
        startTime: moment(values.startTime).format("DD-MM-yyyy HH:mm:ss"),
        endTime: moment(values.endTime).format("DD-MM-yyyy HH:mm:ss"),
      };

      // Gọi API để lưu template chuyến đi
      const response = await listTripApi.saveTemplateTrip(tripPost);

      // Xử lý phản hồi
      console.log("Phản hồi từ API:", response);
      toast.success("Lưu mẫu chuyến đi thành công!");
    } catch (error) {
      console.error(
        "Lỗi khi lưu mẫu chuyến đi:",
        error.response?.data.message || error.message
      );
      toast.error("Lỗi khi lưu mẫu chuyến đi. Vui lòng thử lại.");
    }
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        idStaff: auth.user.idUserSystem,
        idRoute: 0,
        idDriver: 0,
        idBus: 0,
        // fare: 0,
        listTripStop: [
          { idStation: 0, type: "", costsIncurred: 0, timeComes: "" },
        ],
        startTime: "",
        endTime: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        console.log("valuh", values);
        const listTripStopFormat = values.listTripStop.map((p) => {
          return {
            idStation: p.idStation,
            type: "abc",
            costsIncurred: p.costsIncurred,
            timeComes: moment(p.timeComes).format("DD-MM-yyyy HH:mm:ss"),
          };
        });
        console.log("dataAS: ", listTripStopFormat);
        try {
          // await handleSaveTemplate(values);
          const tripPost = {
            ...values,
            listTripStop: listTripStopFormat,
            startTime: moment(values.startTime).format("DD-MM-yyyy HH:mm:ss"),
            endTime: moment(values.endTime).format("DD-MM-yyyy HH:mm:ss"),
          };
          console.log("startTimeeee: ", tripPost.startTime);
          const response = await listTripApi.createTripByStaff(tripPost);
          console.log("testdata", response);
          toast.success("Create Trip Success !");
        } catch (error) {
          console.log("errr", error.response.data.message);
          toast.error(error.response.data.message);
        }
      }}
    >
      {({ values }) => (
        <Form>
          <Box
            sx={{
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: "30px",
              WebkitBoxShadow: "2px 4px 10px 1px rgba(0, 0, 0, 0.47)",
              boxShadow: "2px 4px 10px 1px rgba(70, 68, 68, 0.47)",
              width: "85  %",
              margin: "auto",
            }}
          >
            <h1 style={{ color: "grey", textTransform: "uppercase" }}>
              ༺ Tạo Chuyến Đi Mới ༻
            </h1>

            <Grid container spacing={4}>
              <Grid item xs={12} md={12}>
                <Field name="idRoute">
                  {({ field, form, meta }) => (
                    <>
                      <Autocomplete
                        // {...field}
                        isOptionEqualToValue={(option, value) =>
                          option === value
                        }
                        options={routeData}
                        getOptionLabel={(option) =>
                          `${option?.departurePoint} - ${
                            option?.destination
                          } (${
                            option?.region === "Nam"
                              ? "Phía Nam"
                              : option?.region === "Bắc"
                              ? "Phía Bắc"
                              : option?.region === "Hỗn hợp"
                              ? "Liên vùng"
                              : option?.region
                          })`
                        }
                        onChange={(event, newValue) => {
                          form.setFieldValue(
                            "idRoute",
                            newValue ? newValue.idRoute : ""
                          );
                        }}
                        onBlur={form.handleBlur}
                        renderInput={(params) => (
                          <TextField
                            {...field}
                            {...params}
                            label="Tuyến Đường"
                            error={meta.touched && !!meta.error}
                            helperText={
                              meta.touched && meta.error ? meta.error : ""
                            }
                          />
                        )}
                      />
                      <Button
                        onClick={() => handleFormatForm(field.value)}
                        sx={{
                          backgroundColor: "#6D6DFF",
                          color: "white",
                          width: "160px",
                          ":hover": { bgcolor: "#6868AE" },
                          mt: 2,
                        }}
                      >
                        Sử Dụng Mẫu
                      </Button>
                    </>
                  )}
                </Field>
              </Grid>

              <Grid item xs={12} md={6}>
                <Field name="idDriver">
                  {({ field, form, meta }) => (
                    <Autocomplete
                      // {...field}
                      isOptionEqualToValue={(option, value) => option === value}
                      options={driverData.map((option, index) => ({
                        ...option,
                        index,
                      }))}
                      getOptionLabel={(option) =>
                        `${option.index + 1}. ${option?.fullName} - ( ${
                          option?.address
                        } ) - Thuộc về trạm số: ${option.belongTo}`
                      }
                      onChange={(event, newValue) => {
                        form.setFieldValue(
                          "idDriver",
                          newValue ? newValue.idUserSystem : ""
                        );
                      }}
                      // onBlur={form.handleBlur}
                      renderInput={(params) => (
                        <TextField
                          {...field}
                          {...params}
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

              <Grid item xs={12} md={6}>
                <Field name="idBus">
                  {({ field, form, meta }) => (
                    <Autocomplete
                      // {...field}
                      isOptionEqualToValue={(option, value) => option === value}
                      options={busData.map((option, index) => ({
                        ...option,
                        index,
                      }))}
                      getOptionLabel={(option) =>
                        `${option.index + 1}. ${option?.name} - ( ${
                          option?.type
                        } ) - Xe:  ${
                          option?.capacity
                        } chỗ - Thuộc về trạm số: ${option.belongTo}`
                      }
                      onChange={(event, newValue) => {
                        form.setFieldValue(
                          "idBus",
                          newValue ? newValue.idBus : ""
                        );
                      }}
                      onBlur={form.handleBlur}
                      renderInput={(params) => (
                        <TextField
                          {...field}
                          {...params}
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
                {/* <Field name="fare">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      required
                      margin="dense"
                      label="Giá Vé"
                      type="number"
                      fullWidth
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field> */}
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

                          <Grid container spacing={4}>
                            <Grid item xs={12} md={7}>
                              <Field name={`listTripStop.${index}.idStation`}>
                                {({ field, form, meta }) => (
                                  <Autocomplete
                                    {...field}
                                    options={dataStation.map(
                                      (option, index) => ({
                                        ...option,
                                        index,
                                      })
                                    )}
                                    getOptionLabel={(option) =>
                                      `Trạm số: ${option.idStation} - ${option?.name} - ( ${option?.address} )`
                                    }
                                    value={
                                      dataStation.find(
                                        (option) =>
                                          option?.idStation === field.value
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

                            <Grid item xs={12} md={2}>
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

                            <Grid item xs={12} md={2}>
                              <Field name={`listTripStop.${index}.timeComes`}>
                                {({ field, form, meta }) => (
                                  <ReactDatePicker
                                    {...field}
                                    showTimeSelect
                                    customInput={
                                      <TextField
                                        {...field}
                                        fullWidth
                                        label="Thời Gian ( Dự Kiến )"
                                        margin="dense"
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
                                      values.listTripStop[index].timeComes ||
                                      null
                                    }
                                    onChange={(val) => {
                                      form.setFieldValue(
                                        `listTripStop.${index}.timeComes`,
                                        val
                                      );
                                    }}
                                    placeholderText="Chọn Ngày/Giờ"
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
                          backgroundColor: "#6D6DFF",
                          color: "white",
                          width: "100px",
                          ":hover": { bgcolor: "#6868AE" },
                          mt: 2,
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

            <Box
              sx={{
                display: "flex",
                mt: "20px",
                gap: "100px",
                // justifyContent: "space-evenly"
              }}
            >
              <Button
                sx={{
                  // mt: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyItems: "center",
                  backgroundColor: "#6D6DFF",
                  color: "white",
                  width: "160px",
                  ":hover": { bgcolor: "#6868AE" },
                }}
                type="submit"
              >
                Tạo Chuyến
              </Button>

              <Button
                sx={{
                  // mt: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyItems: "center",
                  backgroundColor: "#FF5B94",
                  color: "white",
                  width: "160px",
                  ":hover": { bgcolor: "#F84180" },
                }}
                type="submit"
                onClick={() => handleSaveTemplate(values)}
              >
                Lưu chuyến đi
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
