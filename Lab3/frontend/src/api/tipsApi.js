import api from "./axios";

export const tipsApi = {
  getTips: (category) =>
    api.get("/tips/", {
      params: category ? { category } : {},
    }),

  getCategories: () =>
    api.get("/tips/categories"),
};