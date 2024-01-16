import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React, { useEffect, useRef, useState } from "react";
import listRouteApi from "../../utils/listRouteAPI";
import listStationApi from "../../utils/listStationAPI";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputAdornment,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { Field, FieldArray, Form, Formik } from "formik";
import { toast } from "react-toastify";
import listProvinceCityApi from "../../utils/listProvinceAPI";

export default function CreateRoute() {
  const formikRef = useRef();
  const [isFetchData, setIsFetchData] = useState(true);
  const [dataStation, setDataStation] = useState([]);
  const [dataProvinceCity, setDataProvinceCity] = useState([]);
  const [listStationSelected, setListStationSelected] = useState([]);
  const [activeStepper, setActiveStepper] = useState(0);
  const steps = ["Tạo tuyến đường & trạm", "Tạo loại vé"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await listProvinceCityApi.getAll({ type: "VN" });
        console.log("dataTBL", response);
        setDataProvinceCity(response.data);

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

  const handleSwitchStep = () => {
    if (activeStepper === 0) {
      const saveListStation = formikRef?.current.values.listStationInRoute;
      setListStationSelected(saveListStation || []);
    }
    setActiveStepper(activeStepper === 0 ? 1 : 0);
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        codeDeparturePoint: "a",
        codeDestination: "b",
        name: "",
        listStationInRoute: [
          { idStation: 0, name: "", distance: 0, province: "", address: "" },
        ],
        listTicketType: [
          {
            name: "",
            idEarlyOnStation: 0,
            idLateOffStation: 0,
            defaultPrice: 0,
          },
        ],
      }}
      //   validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
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
          toast.success(response.message || "Tạo thành công!");
          resetForm();
          setActiveStepper(0);
        } catch (error) {
          console.log("errr", error.response.data.message);
          toast.error(error.response.data.message);
        }
      }}
    >
      {({ values }) => (
        <Form>
          <Stepper activeStep={activeStepper} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStepper === 0 ? (
            <>
              {" "}
              <h1
                style={{
                  color: "grey",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
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
                        helperText={
                          meta.touched && meta.error ? meta.error : ""
                        }
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
                                      groupBy={(option) => option?.province}
                                      getOptionLabel={(option) =>
                                        `[${option?.province}] - ${option?.name} ( ${option?.address} )`
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
                                        form.setFieldValue(
                                          `listStationInRoute.${index}.name`,
                                          newValue ? newValue.name : ""
                                        );
                                        form.setFieldValue(
                                          `listStationInRoute.${index}.province`,
                                          newValue ? newValue.province : ""
                                        );
                                        form.setFieldValue(
                                          `listStationInRoute.${index}.address`,
                                          newValue ? newValue.address : ""
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
                                      label="Khoảng Cách"
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            Km
                                          </InputAdornment>
                                        ),
                                      }}
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
                              province: "",
                              name: "",
                              address: "",
                              distance: 0,
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
            </>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "grey",
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    Danh Sách Loại Vé:{" "}
                  </Typography>
                  <br />
                  <FieldArray name="listTicketType">
                    {({ push, remove }) => (
                      <div>
                        {values.listTicketType.map((st, index) => (
                          <div key={index}>
                            <Typography sx={{ mb: 1 }}>
                              Loại vé {index + 1}
                            </Typography>

                            <Grid container spacing={4}>
                              <Grid item xs={12} md={3}>
                                <Field name={`listTicketType.${index}.name`}>
                                  {({ field, meta }) => (
                                    <TextField
                                      {...field}
                                      required
                                      margin="dense"
                                      label="Tên Loại Vé"
                                      type="text"
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
                              <Grid item xs={12} md={3}>
                                <Field
                                  name={`listTicketType.${index}.idEarlyOnStation`}
                                >
                                  {({ field, form, meta }) => (
                                    <Autocomplete
                                      {...field}
                                      options={listStationSelected.map(
                                        (option, index) => ({
                                          ...option,
                                          index,
                                        })
                                      )}
                                      getOptionLabel={(option) =>
                                        `[${option.province}] - ${option?.name} ( ${option?.address} )`
                                      }
                                      value={
                                        listStationSelected.find(
                                          (option) =>
                                            option?.idStation === field.value
                                        ) || null
                                      }
                                      onChange={(event, newValue) => {
                                        form.setFieldValue(
                                          `listTicketType.${index}.idEarlyOnStation`,
                                          newValue ? newValue.idStation : ""
                                        );
                                      }}
                                      onBlur={form.handleBlur}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          margin="dense"
                                          label="Điểm Lên"
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

                              <Grid item xs={12} md={3}>
                                <Field
                                  name={`listTicketType.${index}.idLateOffStation`}
                                >
                                  {({ field, form, meta }) => (
                                    <Autocomplete
                                      {...field}
                                      options={listStationSelected.map(
                                        (option, index) => ({
                                          ...option,
                                          index,
                                        })
                                      )}
                                      getOptionLabel={(option) =>
                                        `[${option.province}] - ${option?.name} ( ${option?.address} )`
                                      }
                                      value={
                                        listStationSelected.find(
                                          (option) =>
                                            option?.idStation === field.value
                                        ) || null
                                      }
                                      onChange={(event, newValue) => {
                                        form.setFieldValue(
                                          `listTicketType.${index}.idLateOffStation`,
                                          newValue ? newValue.idStation : ""
                                        );
                                      }}
                                      onBlur={form.handleBlur}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          margin="dense"
                                          label="Điểm xuống"
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
                                  name={`listTicketType.${index}.defaultPrice`}
                                >
                                  {({ field, meta }) => (
                                    <TextField
                                      {...field}
                                      required
                                      margin="dense"
                                      label="Giá Vé Cơ Bản"
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            VND
                                          </InputAdornment>
                                        ),
                                      }}
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
                              name: "",
                              idEarlyOnStation: 0,
                              idLateOffStation: 0,
                              defaultPrice: 0,
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
            </>
          )}
          <Box
            sx={{
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: "30px",
              // WebkitBoxShadow: "2px 4px 10px 1px rgba(0, 0, 0, 0.47)",
              // boxShadow: "2px 4px 10px 1px rgba(70, 68, 68, 0.47)",
              width: "90%",
              margin: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                mt: "20px",
                gap: "100px",
              }}
            >
              <Button onClick={() => handleSwitchStep()}>Quay lại</Button>
              {activeStepper === 0 ? (
                <Button onClick={() => handleSwitchStep()}>
                  Bước tiếp theo
                </Button>
              ) : (
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
              )}
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
