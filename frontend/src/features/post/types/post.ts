// Java의 CreatePostDto(@Getter, @Setter 포함)를 TypeScript 타입으로 매핑
export interface CreatePostDto {
  content: string;
  imageUrl: string;
}

export interface PostListDto {
  title: string;
  view: number;
}

export interface PostResponse {
  content: string;
  imageUrl: string;
}

export interface BasicTabDto {
  basicTab1: string;
  basicTab2: string;
  basicContent1: string;
  basicContent2: string;
  userId: number;
}

export interface BasicTabUpdateReq {
  basicContent1: string;
}
