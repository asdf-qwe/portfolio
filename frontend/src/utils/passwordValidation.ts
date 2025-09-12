/**
 * 비밀번호 복잡성 검증 유틸리티
 * 백엔드의 @ValidPassword 어노테이션과 동일한 규칙 적용
 */

export interface PasswordValidationResult {
  isValid: boolean;
  message: string;
  details: {
    hasMinLength: boolean;
    hasRequiredCharTypes: boolean;
    charTypesCount: number;
  };
}

/**
 * 비밀번호 복잡성을 검증합니다
 * 조건: 영문, 숫자, 특수문자 중 2종류 이상을 포함하고, 10자 이상이어야 함
 *
 * @param password 검증할 비밀번호
 * @returns PasswordValidationResult 검증 결과
 */
export function validatePassword(password: string): PasswordValidationResult {
  const minLength = 10;
  const hasMinLength = password.length >= minLength;

  // 문자 타입별 정규식
  const hasLetter = /[a-zA-Z]/.test(password); // 영문
  const hasNumber = /\d/.test(password); // 숫자
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password); // 특수문자

  // 포함된 문자 타입 개수 계산
  let charTypesCount = 0;
  if (hasLetter) charTypesCount++;
  if (hasNumber) charTypesCount++;
  if (hasSpecialChar) charTypesCount++;

  const hasRequiredCharTypes = charTypesCount >= 2;
  const isValid = hasMinLength && hasRequiredCharTypes;

  let message = "";
  if (!isValid) {
    const issues = [];
    if (!hasMinLength) {
      issues.push(`${minLength}자 이상`);
    }
    if (!hasRequiredCharTypes) {
      issues.push("영문, 숫자, 특수문자 중 2종류 이상");
    }
    message = `비밀번호는 ${issues.join(", ")}이어야 합니다.`;
  } else {
    message = "유효한 비밀번호입니다.";
  }

  return {
    isValid,
    message,
    details: {
      hasMinLength,
      hasRequiredCharTypes,
      charTypesCount,
    },
  };
}

/**
 * 비밀번호와 비밀번호 확인이 일치하는지 검증합니다
 */
export function validatePasswordConfirm(
  password: string,
  passwordConfirm: string
): {
  isValid: boolean;
  message: string;
} {
  const isValid = password === passwordConfirm && password.length > 0;
  const message = isValid
    ? "비밀번호가 일치합니다."
    : passwordConfirm.length === 0
    ? ""
    : "비밀번호가 일치하지 않습니다.";

  return { isValid, message };
}
