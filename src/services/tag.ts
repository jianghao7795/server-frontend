import { http } from "@/utils/request";

export const getTagList = (params?: API.SearchTag) => {
  return http.get<Global.Response<{ list: API.Tag[]; total: number }>>(
    "/getTagList",
    {
      method: "get",
      params: params,
    }
  );
};
