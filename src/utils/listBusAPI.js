import axiosClient from "./axiosCustomize";
const listBusesApi = {
  getAll: (params) => {
    const url = "/vehicles";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  createNewBuses: (payload) => {
    const url = "/vehicles";
    return axiosClient.post(url, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteBus: (payload) => {
    const url = `/vehicles?id=${payload}`;
    return axiosClient.delete(url);
  },
  updateBus: (payload) => {
    const url = "/vehicles";
    return axiosClient.put(url, payload);
  },
};
export default listBusesApi;
