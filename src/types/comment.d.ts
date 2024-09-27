declare namespace Comment {
  export interface comment {
    ID: number;
    createdAt: string;
    updatedAt: string;
    articleId: number;
    article: API.Article;
    parentId: number;
    content: string;
    user_id: number;
    user: User.UserInfo;
    to_user: User.UserInfo;
    to_user_id: number;
    children: comment[];
  }
}
