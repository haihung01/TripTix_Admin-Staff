import axiosClient from "./axiosCustomize";
const listTripApi = {
  getTripAccept: (params) => {
    const url = `/trips?adminCheck=${"ACCEPT"}`;
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getTripRunning: (params) => {
    const url = `/trips?adminCheck=${"ACCEPT"}&status=${"RUN"}`;
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  getTripFinish: (params) => {
    const url = `/trips?adminCheck=${"ACCEPT"}&status=${"FINISH"}`;
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  getTripReady: (params) => {
    const url = `/trips?adminCheck=${"ACCEPT"}&status=${"READY"}`;
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getTripCancel: (params) => {
    const url = `/trips?adminCheck=${"ACCEPT"}&status=${"CANCEL"}`;
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },



  getTripPendingByAdmin: (params) => {
    const url = `/trips?adminCheck=${"PENDING"}`;
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getTripCancelByAdmin: (params) => {
    const url = `/trips?adminCheck=${"CANCEL"}`;
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getAll: (params) => {
    const url = `/trips=${params}`;
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getTripByStaffIdAndAdminCheckPending: (params) => {
    const { staffId } = params;
    const adminCheck = "PENDING";

    const url = `/trips/history-staff?staffId=${staffId}&adminCheck=${adminCheck}`;
    return axiosClient.get(url);
  },

  getTripByAdminCheckAccept: (params) => {
    const url = `/trips?adminCheck=${"ACCEPT"}`;
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getTripByStaffId: (params) => {
    console.log("ssa", params);
    const url = "/trips/history-staff";
    return axiosClient.get(url, { params });
  },
  getTripByDriverId: (params) => {
    console.log("driver", params);
    const url = "/trips/history-driver";
    return axiosClient.get(url, { params });
  },
  createTripByStaff: (payload) => {
    const url = "/trips";
    return axiosClient.post(url, payload);
  },
  checkTripByAdmin: (payload) => {
    const url = "/trips/accept-trip-by-admin";
    return axiosClient.put(url, payload);
  },
  cancelTrip: (payload) => {
    const url = `/trips/cancel-trip?idTrip=${payload}`;
    return axiosClient.put(url);
  },
  updateTrip: (payload) => {
    const url = "/trips";
    return axiosClient.put(url, payload);
  },
  tripDetail: (params) => {
    const url = "/trips/detail";
    return axiosClient.get(url, { params });
  },
  saveTemplateTrip: (payload) => {
    const url = "/form-create";
    return axiosClient.post(url, payload);
  },
};
export default listTripApi;
