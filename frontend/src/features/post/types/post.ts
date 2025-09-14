// Java의 CreatePostDto(@Getter, @Setter 포함)를 TypeScript 타입으로 매핑
export interface CreatePostDto {
  title: string;
  content: string;
  imageUrl: string;
}

export interface PostListDto {
  title: string;
  view: number;
}

export interface PostResponse {
  id?: number;
  title: string;
  content: string;
  imageUrl: string;
  view: number;
  createdAt?: string;
  updatedAt?: string;
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
