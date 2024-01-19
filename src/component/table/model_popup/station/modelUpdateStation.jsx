import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Grid,
  DialogActions,
  Autocomplete,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import listProvinceCityApi from "../../../../utils/listProvinceAPI";
import listStationApi from "../../../../utils/listStationAPI";

const StationSchema = yup.object().shape({
  name: yup
    .string()
    .min(5, "Tên trạm phải có ít nhất 5 ký tự")
    .max(30, "Tên trạm có thể dài tối đa 30 ký tự")
    .required("Tên trạm là bắt buộc !"),
  address: yup
    .string()
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .required("Địa chỉ là bắt buộc và phải là duy nhất !"),
  province: yup.string().required("Tỉnh là bắt buộc, vui lòng chọn một tỉnh !"),
  status: yup.string().required(),
});

const ModelUpdateStation = ({
  open,
  handleClose,
  stationData,
  fetchListStation,
}) => {
  //PROVINCECITY DATA
  const [dataProvinceCity, setDataProvinceCity] = useState([]);

  useEffect(() => {
    const fetchListProvinceCity = async () => {
      try {
        const response = await listProvinceCityApi.getAll({});
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
        Cập Nhật Trạm Xe
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{
            idStation: stationData?.idStation,
            name: stationData?.name,
            address: stationData?.address,
            province: stationData?.province,
            status: stationData?.status,
          }}
          validationSchema={StationSchema}
          onSubmit={async (values) => {
            try {
              const stationPut = {
                ...values,
              };
              const response = await listStationApi.updateStaion(stationPut);
              console.log("mmal", response);
              fetchListStation();
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
                  <Field name="idStation">
                    {({ field }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="ID Station"
                        type="text"
                        fullWidth
                        inputProps={{ readOnly: true }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} md={12}>
                  {" "}
                  <Field name="name">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Tên Trạm"
                        placeholder="VD: Trạm xe Đà Lạt, Trạm xe Vũng Tàu,..."
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
                  <Field name="address">
                    {({ field, meta }) => (
                      <TextField
                        {...field}
                        margin="dense"
                        label="Địa Chỉ"
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
                  <Field name="province">
                    {({ field, form, meta }) => (
                      <Autocomplete
                        {...field}
                        options={dataProvinceCity}
                        getOptionLabel={(option) =>
                          `${option.name} - (${option?.type})`
                        }
                        value={
                          dataProvinceCity.find(
                            (option) => option.name === values.province
                          ) || null
                        }
                        onChange={(_, newValue) =>
                          form.setFieldValue(
                            "province",
                            newValue ? newValue.name : null
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            {...field}
                            label="Tỉnh Thành"
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
                  <Field name="status">
                    {({ field, meta }) => (
                      <FormControl fullWidth margin="dense">
                        <InputLabel>Trang Thái</InputLabel>
                        <Select
                          {...field}
                          label="Trạng Thái"
                          error={meta.touched && !!meta.error}
                        >
                          <MenuItem value="ACTIVE">Đang Hoạt Động</MenuItem>
                          <MenuItem value="DEACTIVE">Không Hoạt Động</MenuItem>
                        </Select>
                        {meta.touched && meta.error && (
                          <div style={{ color: "red" }}>{meta.error}</div>
                        )}
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

export default ModelUpdateStation;
