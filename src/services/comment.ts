import { http } from "@/utils/request";

export const getArticleComment = (id: number) => {
  // return request({
  //   url: "/frontend/getArticleList",
  //   method: "get",
  // });
  return http.get<GlobalTypes.Response<{ data: Comment.comment[] }>>(`/getArticleComment/${id}`);
};

export const createdComment = (data: Comment.createcomment) => {
  return http.post<GlobalTypes.Response<{ id: number }>>(`/createdComment`, data);
};

export const likeComment = (id: number) => {
  return http.post<GlobalTypes.Response<{ data: Comment.Praise }>>(`/comment/${id}/like`);
};

export const unlikeComment = (id: number) => {
  return http.delete<GlobalTypes.Response<null>>(`/comment/${id}/like`);
};

export const checkCommentLiked = (id: number) => {
  return http.get<GlobalTypes.Response<{ liked: boolean; praise: Comment.Praise | null }>>(`/comment/${id}/like`);
};
