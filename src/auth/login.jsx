import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loginApi from "../utils/loginAPI";
import "./login.css";
import useAuth from "../hook/useAuth";
import * as Yup from "yup";
import { useFormik } from "formik";

export default function SignIn() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const validationSchema = Yup.object({
    userName: Yup.string()
      .required("Tài khoản không được để trống !")
      .min(3, "Độ dài tài khoản phải tối thiểu 3 kí tự"),
    password: Yup.string()
      .required("Mật Khẩu không được để trống !")
      .min(6, "Độ dài mật khẩu phải tối thiểu 6 kí tự"),
  });

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await loginApi.login({
          username: values.userName,
          password: values.password,
        });
        localStorage.setItem("access_token", response.data.token);
        localStorage.setItem("userInfor", JSON.stringify(response.data.user));
        console.log("first", response.data.user);
        setAuth({ user: response.data.user, accessToken: response.data.token });
        navigate("/dash-board");
        toast.success(response.message);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
  });

  return (
    <Box
      className="login_container"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            p: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid grey",
            borderRadius: "10px",

            // boxShadow: "5px 10px 8px #888888",
            background: "#fffffa",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              backgroundImage:
                "linear-gradient(to bottom, #9b9bff, #a1a1f7, #a7a7ee, #acace5, #b2b2dc)",
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Đăng Nhập
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Tài Khoản"
              name="userName"
              autoComplete="userName"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.userName && Boolean(formik.errors.userName)}
              helperText={formik.touched.userName && formik.errors.userName}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật Khẩu"
              type="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Ghi nhớ tôi"
            />
            <br />

            <div className="display__button">
              <button
                className="button-type2"
                type="submit"
                onClick={formik.handleSubmit}
              >
                <span className="btn-txt2">Đăng Nhập</span>
              </button>
            </div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
