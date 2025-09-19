import {
  SkillCategoryRequest,
  SkillCategoryResponse,
} from "../type/skillCategory";

class SkillCategoryService {
  private readonly baseUrl = `${
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  }`;

  /**
   * 스킬 카테고리 변경
   * @param req - 변경할 카테고리 정보
   * @param userId - 사용자 ID
   * @returns 성공 메시지
   */
  async changeCategory(
    req: SkillCategoryRequest,
    userId: number
  ): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/skill?userId=${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(req),
        }
      );

      if (!response.ok) {
        throw new Error(
          `스킬 카테고리 변경 실패: ${response.status} ${response.statusText}`
        );
      }

      const text = await response.text();
      return text || "성공";
    } catch (error) {
      console.error("스킬 카테고리 변경 실패:", error);
      throw error;
    }
  }

  /**
   * 스킬 카테고리 조회
   * @param userId - 사용자 ID
   * @returns 스킬 카테고리 정보
   */
  async getSkillCategory(userId: number): Promise<SkillCategoryResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/skill?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
        }
      );

      if (!response.ok) {
        throw new Error(
          `스킬 카테고리 조회 실패: ${response.status} ${response.statusText}`
        );
      }

      const data: SkillCategoryResponse = await response.json();
      return data;
    } catch (error) {
      console.error("스킬 카테고리 조회 실패:", error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 export
export const skillCategoryService = new SkillCategoryService();
