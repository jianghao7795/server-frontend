import { http } from "@/utils/request";

export const getArticleComment = (id: number) => {
  // return request({
  //   url: "/frontend/getArticleList",
  //   method: "get",
  // });
  return http.get<Global.Response<Comment.comment[]>>(`/getArticleComment/${id}`);
};

export const createdComment = (data: Comment.createcomment) => {
  return http.post<Global.Response<{ id: number }>>(`/createdComment`, data);
};
