declare namespace UploadFile {
  export type Upload = {
    file: {
      ID: number;
      CreatedAt: string;
      UpdatedAt: string;
      name: string;
      url: string;
      tag: string;
      key: string;
    };
  };
}
