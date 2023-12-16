import axios from "axios";
import { toast } from "react-toastify";

const axiosClient = axios.create({
  // baseURL: "http://btbs.ap-southeast-1.elasticbeanstalk.com",
  baseURL: "https://triptix2.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  async (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      // try {
      //   const newData = await axios.request({
      //     method: "POST",
      //     url: "http://btbs.ap-southeast-1.elasticbeanstalk.com",
      //     data: {
      //       accessToken: localStorage.getItem("access_token"),
      //       refreshToken: localStorage.getItem("refresh_token")
      //     },
      //   });
      //   console.log("regenerated token: ", newData);
      //   // Lưu newAccessToken vào Local Storage hoặc trình quản lý trạng thái
      //   localStorage.setItem("access_token", newData.data.accessToken);
      //   localStorage.setItem("refresh_token", newData.data.refreshToken);
      //   // Thực hiện lại yêu cầu gốc với access token đã làm mới
      //   error.config.headers.Authorization = `Bearer ${newData.data.accessToken}`;
      //   const response = await axios.request(error.config);
      //   return response;
      // } catch (refreshError) {
      //   // Xử lý lỗi khi làm mới access token
      //     localStorage.clear()
      //     localStorage.removeItem("access_token")
      //     localStorage.removeItem("refresh_token")
      //     localStorage.removeItem("isLogin")
      //     window.location.href = "/";
      //   return Promise.reject(refreshError);
      // }
      localStorage.clear();
      toast.warning("access token expires !");
      window.location.href = "/login-page";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
