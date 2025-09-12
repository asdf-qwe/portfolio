/**
 * 토큰 응답 DTO - 백엔드의 TokenResponseDto 클래스와 매핑됨
 *
 * @interface TokenResponseDto
 * @property {string} accessToken - 액세스 토큰
 * @property {string} refreshToken - 리프레시 토큰
 */
export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

/**
 * 사용자 역할 열거형
 */
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

/**
 * 로그인 요청 DTO - 백엔드의 LoginRequestDto 클래스와 매핑됨
 *
 * @interface LoginRequestDto
 * @property {string} loginId - 사용자 로그인 ID (이메일도 가능)
 * @property {string} password - 사용자 비밀번호
 */
export interface LoginRequestDto {
  loginId: string;
  password: string;
}

/**
 * 회원가입 요청 DTO - 백엔드의 SignupRequestDto 클래스와 매핑됨
 *
 * @interface SignupRequestDto
 * @property {string} loginId - 사용자 로그인 ID
 * @property {string} password - 사용자 비밀번호 (영문, 숫자, 특수문자 중 2종류 이상, 10자 이상)
 * @property {string} email - 사용자 이메일
 * @property {string} [nickname] - 사용자 닉네임 (선택사항)
 * @property {string} [imageUrl] - 사용자 이미지 URL (선택사항)
 */
export interface SignupRequestDto {
  loginId: string;
  password: string;
  email: string;
  nickname?: string;
  imageUrl?: string;
}

/**
 * 사용자 응답 DTO - 백엔드의 UserResponseDto 클래스와 매핑됨
 *
 * @interface UserResponseDto
 * @property {number} id - 사용자 ID
 * @property {string} loginId - 사용자 로그인 ID
 * @property {string} nickname - 사용자 닉네임
 * @property {string} email - 사용자 이메일
 * @property {string} imageUrl - 사용자 이미지 URL
 * @property {UserRole} role - 사용자 역할
 */
export interface UserResponseDto {
  id: number;
  loginId: string;
  nickname: string;
  email: string;
  imageUrl: string;
  role: UserRole;
  bio?: string;
}
