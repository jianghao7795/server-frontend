import { http } from "@/utils/request";

export const getTagList = (params?: API.SearchTag) => {
  return http.get<GlobalTypes.Response<{ list: API.Tag[]; total: number }>>("/getTagList", {
    method: "get",
    params: params,
  });
};
