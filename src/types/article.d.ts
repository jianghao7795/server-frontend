declare namespace API {
  export type Article = {
    ID: number;
    UpdatedAt: string;
    CreatedAt: string;
    content: string;
    desc: string;
    state: 1 | 0;
    user: ArticleUser;
    tags: Tag[];
    title: string;
    user_id: number;
    reading_quantity: number;
    is_important: 1 | 0;
  };

  export type ArticleUser = {
    userName: string;
    nickName: string;
    headerImg: string;
  };

  // export type initArticle = Partial<Article>;

  export type CreateArticleUser = Omit<ArticleUser, "userName" | "nickName" | "headerImg"> &
    Pick<ArticleUser, "userName" | "nickName" | "headerImg">; // 采集

  export type SearchArticle = Partial<Article> & {
    page?: number;
    pageSize?: number;
    name?: string;
    value?: string;
    sort?: string;
  }; // Partial 类型可选
  export type CreateArticle = Omit<Article, "UpdatedAt" | "CreatedAt" | "ID" | "user">; // Omit 舍去属性
  export type UpdateArticle = Omit<Article, "UpdatedAt" | "CreatedAt" | "user">; //

  export interface User {
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
    authorityId: string;
    phone: string;
    email: string;
  }

  export type Tag = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    name: string;
    status: 1;
    aritcles?: Article[];
  };

  // export type SearchArticle = {
  //   page?: number;
  //   pageSize?: number;
  //   title?: string;
  //   is_important?: number;
  //   name?: "tag" | "article";
  //   value?: string;
  //   sort?: string;
  // };

  export type SearchTag = {
    name?: string;
  };

  export type AboutMe = {
    aboutMe: string;
  };

  export interface ScrollBehavior extends Event {
    scrollTop: number;
  }
}
