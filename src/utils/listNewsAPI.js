import axiosClient from "./axiosCustomize";
const listNewsApi = {
  getAll: (params) => {
    const url = "/news";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  createNews: (payload) => {
    const url = "/news";
    return axiosClient.post(url, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteNews: (payload) => {
    const url = `/news?id=${payload}`;
    return axiosClient.delete(url);
  },
  updateNews: (payload) => {
    const url = `/news`;
    return axiosClient.put(url, payload);
  },
};
export default listNewsApi;
