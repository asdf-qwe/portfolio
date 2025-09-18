import { CategoryRequest, CategoryResponse } from "../types/category";

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // 프로덕션에서는 프록시 라우트 사용
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api");

/**
 * 카테고리 관련 API 서비스
 */
export class CategoryService {
  /**
   * 새 카테고리 생성
   * @param categoryData 생성할 카테고리 데이터
   * @param userId 사용자 ID
   * @returns Promise<CategoryResponse>
   */
  async createCategory(
    categoryData: CategoryRequest,
    userId: number
  ): Promise<CategoryResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/category?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키 포함 (인증이 필요한 경우)
          body: JSON.stringify(categoryData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `카테고리 생성 실패: ${response.status} ${response.statusText}`
        );
      }

      const result: CategoryResponse = await response.json();
      return result;
    } catch (error) {
      console.error("카테고리 생성 중 오류 발생:", error);
      throw error;
    }
  }

  /**
   * 사용자별 카테고리 목록 조회
   * @param userId 사용자 ID
   * @returns Promise<CategoryResponse[]>
   */
  async getCategories(userId: number): Promise<CategoryResponse[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/category?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit", // 쿠키 사용하지 않음
        }
      );

      if (!response.ok) {
        throw new Error(
          `카테고리 목록 조회 실패: ${response.status} ${response.statusText}`
        );
      }

      const categories: CategoryResponse[] = await response.json();
      return categories;
    } catch (error) {
      console.error("카테고리 목록 조회 중 오류 발생:", error);
      throw error;
    }
  }

  /**
   * 특정 카테고리 조회 (ID로)
   * @param categoryId 카테고리 ID
   * @returns Promise<CategoryResponse>
   */
  async getCategoryById(categoryId: number): Promise<CategoryResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/category/${categoryId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(
          `카테고리 조회 실패: ${response.status} ${response.statusText}`
        );
      }

      const category: CategoryResponse = await response.json();
      return category;
    } catch (error) {
      console.error("카테고리 조회 중 오류 발생:", error);
      throw error;
    }
  }

  /**
   * 카테고리 수정
   * @param categoryId 수정할 카테고리 ID
   * @param categoryData 수정할 데이터
   * @returns Promise<CategoryResponse>
   */
  async updateCategory(
    categoryId: number,
    categoryData: CategoryRequest
  ): Promise<CategoryResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/category/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error(
          `카테고리 수정 실패: ${response.status} ${response.statusText}`
        );
      }

      const result: CategoryResponse = await response.json();
      return result;
    } catch (error) {
      console.error("카테고리 수정 중 오류 발생:", error);
      throw error;
    }
  }

  /**
   * 카테고리 삭제
   * @param categoryId 삭제할 카테고리 ID
   * @returns Promise<string>
   */
  async deleteCategory(categoryId: number): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/category?categoryId=${categoryId}`,
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
          `카테고리 삭제 실패: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.text();
      return result;
    } catch (error) {
      console.error("카테고리 삭제 중 오류 발생:", error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const categoryService = new CategoryService();

// 편의를 위한 기본 export
export default categoryService;
