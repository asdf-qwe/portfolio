"use client";

import { useAuth } from "@/features/auth/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Button from "@/features/auth/components/Button";

export default function RootPage() {
  const { isLoggedIn, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 로그인된 상태이고 유저 정보가 있으면 해당 유저의 홈페이지로 리다이렉트
    if (isLoggedIn && user?.id) {
      router.push(`/main/home/${user.id}`);
    }
  }, [isLoggedIn, user, router]);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인하지 않은 상태일 때 랜딩 페이지 표시
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            Portfolio Platform
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                로그인
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm">
                회원가입
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            나만의 포트폴리오를 
            <span className="text-blue-600"> 만들어보세요</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            개인별 포트폴리오 페이지를 생성하고, 프로젝트를 관리하며, 
            나만의 포트폴리오를 온라인에서 공유해보세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                🚀 시작하기
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                로그인하기
              </Button>
            </Link>
          </div>

          {/* 데모 링크 (예시) */}
          <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              데모 포트폴리오 보기
            </h3>
            <p className="text-gray-600 mb-4">
              다른 사용자들의 포트폴리오를 미리 확인해보세요
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link 
                href="/main/home/1" 
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                데모 포트폴리오 1
              </Link>
              <Link 
                href="/main/home/2" 
                className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              >
                데모 포트폴리오 2
              </Link>
              <Link 
                href="/main/home/3" 
                className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
              >
                데모 포트폴리오 3
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            주요 기능
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">개인 포트폴리오</h3>
              <p className="text-gray-600">
                나만의 URL로 개인 포트폴리오 페이지를 생성하고 관리하세요
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">프로젝트 관리</h3>
              <p className="text-gray-600">
                카테고리별로 프로젝트를 정리하고 상세 정보를 관리하세요
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">간편한 공유</h3>
              <p className="text-gray-600">
                완성된 포트폴리오를 URL 하나로 간편하게 공유하세요
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
