import axiosClient from "./axiosCustomize";
const listStationApi = {
  getAll: (params) => {
    const url = "/stations";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  createNewStation: (payload) => {
    const url = "/stations";
    return axiosClient.post(url, payload);
  },
  deleteStaion: (payload) => {
    const url = `/stations?id=${payload}`;
    return axiosClient.delete(url);
  },
  updateStaion: (payload) => {
    const url = "/stations";
    return axiosClient.put(url, payload);
  },
  stationDetail: (params) => {
    const url = "/stations/detail";
    return axiosClient.get(url, { params });
  },
};
export default listStationApi;
