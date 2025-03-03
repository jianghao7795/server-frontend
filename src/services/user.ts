import { http } from "@/utils/request";

export function login(data: User.Login) {
  return http.post<GlobalTypes.Response<User.CurrentUser>, User.Login>("/login", data);
}

export function getCurrentUser() {
  return http.get<GlobalTypes.Response<User.UserInfo>>("/getCurrentUser");
}

export function updateBackgroundImage(data: User.UpdateImages) {
  return http.put<GlobalTypes.Response<string>>("/updateBackgroundImage", data);
}

export function registerUser(data: User.Register) {
  return http.post<GlobalTypes.Response<User.CurrentUser>>("/register", data);
}

//重置密码
export function resetPassword(data: User.ResetPassword) {
  return http.put<GlobalTypes.Response<{}>>("/resetPassword", data);
}
// 更新客户
export function updateUser(data: User.UserInfo) {
  return http.put<GlobalTypes.Response<{ error?: string }>>("/updateUser", data);
}
