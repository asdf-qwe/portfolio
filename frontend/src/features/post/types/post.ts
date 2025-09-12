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
  title: string;
  content: string;
  imageUrl: string;
  view: number;
}
