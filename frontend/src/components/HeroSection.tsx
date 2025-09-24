import React from "react";
import { MainResponse } from "@/features/main/type/main";
import { WorkHistory } from "@/features/main/type/main";

interface HeroSectionProps {
  mainData: MainResponse | null;
  mainDataLoading: boolean;
  isEditingMain: boolean;
  editMainData: {
    greeting: string;
    smallGreeting: string;
    name: string;
    introduce: string;
    job: string;
    workHistory: WorkHistory;
  };
  setEditMainData: React.Dispatch<
    React.SetStateAction<{
      greeting: string;
      smallGreeting: string;
      name: string;
      introduce: string;
      job: string;
      workHistory: WorkHistory;
    }>
  >;
  isGlobalEditMode: boolean;
  onScrollToProjects: (e: React.MouseEvent) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  mainData,
  mainDataLoading,
  isEditingMain,
  editMainData,
  setEditMainData,
  isGlobalEditMode,
  onScrollToProjects,
}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-sky-600/5 to-transparent rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {mainDataLoading ? (
          // 로딩 중
          <div className="space-y-6">
            <div className="h-16 w-96 bg-white/10 rounded-xl animate-pulse mx-auto"></div>
            <div className="h-6 w-80 bg-white/10 rounded animate-pulse mx-auto"></div>
            <div className="h-12 w-48 bg-white/20 rounded-full animate-pulse mx-auto mt-8"></div>
          </div>
        ) : isEditingMain ? (
          // 편집 모드
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-sky-200 uppercase tracking-wider">
                메인 인사말
              </label>
              <input
                type="text"
                value={editMainData.greeting}
                onChange={(e) =>
                  setEditMainData((prev) => ({
                    ...prev,
                    greeting: e.target.value,
                  }))
                }
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 text-5xl font-bold text-center focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all duration-300"
                placeholder="인사말을 입력하세요"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-sky-200 uppercase tracking-wider">
                부제목
              </label>
              <input
                type="text"
                value={editMainData.smallGreeting}
                onChange={(e) =>
                  setEditMainData((prev) => ({
                    ...prev,
                    smallGreeting: e.target.value,
                  }))
                }
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 text-2xl text-center focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all duration-300"
                placeholder="부제목을 입력하세요"
              />
            </div>
          </div>
        ) : (
          // 실제 데이터
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-transparent">
                {mainData?.greeting || "안녕하세요!"}
              </h1>
              <p className="text-xl md:text-2xl text-sky-100 font-light max-w-2xl mx-auto leading-relaxed">
                {mainData?.smallGreeting ||
                  "열정과 책임감이 있는 개발자입니다."}
              </p>
            </div>

            {!isGlobalEditMode && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                <button
                  onClick={onScrollToProjects}
                  className="group relative px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    프로젝트 보기
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("about")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                >
                  더 알아보기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};
