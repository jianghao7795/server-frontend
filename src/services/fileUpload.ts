import { http } from "@/utils/request";

export const uploadFile = (data: FormData) => {
  return http.post<GlobalTypes.ResponseAbout<UploadFile.Upload>, FormData>("/upload", data);
};
