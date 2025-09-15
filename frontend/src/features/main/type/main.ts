// 메인 페이지 관련 타입 정의

/**
 * 메인 페이지 요청 DTO
 */
export interface MainRequest {
  greeting: string;
  smallGreeting: string;
  introduce: string;
  name: string;
}

/**
 * 메인 페이지 응답 DTO
 */
export interface MainResponse {
  greeting: string;
  smallGreeting: string;
  introduce: string;
  name: string;
}
