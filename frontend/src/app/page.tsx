"use client";

import { useAuth } from "@/features/auth/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Button from "@/features/auth/components/Button";
import { HiSparkles } from "react-icons/hi2";

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
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50">
      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-22 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
              FolioPro
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="hover:bg-blue-50">
                로그인
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                variant="primary"
                size="sm"
                className="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700"
              >
                무료 시작
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/5 to-cyan-600/5"></div>
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              성공적인 커리어를 위한 포트폴리오 플랫폼
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              전문적인 포트폴리오를
              <span className="block bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                5분 만에 완성하세요
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              직관적인 인터페이스로 프로젝트를 정리하고, 아름다운 디자인으로
              나만의 포트폴리오를 만들어 보세요. 취업과 프리랜서 기회를 놓치지
              마세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/auth/signup">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg"
                >
                  <HiSparkles className="w-5 h-5 mr-2" />
                  지금 시작하기
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 hover:border-blue-500 px-8 py-4 text-lg"
                >
                  기존 계정으로 로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-200/20 to-transparent rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-sky-200/20 to-transparent rounded-full blur-3xl translate-y-32 -translate-x-32"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              왜 FolioPro를 선택해야 할까요?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              전문적인 포트폴리오를 만들기 위한 모든 도구를 제공합니다
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 border-2 border-sky-300 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <svg
                  className="w-8 h-8 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                빠른 시작
              </h3>
              <p className="text-gray-600 leading-relaxed">
                직관적인 인터페이스로 5분 만에 전문적인 포트폴리오를 완성하세요.
                복잡한 설정 없이 바로 시작할 수 있습니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 border-2 border-sky-300 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <svg
                  className="w-8 h-8 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                프로젝트 관리
              </h3>
              <p className="text-gray-600 leading-relaxed">
                카테고리별로 프로젝트를 체계적으로 정리하고 상세 정보를
                관리하세요. 검색과 필터링으로 쉽게 찾을 수 있습니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 border-2 border-sky-300 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <svg
                  className="w-8 h-8 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                간편한 공유
              </h3>
              <p className="text-gray-600 leading-relaxed">
                완성된 포트폴리오를 URL 하나로 공유하세요. 반응형 디자인으로
                모든 기기에서 완벽하게 표시됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-sky-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              3단계로 완성하는 포트폴리오
            </h2>
            <p className="text-xl text-gray-600">
              누구나 쉽게 전문적인 포트폴리오를 만들 수 있습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-100 border-2 border-sky-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <span className="text-xl font-bold text-sky-400">1</span>
                </div>
                <div className="absolute -right-4 top-10 w-8 h-0.5 bg-sky-300 hidden md:block"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                템플릿 선택
              </h3>
              <p className="text-gray-600 leading-relaxed">
                25가지 전문 템플릿 중에서 나에게 맞는 디자인을 선택하세요.
                산업별로 최적화된 템플릿으로 시작할 수 있습니다.
              </p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-100 border-2 border-sky-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <span className="text-xl font-bold text-sky-400">2</span>
                </div>
                <div className="absolute -right-4 top-10 w-8 h-0.5 bg-sky-300 hidden md:block"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                콘텐츠 추가
              </h3>
              <p className="text-gray-600 leading-relaxed">
                프로젝트, 경력, 스킬을 쉽게 추가하고 커스터마이징하세요. 드래그
                앤 드롭으로 직관적으로 편집할 수 있습니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 border-2 border-sky-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <span className="text-xl font-bold text-sky-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">공유하기</h3>
              <p className="text-gray-600 leading-relaxed">
                완성된 포트폴리오를 URL로 공유하세요. SEO 최적화로 검색
                엔진에서도 쉽게 찾을 수 있습니다.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-full border border-blue-100">
              <svg
                className="w-5 h-5 text-blue-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                평균 5분 만에 완성 가능
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">FolioPro</span>
              </div>
              <p className="text-gray-400">
                전문적인 포트폴리오를 위한 최고의 플랫폼
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">제품</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    기능 소개
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    가격 정책
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    템플릿
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">지원</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    도움말
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    문의하기
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    커뮤니티
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">회사</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    소개
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    블로그
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    채용
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FolioPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
