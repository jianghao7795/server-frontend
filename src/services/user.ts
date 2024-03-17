import { http } from "@/utils/request";

export function login(data: User.Login) {
  return http.post<Global.Response<User.CurrentUser>, User.Login>("/login", data);
}

export function getCurrentUser() {
  return http.get<Global.Response<User.UserInfo>>("/getCurrentUser");
}

export function updateBackgroundImage(data: User.UpdateImages) {
  return http.put<Global.Response<string>>("/updateBackgroundImage", data);
}

export function registerUser(data: User.Register) {
  return http.post<Global.Response<User.CurrentUser>>("/register", data);
}

//重置密码
export function resetPassword(data: User.ResetPassword) {
  return http.put<Global.Response<{}>>("/resetPassword", data);
}
// 更新客户
export function updateUser(data: User.UserInfo) {
  return http.put<Global.Response<{ error?: string }>>("/updateUser", data);
}
