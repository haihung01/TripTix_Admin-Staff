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
import DatePicker from "react-multi-date-picker";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useAuth from "../../hook/useAuth";
import listBusesApi from "../../utils/listBusAPI";
import listRouteApi from "../../utils/listRouteAPI";
// import listStationApi from "../../utils/listStationAPI";
import listTripApi from "../../utils/listTripAPI";
import listUserApi from "../../utils/listUsersAPI";
import formatFormApi from "../../utils/formFormatAPI";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

export default function CreateTrip() {
  const { auth } = useAuth();
  const formikRef = useRef();
  const [routeData, setRouteData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [busData, setBusData] = useState([]);
  const [isFetchData, setIsFetchData] = useState(true);
  const [dataStation, setDataStation] = useState([]);
  const [dataTicketInRoute, setDataTicketInRoute] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);

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

        // const stationResponse = await listStationApi.getAll({});
        // console.log("dataTBL", stationResponse);
        // setDataStation(stationResponse.data);
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

  const handleGetStationByRoute = async (routeID) => {
    try {
      const stationResponse = await listRouteApi.routeDetail({
        id: routeID || "",
      });
      console.log("dataTBL", stationResponse);
      setDataStation(stationResponse.data?.listStationInRoute || []);
      setDataTicketInRoute(stationResponse.data?.listTicketType || []);
      setIsDisabled(false);
      const listStationInRouteAPI =
        stationResponse.data?.listStationInRoute || [];
      formikRef.current.setFieldValue(
        "listStationTimeCome",
        listStationInRouteAPI
      );
      const listTicketInRoute = stationResponse.data?.listTicketType?.map(
        (p) => {
          return { idTicketType: p.idTicketType, price: p.defaultPrice };
        }
      );
      formikRef.current.setFieldValue(
        "listTicketTypeInTrip",
        listTicketInRoute
      );
    } catch (error) {
      console.log("err", error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi khi tải dữ liệu!");
      }
    }
  };

  //DATA FORMAT

  const handleFormatForm = useCallback(
    async (idRoute) => {
      try {
        const response = await formatFormApi.formatCreateForm({ idRoute });
        console.log("list trip stop data", response.data.listTripStop);
        if (formikRef.current) {
          const listStationTimeComeFormatAPI = response.data.listTripStop.map(
            (m) => {
              return {
                idStation: m.idStation,
                type: m.type,
                costsIncurred: m.costsIncurred,
                timeComes: moment(m.timeComes, "DD-MM-YYYY HH:mm:ss").toDate(),
              };
            }
          );
          formikRef.current.setFieldValue("fare", response.data.fare);
          formikRef.current.setFieldValue(
            "departureDate",
            moment(response.data.departureDate, "DD-MM-YYYY HH:mm:ss").toDate()
          );
          formikRef.current.setFieldValue(
            "endDate",
            moment(response.data.endDate, "DD-MM-YYYY HH:mm:ss").toDate()
          );
          formikRef.current.setFieldValue(
            "listStationTimeCome",
            listStationTimeComeFormatAPI
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

  // const validationSchema = Yup.object({
  //   idRoute: Yup.string().required("Phải chọn tuyến đường !"),
  //   idDriver: Yup.string().required("Phải chọn tài xế !"),
  //   idVehicle: Yup.string().required("Phải chọn xe buýt !"),
  //   // fare: Yup.number()
  //   //   .positive("Giá vé phải là số dương")
  //   //   .integer("Giá vé phải là số nguyên")
  //   //   .required("Phải nhập giá vé !")
  //   //   .min(1000, "Giá vé phải ít nhất 1000"),
  //   departureDate: Yup.date()
  //     .min(new Date(), "Phải chọn từ ngày mai trở đi!")
  //     .required("Phải chọn trường này !"),
  //   endDate: Yup.date()
  //     .min(
  //       Yup.ref("departureDate"),
  //       "Thời gian kết thúc phải sau thời gian bắt đầu"
  //     )
  //     .test(
  //       "is-greater",
  //       "Thời gian đến phải sau thời gian khởi hành",
  //       function (value) {
  //         const { departureDate } = this.parent;
  //         return value > departureDate;
  //       }
  //     )
  //     .required("Phải chọn trường này !"),
  //   listStationTimeCome: Yup.array().of(
  //     Yup.object().shape({
  //       idStation: Yup.string().required("Phải chọn trường này !"),
  //       timeComes: Yup.date().required("Phải chọn trường này !"),
  //     })
  //   ),
  // });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        idStaff: auth.user.idUserSystem,
        idRoute: 0,
        idDriver: 0,
        idVehicle: 0,
        listStationTimeCome: [{ idStationInRoute: 0, timeComes: "" }],
        listTicketTypeInTrip: [{ idTicketType: 0, price: 0 }],
        listSchedule: [],
        departureDate: "",
        endDate: "",
      }}
      // validationSchema={validationSchema}
      onSubmit={async (values) => {
        console.log("valuh", values);
        const listStationTimeComeFormat = values.listStationTimeCome.map(
          (p) => {
            return {
              idStationInRoute: p.idStationInRoute,
              timeComes: moment(p.timeComes).format("HH:mm:ss"),
            };
          }
        );
        // Format dữ liệu cho listTicket
        const listTicketFormat = values.listTicketTypeInTrip.map((p) => ({
          idTicketType: p.idTicketType,
          price: p.price,
        }));
        //format list schedule
        const listScheduleFormat = values.listSchedule.map((p) =>
          moment(new Date(p)).format("DD-MM-yyyy")
        );

        console.log("dataAS: ", listStationTimeComeFormat);
        console.log("list ngày: ", values.listSchedule);
        try {
          const tripPost = {
            ...values,
            listStationTimeCome: listStationTimeComeFormat,
            listTicketTypeInTrip: listTicketFormat,
            listSchedule: listScheduleFormat,
            departureDate: moment(values.departureDate).format(
              "DD-MM-yyyy HH:mm:ss"
            ),
            endDate: moment(values.endDate).format("DD-MM-yyyy HH:mm:ss"),
          };
          console.log("departureDateeee: ", tripPost.departureDate);
          const response = await listTripApi.createTripByStaff(tripPost);
          console.log("testdata", response);
          toast.success(response?.message);
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
                        isOptionEqualToValue={(option, value) =>
                          option === value
                        }
                        options={routeData}
                        getOptionLabel={(option) => `${option?.name}`}
                        onChange={(event, newValue) => {
                          form.setFieldValue(
                            "idRoute",
                            newValue ? newValue.idRoute : ""
                          );
                          handleGetStationByRoute(newValue?.idRoute);
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
                        } )`
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
                <Field name="idVehicle">
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
                        } ) - Xe:  ${option?.capacity} chỗ `
                      }
                      onChange={(event, newValue) => {
                        form.setFieldValue(
                          "idVehicle",
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
                <Field name="departureDate">
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
                      selected={values.departureDate || null}
                      onChange={(val) => {
                        form.setFieldValue("departureDate", val);
                      }}
                      placeholderText="Chọn Ngày/Giờ"
                      dateFormat="dd/MM/yyyy hh:mm a"
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12} md={6}>
                <Field name="endDate">
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
                      selected={values.endDate || null}
                      onChange={(val) => {
                        form.setFieldValue("endDate", val);
                      }}
                      placeholderText="Chọn Ngày/Giờ"
                      dateFormat="dd/MM/yyyy hh:mm a"
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} md={12}>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="h5" sx={{ color: "grey", mr: 1 }}>
                    Danh sách những ngày lặp lại chuyến:{" "}
                  </Typography>
                  <Field name="listSchedule">
                    {({ field, form, meta }) => (
                      <DatePicker
                        {...field}
                        multiple
                        value={values.listSchedule}
                        onChange={(date) => {
                          form.setFieldValue("listSchedule", date);
                        }}
                        format={"DD/MM/YYYY"}
                        sort
                        plugins={[<DatePanel />]}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography
                  variant="h5"
                  sx={{ color: "grey", textTransform: "uppercase" }}
                >
                  Danh Sách trạm:{" "}
                </Typography>
                <br />
                <FieldArray name="listStationTimeCome">
                  {({ push, remove }) => (
                    <div>
                      {values.listStationTimeCome.map((st, index) => (
                        <div key={index}>
                          <Typography sx={{ mb: 1 }}>
                            Trạm {index + 1}
                          </Typography>

                          <Grid container spacing={4}>
                            <Grid item xs={12} md={7}>
                              <Field
                                name={`listStationTimeCome.${index}.idStationInRoute`}
                              >
                                {({ field, form, meta }) => (
                                  <Autocomplete
                                    {...field}
                                    disabled={isDisabled}
                                    options={dataStation.map(
                                      (option, index) => ({
                                        ...option,
                                        index,
                                      })
                                    )}
                                    getOptionLabel={(option) =>
                                      `Trạm số: ${option?.idStation} - ${option?.station?.name} - ( ${option?.station?.address} )`
                                    }
                                    value={
                                      dataStation.find(
                                        (option) =>
                                          option?.idStationInRoute ===
                                          field.value
                                      ) || null
                                    }
                                    onChange={(event, newValue) => {
                                      form.setFieldValue(
                                        `listStationTimeCome.${index}.idStationInRoute`,
                                        newValue
                                          ? newValue.idStationInRoute
                                          : ""
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

                            <Grid item xs={12} md={4}>
                              <Field
                                name={`listStationTimeCome.${index}.timeComes`}
                              >
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
                                      values.listStationTimeCome[index]
                                        .timeComes || null
                                    }
                                    onChange={(val) => {
                                      form.setFieldValue(
                                        `listStationTimeCome.${index}.timeComes`,
                                        val
                                      );
                                    }}
                                    placeholderText="Chọn Giờ"
                                    dateFormat="hh:mm a"
                                    showTimeSelectOnly
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
              <Grid item xs={12} md={12}>
                <Typography
                  variant="h5"
                  sx={{ color: "grey", textTransform: "uppercase" }}
                >
                  Danh Sách Loại Vé:{" "}
                </Typography>
                <br />
                <FieldArray name="listTicketTypeInTrip">
                  {({ push, remove }) => (
                    <div>
                      {values.listTicketTypeInTrip.map((st, index) => (
                        <div key={index}>
                          <Typography sx={{ mb: 1 }}>
                            Loại Vé {index + 1}
                          </Typography>

                          <Grid container spacing={4}>
                            <Grid item xs={12} md={7}>
                              <Field
                                name={`listTicketTypeInTrip.${index}.idTicketType`}
                              >
                                {({ field, form, meta }) => (
                                  <Autocomplete
                                    {...field}
                                    disabled={true}
                                    options={dataTicketInRoute.map(
                                      (option, index) => ({
                                        ...option,
                                        index,
                                      })
                                    )}
                                    getOptionLabel={(option) =>
                                      `${option?.name}`
                                    }
                                    value={
                                      dataTicketInRoute.find(
                                        (option) =>
                                          option?.idTicketType === field.value
                                      ) || null
                                    }
                                    onChange={(event, newValue) => {
                                      form.setFieldValue(
                                        `listTicketTypeInTrip.${index}.idTicketType`,
                                        newValue ? newValue.idTicketType : ""
                                      );
                                      form.setFieldValue(
                                        `listTicketTypeInTrip.${index}.price`,
                                        newValue ? newValue.defaultPrice : ""
                                      );
                                    }}
                                    onBlur={form.handleBlur}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        margin="dense"
                                        label="Tên Loại Vé"
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

                            <Grid item xs={12} md={4}>
                              <Field
                                name={`listTicketTypeInTrip.${index}.price`}
                              >
                                {({ field, meta }) => (
                                  <TextField
                                    {...field}
                                    required
                                    margin="dense"
                                    label="Giá Vé"
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
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
