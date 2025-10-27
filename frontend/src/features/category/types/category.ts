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
 * @property {number} id - 카테고리 내부 ID (다른 API에서 사용)
 * @property {string} publicId - 카테고리 공개 ID (외부 노출용 UUID)
 * @property {string} categoryTitle - 카테고리 제목
 * @property {string} createdAt - 생성일시
 * @property {string} updatedAt - 수정일시
 */
export interface CategoryResponse {
  id: number;
  publicId: string;
  categoryTitle: string;
  createdAt: string;
  updatedAt: string;
}
