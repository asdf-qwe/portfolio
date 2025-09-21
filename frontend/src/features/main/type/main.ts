// 메인 페이지 관련 타입 정의

/**
 * 경력 정보 enum
 */
export enum WorkHistory {
  ZERO = "ZERO",
  ONE = "ONE",
  TWO = "TWO",
  THREE = "THREE",
  FOUR = "FOUR",
  FIVE = "FIVE",
  SIX = "SIX",
  SEVEN = "SEVEN",
  EIGHT = "EIGHT",
  NINE = "NINE",
  TEN = "TEN",
}

/**
 * 메인 페이지 요청 DTO
 */
export interface MainRequest {
  greeting: string;
  smallGreeting: string;
  introduce: string;
  name: string;
  job: string;
  workHistory: WorkHistory;
}

/**
 * 메인 페이지 응답 DTO
 */
export interface MainResponse {
  greeting: string;
  smallGreeting: string;
  introduce: string;
  name: string;
  job: string;
  workHistory: WorkHistory;
}
