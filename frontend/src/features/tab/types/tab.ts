import { CategoryResponse } from "@/features/category/types/category";

/**
 * 포스트 응답 DTO - 포스트 관련 타입
 * tab에서 사용되는 최소한의 Post 정보
 */
export interface PostResponse {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 탭 생성 요청 DTO - 백엔드의 CreateTabReq 클래스와 매핑됨
 *
 * @interface CreateTabReq
 * @property {string} tabName - 탭 이름
 */
export interface CreateTabReq {
  tabName: string;
}

/**
 * 탭 응답 DTO - 백엔드의 TabRes 클래스와 매핑됨
 *
 * @interface TabRes
 * @property {number} id - 탭 ID
 * @property {string} tabName - 탭 이름
 * @property {CategoryResponse} category - 연관된 카테고리
 * @property {PostResponse[]} post - 연관된 포스트 목록
 */
export interface TabRes {
  id: number;
  tabName: string;
  category: CategoryResponse;
  post: PostResponse[];
}
