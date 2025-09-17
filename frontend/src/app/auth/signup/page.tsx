"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/AuthContext";
import { authService } from "@/features/auth/service/authService";
import Input from "@/features/auth/components/Input";
import Button from "@/features/auth/components/Button";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    loginId: "",
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");
  const [checking, setChecking] = useState<{ [key: string]: boolean }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 입력 시 해당 필드의 에러/성공 메시지 제거
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (success[name]) {
      setSuccess((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (generalError) {
      setGeneralError("");
    }
  };

  // 이메일 중복 체크
  const checkEmail = useCallback(async (email: string) => {
    if (!email || !isValidEmail(email)) return;

    try {
      setChecking((prev) => ({ ...prev, email: true }));
      const result = await authService.checkEmail(email);

      if (result.available) {
        setSuccess((prev) => ({ ...prev, email: result.message }));
        setErrors((prev) => ({ ...prev, email: "" }));
      } else {
        setErrors((prev) => ({ ...prev, email: result.message }));
        setSuccess((prev) => ({ ...prev, email: "" }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        email: "이메일 확인 중 오류가 발생했습니다.",
      }));
    } finally {
      setChecking((prev) => ({ ...prev, email: false }));
    }
  }, []);

  // 로그인 ID 중복 체크
  const checkLoginId = useCallback(async (loginId: string) => {
    if (!loginId || loginId.length < 3) return;

    try {
      setChecking((prev) => ({ ...prev, loginId: true }));
      const result = await authService.checkLoginId(loginId);

      if (result.available) {
        setSuccess((prev) => ({ ...prev, loginId: result.message }));
        setErrors((prev) => ({ ...prev, loginId: "" }));
      } else {
        setErrors((prev) => ({ ...prev, loginId: result.message }));
        setSuccess((prev) => ({ ...prev, loginId: "" }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        loginId: "로그인 ID 확인 중 오류가 발생했습니다.",
      }));
    } finally {
      setChecking((prev) => ({ ...prev, loginId: false }));
    }
  }, []);

  // 이메일 블러 처리
  const handleEmailBlur = () => {
    if (formData.email) {
      checkEmail(formData.email);
    }
  };

  // 로그인 ID 블러 처리
  const handleLoginIdBlur = () => {
    if (formData.loginId) {
      checkLoginId(formData.loginId);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    // 영문, 숫자, 특수문자 중 2종류 이상, 10자 이상
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
    return password.length >= 10 && typeCount >= 2;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // 로그인 ID 검증
    if (!formData.loginId.trim()) {
      newErrors.loginId = "로그인 ID를 입력해주세요.";
    } else if (formData.loginId.length < 3) {
      newErrors.loginId = "로그인 ID는 3자 이상이어야 합니다.";
    }

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (!isValidPassword(formData.password)) {
      newErrors.password =
        "영문, 숫자, 특수문자 중 2종류 이상, 10자 이상이어야 합니다.";
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    // 닉네임 검증 (선택사항)
    if (formData.nickname && formData.nickname.length > 20) {
      newErrors.nickname = "닉네임은 20자 이하여야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 중복 체크 결과 확인
    if (errors.loginId || errors.email) {
      setGeneralError("입력 정보를 다시 확인해주세요.");
      return;
    }

    try {
      setGeneralError("");
      await signup(
        formData.loginId,
        formData.password,
        formData.email,
        formData.nickname || undefined
      );

      // 회원가입 성공 시 메인 페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      console.error("회원가입 실패:", error);
      setGeneralError(
        error instanceof Error ? error.message : "회원가입에 실패했습니다."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원가입
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            로그인
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {generalError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-3 text-sm text-red-600">{generalError}</p>
                </div>
              </div>
            )}

            <Input
              label="로그인 ID"
              name="loginId"
              type="text"
              autoComplete="username"
              required
              value={formData.loginId}
              onChange={handleChange}
              onBlur={handleLoginIdBlur}
              error={errors.loginId}
              success={success.loginId}
              placeholder="로그인 ID를 입력하세요 (3자 이상)"
              helperText="다른 사용자들이 볼 수 있는 고유한 ID입니다."
            />

            <Input
              label="이메일"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              error={errors.email}
              success={success.email}
              placeholder="이메일을 입력하세요"
            />

            <Input
              label="비밀번호"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="비밀번호를 입력하세요"
              helperText="영문, 숫자, 특수문자 중 2종류 이상, 10자 이상"
            />

            <Input
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="비밀번호를 다시 입력하세요"
            />

            <Input
              label="닉네임 (선택사항)"
              name="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleChange}
              error={errors.nickname}
              placeholder="닉네임을 입력하세요"
              helperText="입력하지 않으면 로그인 ID가 닉네임으로 사용됩니다."
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading || checking.loginId || checking.email}
                disabled={isLoading || checking.loginId || checking.email}
              >
                회원가입
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
