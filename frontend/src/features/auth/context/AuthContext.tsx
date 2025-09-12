"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserResponseDto } from "@/features/auth/types/auth";
import { authService } from "@/features/auth/service/authService";

interface AuthContextType {
  user: UserResponseDto | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (
    loginId: string,
    password: string,
    email: string,
    nickname?: string
  ) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const loggedIn = await authService.isLoggedIn();

      if (loggedIn) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      // 개발 환경에서만 상세 로그 출력
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "인증 상태 확인:",
          error instanceof Error ? error.message : "인증되지 않음"
        );
      }

      // 인증 실패는 정상적인 시나리오이므로 로그아웃 상태로 처리
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginId: string, password: string) => {
    try {
      setIsLoading(true);
      await authService.login({ loginId, password });

      // 로그인 성공 후 사용자 정보 가져오기
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("로그인 실패:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("로그아웃 실패:", error);
      // 에러가 발생해도 로컬 상태는 정리
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    loginId: string,
    password: string,
    email: string,
    nickname?: string
  ) => {
    try {
      setIsLoading(true);
      await authService.signup({
        loginId,
        password,
        email,
        nickname,
      });

      // 회원가입 성공 후 자동 로그인
      await login(loginId, password);
    } catch (error) {
      console.error("회원가입 실패:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (isLoggedIn) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "사용자 정보 갱신:",
          error instanceof Error ? error.message : "갱신 실패"
        );
      }

      // 사용자 정보 갱신 실패 시 로그아웃 처리
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn,
    login,
    logout,
    signup,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
