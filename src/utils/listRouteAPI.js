import axiosClient from "./axiosCustomize";
const listRouteApi = {
  getAll: (params) => {
    const url = "/route";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  //   getTripByStaffId: (params) => {
  //     console.log("ssa", params);
  //     const url = "/stations/history-staff";
  //     return axiosClient.get(url, { params });
  //   },

  createNewRoute: (payload) => {
    const url = "/route";
    return axiosClient.post(url, payload);
  },
  deleteRoute: (payload) => {
    const url = `/route?id=${payload}`;
    return axiosClient.delete(url);
  },
  updateRoute: (payload) => {
    const url = "/route";
    return axiosClient.put(url, payload);
  },
  routeDetail: (params) => {
    const url = "/route/detail";
    return axiosClient.get(url, { params });
  },
};
export default listRouteApi;
