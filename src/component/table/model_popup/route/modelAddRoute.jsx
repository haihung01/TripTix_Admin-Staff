import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";
import listStationApi from "../../../../utils/listStationAPI";
import { toast } from "react-toastify";
import listProvinceCityApi from "../../../../utils/listProvinceAPI";
import listRouteApi from "../../../../utils/listRouteAPI";

const RouteSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, "Tên trạm phải có ít nhất 5 ký tự")
    .max(30, "Tên trạm có thể dài tối đa 30 ký tự")
    .required("Tên trạm là bắt buộc và phải là duy nhất"),
  address: Yup.string()
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .required("Địa chỉ là bắt buộc và phải là duy nhất"),
  province: Yup.string().required("Tỉnh là bắt buộc, vui lòng chọn một tỉnh"),
});

const AddRoutePopup = ({ open, handleClose, fetchListRoute }) => {
  const [dataProvinceCity, setDataProvinceCity] = useState([]);
  console.log("asdasd", dataProvinceCity);
  useEffect(() => {
    const fetchListProvinceCity = async () => {
      try {
        const response = await listProvinceCityApi.getAll({});
        console.log("dataTBL", response);
        setDataProvinceCity(response.data);
      } catch (error) {
        console.log("err", error);
        setDataProvinceCity([]);
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
      <DialogTitle
        id="form-dialog-title"
        textAlign="center"
        sx={{
          textTransform: "uppercase",
          color: "#575656",
          backgroundImage:
            "linear-gradient(to bottom, #9b9bff, #a1a1f7, #a7a7ee, #acace5, #b2b2dc)",
        }}
      >
        Tạo Tuyến Đường
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{
            codeDeparturePoint: "",
            codeDestination: "",
            region: "",
            idAdmin: 1,
          }}
          // validationSchema={RouteSchema}
          onSubmit={async (values) => {
            try {
              const routePost = {
                ...values,
              };
              const response = await listRouteApi.createNewRoute(routePost);
              console.log("mmal", response);
              fetchListRoute();
              toast.success(response?.message);
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
                  <Field name="codeDeparturePoint">
                    {({ field, form, meta }) => (
                      <Autocomplete
                        // {...field}
                        isOptionEqualToValue={(option, value) =>
                          option === value
                        }
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
                <Grid item xs={12} md={12}>
                  <Field name="codeDestination">
                    {({ field, form, meta }) => (
                      <Autocomplete
                        // {...field}
                        // isOptionEqualToValue={(option, value) =>
                        //     option === value
                        // }
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
                  <Field name="region">
                    {({ field, form, meta }) => (
                      <FormControl fullWidth>
                        <InputLabel htmlFor="area-select">Khu vực</InputLabel>
                        <Select
                          {...field}
                          label="Khu vực"
                          fullWidth
                          error={meta.touched && !!meta.error}
                        >
                          <MenuItem value="Hỗn hợp">Liên Vùng</MenuItem>
                          <MenuItem value="Bắc">Bắc</MenuItem>
                          <MenuItem value="Trung">Trung</MenuItem>
                          <MenuItem value="Nam">Nam</MenuItem>
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
                  Tạo Tuyến
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoutePopup;
