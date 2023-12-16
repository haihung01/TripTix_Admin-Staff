import axiosClient from "./axiosCustomize";
const listProvinceCityApi = {
  getAll: (params) => {
    const url = "/province-city";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
};
export default listProvinceCityApi;
