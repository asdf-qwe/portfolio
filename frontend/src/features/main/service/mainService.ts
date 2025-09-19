import { MainRequest, MainResponse } from "../type/main";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * 메인 페이지 관련 API 서비스
 */
export class MainService {
  /**
   * 메인 페이지 정보 조회
   * @param userId 사용자 ID
   * @returns Promise<MainResponse>
   */
  async getMain(userId: number): Promise<MainResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/main?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit", // 쿠키 사용하지 않음 (공개 조회)
        }
      );

      if (!response.ok) {
        throw new Error(
          `메인 정보 조회 실패: ${response.status} ${response.statusText}`
        );
      }

      const mainData: MainResponse = await response.json();
      return mainData;
    } catch (error) {
      console.error("메인 정보 조회 중 오류 발생:", error);
      throw error;
    }
  }

  /**
   * 메인 페이지 정보 수정
   * @param mainRequest 수정할 메인 정보
   * @param userId 사용자 ID
   * @returns Promise<string>
   */
  async updateMain(mainRequest: MainRequest, userId: number): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/main?userId=${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 수정은 인증이 필요하므로 쿠키 포함
          body: JSON.stringify(mainRequest),
        }
      );

      if (!response.ok) {
        throw new Error(
          `메인 정보 수정 실패: ${response.status} ${response.statusText}`
        );
      }

      const message: string = await response.text();
      return message;
    } catch (error) {
      console.error("메인 정보 수정 중 오류 발생:", error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const mainService = new MainService();

// 편의를 위한 기본 export
export default mainService;
