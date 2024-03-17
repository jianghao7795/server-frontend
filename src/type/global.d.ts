declare namespace Global {
  export type Response<T> = {
    code: 7 | 0;
    data: T;
    msg: string;
  };

  export type ResponseAbout<T> = {
    code: 0 | 7;
    data?: T;
    msg: string;
  };
}
