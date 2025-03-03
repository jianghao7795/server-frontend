import { http } from "@/utils/request";

export function getImages() {
  return http.get<GlobalTypes.Response<User.Images[]>>("/getImages");
}
