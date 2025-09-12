import {
  TokenResponseDto,
  LoginRequestDto,
  SignupRequestDto,
  UserResponseDto,
} from "../types/auth";
import { apiClient } from "../../../lib/api";

// API 기본 URL - 환경에 맞게 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const AUTH_API = `${API_URL}/api/v1/auth`;

/**
 * 자동 토큰 갱신을 포함한 fetch wrapper
 */
async function fetchWithTokenRefresh(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // 401 에러 시 토큰 갱신 시도
  if (response.status === 401) {
    try {
      // 토큰 갱신 시도
      await authService.refreshToken();

      // 갱신 성공 시 원래 요청 재시도
      return await fetch(url, {
        ...options,
        credentials: "include",
      });
    } catch (refreshError) {
      // 개발 환경에서만 상세 로그 출력
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "토큰 갱신:",
          refreshError instanceof Error ? refreshError.message : "갱신 불가"
        );
      }

      // 갱신 실패 시 로그인 페이지로 리다이렉트하거나 에러 처리
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요");
    }
  }

  return response;
}

/**
 * 인증 관련 서비스
 */
export const authService = {
  /**
   * 회원가입 기능
   * @param dto 회원가입 요청 DTO (이메일, 비밀번호, 닉네임 포함)
   * @returns 사용자 정보 (UserResponseDto)
   */
  async signup(dto: SignupRequestDto): Promise<UserResponseDto> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "회원가입에 실패했습니다");
      }

      const userData: UserResponseDto = await response.json();
      return userData;
    } catch (error) {
      console.error("회원가입 에러:", error);
      throw error;
    }
  },
  /**
   * 로그인 기능
   * @param requestDto 로그인 요청 DTO (로그인 ID, 비밀번호 포함)
   * @returns JWT 토큰 (액세스 토큰, 리프레시 토큰)
   */ async login(requestDto: LoginRequestDto): Promise<TokenResponseDto> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청
        body: JSON.stringify(requestDto),
      });

      if (!response.ok) {
        let errorMessage = "로그인에 실패했습니다";

        try {
          const errorData = await response.json();
          // 서버에서 JSON 형태로 에러 메시지를 보내는 경우
          if (
            errorData.message &&
            !errorData.message.includes("Internal Server Error") &&
            !errorData.message.includes("IllegalArgumentException")
          ) {
            errorMessage = errorData.message;
          } else {
            // Internal Server Error나 예외 메시지인 경우 상태코드별 처리
            if (response.status === 500) {
              // 백엔드에서 비밀번호 불일치 시 500 에러를 보내므로
              errorMessage = "아이디 또는 비밀번호가 올바르지 않습니다";
            } else if (response.status === 401) {
              errorMessage = "아이디 또는 비밀번호가 올바르지 않습니다";
            } else if (response.status === 400) {
              errorMessage = "잘못된 요청입니다. 입력 정보를 확인해주세요";
            }
          }
        } catch (jsonError) {
          // JSON 파싱 실패 시 status에 따른 기본 메시지
          if (response.status === 500 || response.status === 401) {
            errorMessage = "아이디 또는 비밀번호가 올바르지 않습니다";
          } else if (response.status === 400) {
            errorMessage = "잘못된 요청입니다. 입력 정보를 확인해주세요";
          } else if (response.status >= 500) {
            errorMessage =
              "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요";
          }
        }

        throw new Error(errorMessage);
      }

      const tokens: TokenResponseDto = await response.json();
      // 쿠키는 서버에서 자동으로 설정되므로 로컬스토리지 저장 제거

      return tokens;
    } catch (error) {
      console.error("로그인 에러:", error);
      throw error;
    }
  },
  /**
   * 현재 로그인한 사용자 정보 가져오기 (자동 토큰 갱신 포함)
   * @returns 사용자 정보 (UserResponseDto)
   */
  async getCurrentUser(): Promise<UserResponseDto> {
    try {
      const response = await apiClient.request("/api/v1/users/me");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "사용자 정보를 가져오는데 실패했습니다");
      }

      const userData: UserResponseDto = await response.json();
      return userData;
    } catch (error) {
      console.error("사용자 정보 조회 에러:", error);
      throw error;
    }
  },
  /**
   * 로그아웃 기능
   */ async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청
      });

      // 서버 응답과 관계없이 로컬 상태 정리
      // 쿠키는 서버에서 삭제되므로 추가 처리 불필요
    } catch (error) {
      console.error("로그아웃 에러:", error);
      // 에러가 발생해도 로그아웃 처리를 진행
    }
  },
  /**
   * AccessToken 재발급
   * @returns 새로운 JWT 토큰
   */
  async refreshToken(): Promise<TokenResponseDto> {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키를 포함하여 요청
      });

      if (!response.ok) {
        throw new Error("토큰 갱신에 실패했습니다");
      }

      const tokens: TokenResponseDto = await response.json();
      return tokens;
    } catch (error) {
      // 개발 환경에서만 상세 로그 출력
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "토큰 갱신 시도:",
          error instanceof Error ? error.message : "갱신 실패"
        );
      }
      throw error;
    }
  },
  /**
   * 사용자가 로그인 상태인지 확인 (토큰 자동 갱신 포함)
   * 서버에 요청하여 실제 인증 상태를 확인
   * @returns 로그인 상태 여부
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const response = await fetchWithTokenRefresh(
        `${API_URL}/api/v1/users/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.ok;
    } catch (error) {
      // 개발 환경에서만 상세 로그 출력
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "로그인 상태 확인:",
          error instanceof Error ? error.message : "확인 실패"
        );
      }
      return false;
    }
  },

  /**
   * 이메일 중복 체크
   * @param email 확인할 이메일 주소
   * @returns 이메일 사용 가능 여부와 메시지
   */
  async checkEmail(
    email: string
  ): Promise<{ available: boolean; message: string }> {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/users/check-email?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const message = await response.text();

      if (response.ok) {
        return { available: true, message };
      } else if (response.status === 409) {
        return { available: false, message };
      } else if (response.status === 400) {
        return { available: false, message };
      } else {
        throw new Error(message || "이메일 확인에 실패했습니다");
      }
    } catch (error) {
      console.error("이메일 중복 체크 에러:", error);
      throw error;
    }
  },

  /**
   * 로그인 ID 중복 체크
   * @param loginId 확인할 로그인 ID
   * @returns 로그인 ID 사용 가능 여부와 메시지
   */
  async checkLoginId(
    loginId: string
  ): Promise<{ available: boolean; message: string }> {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/users/check-loginId?loginId=${encodeURIComponent(
          loginId
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const message = await response.text();

      if (response.ok) {
        return { available: true, message };
      } else if (response.status === 409) {
        return { available: false, message };
      } else {
        throw new Error(message || "로그인 ID 확인에 실패했습니다");
      }
    } catch (error) {
      console.error("로그인 ID 중복 체크 에러:", error);
      throw error;
    }
  },
};

export default authService;
