import axiosClient from "./axiosCustomize";
const listUserApi = {
  getAll: (params) => {
    const url = "/usersystem";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  updateStaff: (payload) => {
    const url = "/usersystem/assign-staff";
    return axiosClient.put(url, payload);
  },
  getUserById: (params) => {
    console.log("ssa", params);
    const url = "/usersystem/detail";
    return axiosClient.get(url, { params });
  },
  createNewUser: (payload) => {
    const url = "/usersystem/register-2";
    return axiosClient.post(url, payload);
  },
  banUser: (payload) => {
    const url = `/usersystem/de-active-account?idUser=${payload}`;
    return axiosClient.put(url);
  },
  unbanUser: (payload) => {
    const url = `/usersystem/active-account?idUser=${payload}`;
    return axiosClient.put(url);
  },
  changePassword: (payload) => {
    const url = "/usersystem/change-password";
    return axiosClient.put(url, payload);
  },
  changeProfile: (payload) => {
    const url = "/usersystem/update-2";
    return axiosClient.put(url, payload);
  },
};
export default listUserApi;
