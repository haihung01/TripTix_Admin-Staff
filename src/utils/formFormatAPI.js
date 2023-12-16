import axiosClient from "./axiosCustomize";
const formatFormApi = {
  formatCreateForm: (params) => {
    const url = "/form-create/detail";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
};
export default formatFormApi;
