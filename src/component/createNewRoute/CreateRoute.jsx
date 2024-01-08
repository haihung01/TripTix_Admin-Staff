import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React, { useEffect, useRef, useState } from "react";
import listUserApi from "../../utils/listUsersAPI";
import listRouteApi from "../../utils/listRouteAPI";
import listBusesApi from "../../utils/listBusAPI";
import listStationApi from "../../utils/listStationAPI";

import { toast } from "react-toastify";
import { Field, FieldArray, Form, Formik } from "formik";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import listProvinceCityApi from "../../utils/listProvinceAPI";

export default function CreateRoute() {
  const formikRef = useRef();
  const [driverData, setDriverData] = useState([]);
  const [busData, setBusData] = useState([]);
  const [isFetchData, setIsFetchData] = useState(true);
  const [dataStation, setDataStation] = useState([]);
  const [dataProvinceCity, setDataProvinceCity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await listProvinceCityApi.getAll({ type: "VN" });
        console.log("dataTBL", response);
        setDataProvinceCity(response.data);

        const userResponse = await listUserApi.getAll({ role: "DRIVER" });
        console.log("dataDrivers", userResponse);
        setDriverData(userResponse.data);

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

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        codeDeparturePoint: "",
        codeDestination: "",
        name: "",
        listStationInRoute: [{ idStation: 0, distance: 0 }],
        listTicketType: [
          {
            name: "",
            type: "",
            idEarlyOnStation: 0,
            idLateOffStation: 0,
            defaultPrice: 0,
          },
        ],
      }}
      //   validationSchema={validationSchema}
      onSubmit={async (values) => {
        console.log("valuh", values);
        const listStationInRouteFormat = values.listStationInRoute.map((p) => {
          return {
            idStation: p.idStation,
            distance: p.distance,
          };
        });
        const listTicket = values.listTicketType.map((p) => {
          return {
            name: p.name,
            idEarlyOnStation: p.idEarlyOnStation,
            idLateOffStation: p.idLateOffStation,
            defaultPrice: p.defaultPrice,
          };
        });
        console.log("dataAS: ", listStationInRouteFormat);
        try {
          const tripPost = {
            ...values,
            listStationInRoute: listStationInRouteFormat,
            listTicketType: listTicket,
          };
          const response = await listRouteApi.createNewRoute(tripPost);
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
              ༺ Tạo Tuyến Đường Mới ༻
            </h1>

            <Grid container spacing={4}>
              <Grid item xs={12} md={12}>
                <Field name="name">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      required
                      margin="dense"
                      label="Tên Tuyến Đường"
                      type="text"
                      fullWidth
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12} md={6}>
                <Field name="codeDeparturePoint">
                  {({ field, form, meta }) => (
                    <Autocomplete
                      // {...field}
                      isOptionEqualToValue={(option, value) => option === value}
                      options={dataProvinceCity}
                      getOptionLabel={(option) =>
                        `${option?.name} - (${option?.type})`
                      }
                      onChange={(event, newValue) => {
                        form.setFieldValue(
                          "codeDeparturePoint",
                          newValue ? newValue.idProvince : ""
                        );
                      }}
                      onBlur={form.handleBlur}
                      renderInput={(params) => (
                        <TextField
                          {...field}
                          {...params}
                          label="Điểm lên"
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
                <Field name="codeDestination">
                  {({ field, form, meta }) => (
                    <Autocomplete
                      options={dataProvinceCity}
                      getOptionLabel={(option) =>
                        `${option?.name} - (${option?.type})`
                      }
                      onChange={(event, newValue) => {
                        form.setFieldValue(
                          "codeDestination",
                          newValue ? newValue.idProvince : ""
                        );
                      }}
                      onBlur={form.handleBlur}
                      renderInput={(params) => (
                        <TextField
                          {...field}
                          {...params}
                          label="Điểm xuống"
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
                <Typography
                  variant="h5"
                  sx={{ color: "grey", textTransform: "uppercase" }}
                >
                  Danh Sách trạm:{" "}
                </Typography>
                <br />
                <FieldArray name="listStationInRoute">
                  {({ push, remove }) => (
                    <div>
                      {values.listStationInRoute.map((st, index) => (
                        <div key={index}>
                          <Typography sx={{ mb: 1 }}>
                            Trạm {index + 1}
                          </Typography>

                          <Grid container spacing={4}>
                            <Grid item xs={12} md={9}>
                              <Field
                                name={`listStationInRoute.${index}.idStation`}
                              >
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
                                        `listStationInRoute.${index}.idStation`,
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
                                name={`listStationInRoute.${index}.distance`}
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
                <FieldArray name="listStationInRoute">
                  {({ push, remove }) => (
                    <div>
                      {values.listStationInRoute.map((st, index) => (
                        <div key={index}>
                          <Typography sx={{ mb: 1 }}>
                            Trạm {index + 1}
                          </Typography>

                          <Grid container spacing={4}>
                            <Grid item xs={12} md={9}>
                              <Field
                                name={`listStationInRoute.${index}.idStation`}
                              >
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
                                        `listStationInRoute.${index}.idStation`,
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
                                name={`listStationInRoute.${index}.distance`}
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
                Tạo Tuyến
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
