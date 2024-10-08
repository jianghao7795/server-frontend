import { defineStore } from "pinia";
import { login, getCurrentUser, registerUser } from "@/services/user";

export const useUserStore = defineStore("user", {
  state: (): {
    currentUser: User.CurrentUser;
    loading: boolean;
    loadingRegister: boolean;
  } => ({
    currentUser: <User.CurrentUser>{},
    loading: false,
    loadingRegister: false,
  }),
  getters: {
    getToken: (state) => state.currentUser.token,
  },
  actions: {
    updateUserInfo(data: User.UserInfo) {
      this.currentUser.user = data;
    },
    async register(data: User.Register, callback: () => void) {
      this.loadingRegister = true;
      try {
        const resp = await registerUser(data);
        this.loadingRegister = false;
        if (resp.code === 200) {
          callback();
        } else {
          window.$message.error("注册失败, 请重试");
        }
      } catch (e) {
        this.loadingRegister = false;
        window.$message.error("注册失败, 请重试");
      }
    },
    async logins(data: User.Login, callback: () => void) {
      this.loading = true;
      try {
        const info = await login(data);
        this.loading = false;
        this.currentUser = info.data;
        callback();
        localStorage.setItem("token", info.data.token);
        window.$message.success("登陆成功");
      } catch (e) {
        this.loading = false;
        window.$message.error("登录失败");
      }
    },
    async getUser(callback: (imageUrl: string) => void) {
      const token = localStorage.getItem("token");
      if (!this.currentUser.token && token) {
        this.currentUser.token = token;
      } else {
        return;
      }
      try {
        this.loading = true;
        const info = await getCurrentUser();
        this.loading = false;
        this.currentUser.user = info.data;
        this.currentUser.exportAt = 0;
        callback(info.data.head_img);
      } catch (e) {
        localStorage.removeItem("token");
        this.loading = false;
        window.$message.error("个人信息获取失败，请重新登录");
      }
    },
  },
});
