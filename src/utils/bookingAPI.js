import axiosClient from "./axiosCustomize";
const bookingApi = {
  getDataBookingOfCustomer: (params) => {
    const url = "/ticket";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getQuarterRevenue: (params) => {
    const url = "/ticket/revenue-chart-quy";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getDataMonthRevenue: (params) => {
    const url = "/ticket/revenue-chart-month";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getDailyRevenue: (params) => {
    const url = "/ticket/revenue-today";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getDataPotentialCustomer: (params) => {
    const url = "/ticket/top-10-list-of-potential-customers";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getDataBookingDetail: (params) => {
    const url = "/ticket/detail";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  changeTicketForCustomer: (payload) => {
    const url = "/ticket/change-seat-of-ticket-by-customer";
    return axiosClient.put(url, payload);
  },
};
export default bookingApi;
