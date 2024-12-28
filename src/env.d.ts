declare namespace Global {
  export type Response<T> = {
    code: 200 | 400 | 401 | 403 | 404 | 500;
    data: T;
    msg: string;
  };

  export type ResponseAbout<T> = {
    code: 200 | 400 | 401 | 403 | 404 | 500;
    data?: T;
    msg: string;
  };
}
