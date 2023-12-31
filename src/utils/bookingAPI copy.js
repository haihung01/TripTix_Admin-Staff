import axiosClient from "./axiosCustomize";
const bookingApi = {
  getDataBookingOfCustomer: (params) => {
    const url = "/bookings";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getQuarterRevenue: (params) => {
    const url = "/bookings/revenue-chart-quy";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getDataMonthRevenue: (params) => {
    const url = "/bookings/revenue-chart-month";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getDailyRevenue: (params) => {
    const url = "/bookings/revenue-today";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getDataPotentialCustomer: (params) => {
    const url = "/bookings/top-10-list-of-potential-customers";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getDataBookingDetail: (params) => {
    const url = "/bookings/detail";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  changeTicketForCustomer: (payload) => {
    const url = "/bookings/change-seat-of-ticket-by-customer";
    return axiosClient.put(url, payload);
  },
};
export default bookingApi;
