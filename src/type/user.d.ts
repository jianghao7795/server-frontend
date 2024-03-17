declare namespace User {
  export type UserInfo = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    uuid: string;
    userName: string;
    nickName: string;
    sideMode: string;
    headerImg: string;
    baseColor: string;
    activeColor: string;
    phone: string;
    email: string;
    head_img: string;
    introduction: string;
    content: string;
  };

  export type Login = {
    username: string;
    password: string;
  };

  export type Images = {
    url: string;
    name: string;
    ID: number;
  };

  export type UpdateImages = {
    head_img: string;
    ID: number;
  };

  export type CurrentUser = {
    user: User.UserInfo;
    token: string;
    exportAt: number;
  };

  export type Register = {
    name: string;
    password: string;
    content: string;
    introduction: string;
    re_password: string;
    header: string;
  };

  export type ResetPassword = {
    id: number;
    password: string;
    new_password: string;
    repeat_new_password: string;
  };
}
