declare namespace GlobalTypes {
  export type Response<T = any> = {
    code: 200 | 400 | 401 | 403 | 404 | 500;
    data: T;
    msg: string;
  };

  export type ResponseAbout<T = any> = {
    code: 200 | 400 | 401 | 403 | 404 | 500;
    data?: T;
    msg: string;
  };
}
