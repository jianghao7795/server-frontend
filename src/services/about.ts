// import type { API } from "@/type/article";
import { http } from "@/utils/request";

export const aboutMe = () => {
  return http.get<GlobalTypes.ResponseAbout<API.AboutMe>>("/health");
};
