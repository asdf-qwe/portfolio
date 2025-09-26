// 태그 관련 타입 정의

/**
 * 태그 응답 타입
 * 백엔드 TagResponse 클래스와 매핑
 */
export interface TagResponse {
  tagId: number;
  tagName: string;
}

/**
 * 태그 요청 타입
 * 백엔드 TagRequest 클래스와 매핑
 */
export interface TagRequest {
  tagName: string;
}
