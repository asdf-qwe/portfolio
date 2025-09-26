import { TagRequest, TagResponse } from "../types/tag";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * 태그 관련 API 서비스
 */
export class TagService {
  /**
   * 새 태그 생성
   * @param tagData 생성할 태그 데이터
   * @param categoryId 카테고리 ID
   * @returns Promise<TagResponse>
   */
  async createTag(
    tagData: TagRequest,
    categoryId: number
  ): Promise<TagResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/tag?categoryId=${categoryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(tagData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `태그 생성 실패: ${response.status} ${response.statusText}`
        );
      }

      const result: TagResponse = await response.json();
      return result;
    } catch (error) {
      console.error("태그 생성 중 오류 발생:", error);
      throw error;
    }
  }

  /**
   * 카테고리별 태그 목록 조회
   * @param categoryId 카테고리 ID
   * @returns Promise<TagResponse[]>
   */
  async getTags(categoryId: number): Promise<TagResponse[]> {
    try {
      console.log(`태그 목록 조회 시작 - categoryId: ${categoryId}`);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/tag?categoryId=${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
        }
      );

      console.log(`응답 상태: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(
          `태그 목록 조회 실패: ${response.status} ${response.statusText}`
        );
      }

      const tags: TagResponse[] = await response.json();
      console.log(`태그 목록 조회 성공: ${tags.length}개 태그 발견`);
      return tags;
    } catch (error) {
      console.error("태그 목록 조회 중 오류 발생:", error);
      throw error;
    }
  }

  /**
   * 태그 수정
   * @param tagData 수정할 태그 데이터
   * @param tagId 태그 ID
   * @returns Promise<string>
   */
  async updateTag(tagData: TagRequest, tagId: number): Promise<string> {
    try {
      console.log(`태그 수정 시작 - tagId: ${tagId}`);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/tag?tagId=${tagId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(tagData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `태그 수정 실패: ${response.status} ${response.statusText}`
        );
      }

      console.log(`태그 수정 성공 - tagId: ${tagId}`);
      return await response.text();
    } catch (error) {
      console.error(`태그 수정 실패 - tagId: ${tagId}`, error);
      throw error;
    }
  }

  /**
   * 태그 삭제
   * @param tagId 삭제할 태그 ID
   * @returns Promise<string>
   */
  async deleteTag(tagId: number): Promise<string> {
    try {
      console.log(`태그 삭제 시작 - tagId: ${tagId}`);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/tag?tagId=${tagId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          `태그 삭제 실패: ${response.status} ${response.statusText}`
        );
      }

      console.log(`태그 삭제 성공 - tagId: ${tagId}`);
      return await response.text();
    } catch (error) {
      console.error(`태그 삭제 실패 - tagId: ${tagId}`, error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const tagService = new TagService();

// 편의를 위한 기본 export
export default tagService;
