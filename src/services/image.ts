import { http } from "@/utils/request";

export function getImages() {
  return http.get<Global.Response<User.Images[]>>("/getImages");
}
