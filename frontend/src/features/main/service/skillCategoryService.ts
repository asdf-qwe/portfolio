import { api } from "@/lib/api";
import {
  SkillCategoryRequest,
  SkillCategoryResponse,
} from "../type/skillCategory";

class SkillCategoryService {
  private readonly baseUrl = "/api/skill";

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
      const response = await api.put(`${this.baseUrl}?userId=${userId}`, req);
      return (response as { data: string }).data || "성공";
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
      const response = await api.get(`${this.baseUrl}?userId=${userId}`);
      return (response as { data: SkillCategoryResponse }).data;
    } catch (error) {
      console.error("스킬 카테고리 조회 실패:", error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 export
export const skillCategoryService = new SkillCategoryService();
