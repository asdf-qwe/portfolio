import { CreateTabReq, TabRes } from "../types/tab";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * 탭 관련 API 서비스
 */
export class TabService {
  /**
   * 새 탭 생성
   * @param tabData 생성할 탭 데이터
   * @param categoryId 카테고리 ID
   * @returns Promise<unknown> - 백엔드에서 Tab 엔티티를 반환
   */
  async createTab(tabData: CreateTabReq, categoryId: number): Promise<unknown> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/tab?categoryId=${categoryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키 포함 (인증이 필요한 경우)
          body: JSON.stringify(tabData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `탭 생성 실패: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("탭 생성 중 오류 발생:", error);
      throw error;
    }
  }

  /**
   * 카테고리별 탭 목록 조회
   * @param categoryId 카테고리 ID
   * @returns Promise<TabRes[]>
   */
  async getTabs(categoryId: number): Promise<TabRes[]> {
    try {
      console.log(`탭 목록 조회 시작 - categoryId: ${categoryId}`);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/tab/list?categoryId=${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit", // 쿠키 사용하지 않음
        }
      );

      console.log(`응답 상태: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        // 에러 응답 본문도 함께 로그
        const errorText = await response.text();
        console.error(
          `탭 목록 조회 실패 - Status: ${response.status}, Response:`,
          errorText
        );

        // 500 에러인 경우 빈 배열 반환 (서버 에러지만 클라이언트는 정상 동작)
        if (response.status === 500) {
          console.warn("서버 에러로 인해 빈 탭 목록을 반환합니다.");
          return [];
        }

        throw new Error(
          `탭 목록 조회 실패: ${response.status} ${response.statusText}`
        );
      }

      const tabs: TabRes[] = await response.json();
      console.log(`탭 목록 조회 성공: ${tabs.length}개 탭 발견`);
      return tabs;
    } catch (error) {
      console.error("탭 목록 조회 중 오류 발생:", error);

      // 네트워크 에러나 서버 에러인 경우 빈 배열 반환
      if (
        error instanceof TypeError ||
        (error instanceof Error && error.message.includes("500"))
      ) {
        console.warn("네트워크 또는 서버 에러로 인해 빈 탭 목록을 반환합니다.");
        return [];
      }

      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const tabService = new TabService();

// 편의를 위한 기본 export
export default tabService;
