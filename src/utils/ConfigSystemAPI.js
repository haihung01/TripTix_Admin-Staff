import axiosClient from "./axiosCustomize";
const configSystemApi = {
  getAll: (params) => {
    const url = "/config-system";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  createService: (payload) => {
    const url = "/config-system";
    return axiosClient.post(url, payload);
  },
  deleteService: (payload) => {
    const url = `/config-system?id=${payload}`;
    return axiosClient.delete(url);
  },
  updateService: (payload) => {
    const url = `/config-system`;
    return axiosClient.put(url, payload);
  },
};
export default configSystemApi;
