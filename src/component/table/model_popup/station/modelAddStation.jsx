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
} from "@mui/material";
import { Grid } from "@mui/material";
import listStationApi from "../../../../utils/listStationAPI";
import { toast } from "react-toastify";
import listProvinceCityApi from "../../../../utils/listProvinceAPI";

const StationSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, "Tên trạm phải có ít nhất 5 ký tự")
    .max(30, "Tên trạm có thể dài tối đa 30 ký tự")
    .required("Tên trạm là bắt buộc và phải là duy nhất"),
  address: Yup.string()
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .required("Địa chỉ là bắt buộc và phải là duy nhất"),
  province: Yup.string().required("Tỉnh là bắt buộc, vui lòng chọn một tỉnh"),
});

const AddStationPopup = ({ open, handleClose, fetchListStation }) => {
  const [dataProvinceCity, setDataProvinceCity] = useState([]);

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
        Tạo Trạm Xe
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Formik
          initialValues={{ name: "", address: "", province: "" }}
          validationSchema={StationSchema}
          onSubmit={async (values) => {
            try {
              const stationPost = {
                ...values,
              };
              const response = await listStationApi.createNewStation(
                stationPost
              );
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
                            "province",
                            newValue ? newValue.name : ""
                          );
                        }}
                        onBlur={form.handleBlur}
                        renderInput={(params) => (
                          <TextField
                            {...field}
                            {...params}
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
                  Tạo Trạm
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddStationPopup;
