/**
 * 카테고리 요청 DTO - 백엔드의 CategoryRequest 클래스와 매핑됨
 *
 * @interface CategoryRequest
 * @property {string} categoryTitle - 카테고리 제목
 */
export interface CategoryRequest {
  categoryTitle: string;
}

/**
 * 카테고리 응답 DTO - 백엔드의 CategoryResponse 클래스와 매핑됨
 *
 * @interface CategoryResponse
 * @property {number} id - 카테고리 ID (백엔드에서 추가 권장)
 * @property {string} categoryTitle - 카테고리 제목
 * @property {string} createdAt - 생성일시 (백엔드에서 추가 권장)
 * @property {string} updatedAt - 수정일시 (백엔드에서 추가 권장)
 */
export interface CategoryResponse {
  id: number;
  categoryTitle: string;
  createdAt: string;
  updatedAt: string;
}
