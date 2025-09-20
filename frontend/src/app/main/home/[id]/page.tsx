"use client";

import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import Button from "@/features/auth/components/Button";
import SkillsTabs from "@/components/SkillsTabs";
import { categoryService } from "@/features/category/service/categoryService";
import { CategoryResponse } from "@/features/category/types/category";
import {
  uploadProfileImage,
  getUserProfileImage,
} from "@/features/upload/service/uploadService";
import { mainService } from "@/features/main/service/mainService";
import { MainResponse } from "@/features/main/type/main";
import Image from "next/image";

interface HomePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function HomePage({ params }: HomePageProps) {
  const resolvedParams = React.use(params);
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const userId = resolvedParams.id;

  // 카테고리 상태 관리
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // 프로필 이미지 상태 관리
  const [profileImageUrl, setProfileImageUrl] =
    useState<string>("/다운로드.jpeg"); // 기본 이미지
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [profileImageLoading, setProfileImageLoading] = useState(true);

  // 카테고리 생성 관련 상태
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // 메인 데이터 상태 관리
  const [mainData, setMainData] = useState<MainResponse | null>(null);
  const [mainDataLoading, setMainDataLoading] = useState(true);

  // 메인 데이터 편집 상태 관리
  const [isEditingMain, setIsEditingMain] = useState(false);
  const [editMainData, setEditMainData] = useState({
    greeting: "",
    smallGreeting: "",
    name: "",
    introduce: "",
  });
  const [isSavingMain, setIsSavingMain] = useState(false);

  // 전역 편집 모드 상태
  const [isGlobalEditMode, setIsGlobalEditMode] = useState(false);

  // Kakao Maps SDK 로드 상태
  const [isKakaoMapsLoaded, setIsKakaoMapsLoaded] = useState(false);

  // 위치 정보 상태
  const [currentLocation, setCurrentLocation] = useState({
    text: "서울, 대한민국",
    lat: 37.5665,
    lng: 126.978,
  });

  // 지도 검색 모달 상태
  const [isMapSearchModalOpen, setIsMapSearchModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await categoryService.getCategories(
          parseInt(userId)
        );
        setCategories(categoriesData);
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [userId]);

  // 프로필 이미지 가져오기
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        setProfileImageLoading(true);
        const imageUrl = await getUserProfileImage(parseInt(userId));
        if (imageUrl) {
          setProfileImageUrl(imageUrl);
        }
      } catch (error) {
        console.error("프로필 이미지 조회 실패:", error);
        // 에러 시 기본 이미지 유지
      } finally {
        setProfileImageLoading(false);
      }
    };

    fetchProfileImage();
  }, [userId]);

  // 메인 데이터 가져오기
  useEffect(() => {
    const fetchMainData = async () => {
      try {
        setMainDataLoading(true);
        const data = await mainService.getMain(parseInt(userId));
        setMainData(data);
      } catch (error) {
        console.error("메인 데이터 조회 실패:", error);
        // 에러 시 기본값 설정
        setMainData({
          greeting: "안녕하세요!",
          smallGreeting: "열정과 책임감이 있는 개발자입니다.",
          name: "사용자",
          introduce:
            "새로운 기술을 배우고 적용할 때 신기해 하고 좋아하며, 사용자 경험을 개선하는 데 열정을 가지고 있습니다.",
        });
      } finally {
        setMainDataLoading(false);
      }
    };

    fetchMainData();
  }, [userId]);

  // Kakao Maps SDK 로드 확인
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || "",
    libraries: ["services", "clusterer", "drawing"],
  });

  useEffect(() => {
    if (!loading && !error) {
      setIsKakaoMapsLoaded(true);
    } else if (error) {
      console.error("❌ Kakao Maps SDK 로드 실패:", error);
    }
  }, [loading, error]);

  // 모달 ESC 키 핸들러
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMapSearchModalOpen) {
        setIsMapSearchModalOpen(false);
        setSearchKeyword("");
        setSearchResults([]);
      }
    };

    if (isMapSearchModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // 스크롤 막기
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset"; // 스크롤 복원
    };
  }, [isMapSearchModalOpen]);

  // 지도 검색 함수
  const searchPlaces = async (keyword: string) => {
    if (!keyword.trim()) {
      return;
    }

    if (!isKakaoMapsLoaded) {
      console.error("❌ Kakao Maps SDK가 아직 로드되지 않음");
      console.log("SDK 로딩 상태:", {
        loading,
        error,
        isLoaded: isKakaoMapsLoaded,
      });
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch(keyword, (data: any[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
        setIsSearching(false);
      });
    } catch (error) {
      console.error("💥 장소 검색 에러:", error);
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // 검색 결과 선택 함수
  const selectPlace = (place: any) => {
    setCurrentLocation({
      text: place.place_name,
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
    });
    setIsMapSearchModalOpen(false);
    setSearchKeyword("");
    setSearchResults([]);
  };

  // 검색 디바운싱을 위한 ref
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 검색어 입력 핸들러
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);

    // 이전 타이머 클리어
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 실시간 검색 (디바운싱)
    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchPlaces(value);
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 프로필 이미지 업로드 처리
  const handleProfileImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !canEdit) return;

    // 이미지 파일 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    try {
      setIsUploadingProfile(true);
      const imageUrl = await uploadProfileImage(file, parseInt(userId));
      setProfileImageUrl(imageUrl);
      alert("프로필 이미지가 성공적으로 업로드되었습니다!");
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      alert("프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploadingProfile(false);
    }
  };

  // 카테고리 생성 함수
  const handleCreateCategory = async () => {
    if (!newCategoryTitle.trim()) {
      alert("카테고리 제목을 입력해주세요.");
      return;
    }

    if (!canEdit) {
      alert("카테고리 생성 권한이 없습니다.");
      return;
    }

    try {
      setIsCreatingCategory(true);
      await categoryService.createCategory(
        {
          categoryTitle: newCategoryTitle.trim(),
        },
        parseInt(userId)
      );

      // 카테고리 목록 새로고침
      const categoriesData = await categoryService.getCategories(
        parseInt(userId)
      );
      setCategories(categoriesData);

      // 폼 초기화
      setNewCategoryTitle("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("카테고리 생성 실패:", error);
      alert("프로젝트 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // 스크롤 이동 함수
  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const projectsSection = document.getElementById("projects");
    projectsSection?.scrollIntoView({ behavior: "smooth" });
  };

  // 접근 권한 체크
  const isOwner = isLoggedIn && user && user.id?.toString() === userId;
  const canEdit = isOwner;

  // 메인 데이터 저장
  const saveMainData = async () => {
    if (!canEdit) return;

    try {
      setIsSavingMain(true);

      await mainService.updateMain(editMainData, parseInt(userId));

      // 저장 후 데이터 새로고침
      const updatedData = await mainService.getMain(parseInt(userId));
      setMainData(updatedData);

      setIsEditingMain(false);
      setIsGlobalEditMode(false); // 전역 편집 모드도 종료
    } catch (error) {
      console.error("메인 정보 저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSavingMain(false);
    }
  };

  // 전역 편집 모드 토글
  const toggleGlobalEditMode = () => {
    if (!canEdit) return;

    if (!isGlobalEditMode) {
      // 편집 모드 진입
      setIsGlobalEditMode(true);
      if (mainData) {
        setEditMainData({
          greeting: mainData.greeting,
          smallGreeting: mainData.smallGreeting,
          name: mainData.name,
          introduce: mainData.introduce,
        });
        setIsEditingMain(true);
      }
    } else {
      // 편집 모드 종료
      setIsGlobalEditMode(false);
      setIsEditingMain(false);
      setEditMainData({
        greeting: "",
        smallGreeting: "",
        name: "",
        introduce: "",
      });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link
              href={`/main/home/${userId}`}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-sky-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent hover:from-sky-700 hover:to-cyan-700 transition-all duration-300">
                FolioPro
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              {isLoggedIn ? (
                <>
                  <div className="hidden md:flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">
                      {user?.nickname || user?.loginId}
                    </span>
                  </div>

                  {canEdit && (
                    <button
                      onClick={
                        isGlobalEditMode ? saveMainData : toggleGlobalEditMode
                      }
                      disabled={isSavingMain}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isGlobalEditMode
                          ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {isGlobalEditMode ? (
                          isSavingMain ? (
                            <circle
                              className="animate-spin"
                              cx="12"
                              cy="12"
                              r="10"
                              strokeWidth="4"
                              stroke="currentColor"
                              fill="none"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          )
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        )}
                      </svg>
                      <span className="hidden sm:inline">
                        {isGlobalEditMode
                          ? isSavingMain
                            ? "저장 중..."
                            : "저장하기"
                          : "편집 모드"}
                      </span>
                    </button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    isLoading={isLoading}
                    className="border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 hover:border-gray-400"
                    >
                      로그인
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-sky-600 hover:bg-sky-700"
                    >
                      시작하기
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
                    setEditMainData({
                      ...editMainData,
                      greeting: e.target.value,
                    })
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
                    setEditMainData({
                      ...editMainData,
                      smallGreeting: e.target.value,
                    })
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
                    onClick={scrollToProjects}
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

      {/* About Section */}
      <section
        id="about"
        className="py-24 px-6 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {mainDataLoading ? (
                // 로딩 중
                <div className="space-y-6">
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ) : isEditingMain ? (
                // 편집 모드
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-gray-800">
                      이름
                    </label>
                    <input
                      type="text"
                      value={editMainData.name}
                      onChange={(e) =>
                        setEditMainData({
                          ...editMainData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-xl font-bold focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 shadow-sm"
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-gray-800">
                      소개글
                    </label>
                    <textarea
                      value={editMainData.introduce}
                      onChange={(e) =>
                        setEditMainData({
                          ...editMainData,
                          introduce: e.target.value,
                        })
                      }
                      rows={6}
                      className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 shadow-sm resize-none"
                      placeholder="자기소개를 입력하세요"
                    />
                  </div>
                </div>
              ) : (
                // 실제 데이터
                <div className="space-y-8">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      {mainData?.name || "사용자"}
                    </h3>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-start gap-4 mb-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-sky-100 border border-sky-200 rounded-full shadow-sm">
                        <svg
                          className="w-4 h-4 text-sky-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4"
                          />
                        </svg>
                        <span className="text-sky-700 font-semibold text-sm">
                          직무
                        </span>
                        <span className="text-sky-600 text-sm bg-sky-200 px-3 py-1 rounded-full whitespace-nowrap">
                          정보 없음
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-50 to-cyan-100 border border-cyan-200 rounded-full shadow-sm">
                        <svg
                          className="w-4 h-4 text-cyan-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-cyan-700 font-semibold text-sm">
                          경력
                        </span>
                        <span className="text-cyan-600 text-sm bg-cyan-200 px-3 py-1 rounded-full whitespace-nowrap">
                          정보 없음
                        </span>
                      </div>
                    </div>

                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                      {mainData?.introduce ||
                        "새로운 기술을 배우고 적용할 때 신기해 하고 좋아하며, 사용자 경험을 개선하는 데 열정을 가지고 있습니다."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-96 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
                  {profileImageLoading ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent"></div>
                    </div>
                  ) : (
                    <Image
                      src={profileImageUrl}
                      alt="Profile"
                      fill
                      sizes="(max-width: 320px) 100vw"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center top",
                      }}
                      className="rounded-3xl"
                      priority
                    />
                  )}
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-2xl opacity-20 animate-pulse"></div>
                <div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-xl opacity-30 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>

                {/* 편집 가능한 경우 업로드 버튼 표시 */}
                {canEdit && (
                  <div className="absolute bottom-6 right-6">
                    <label
                      htmlFor="profile-image-upload"
                      className="cursor-pointer group"
                    >
                      <div className="bg-white text-sky-600 p-3 rounded-2xl shadow-xl hover:bg-sky-50 transition-all duration-300 group-hover:scale-110">
                        {isUploadingProfile ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-sky-500 border-t-transparent"></div>
                        ) : (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                      disabled={isUploadingProfile}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Tabs Section */}
      <SkillsTabs
        canEdit={!!canEdit}
        isEditMode={isGlobalEditMode}
        userId={parseInt(userId)}
      />

      {/* Featured Projects Section */}
      <section id="projects" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              주요 프로젝트
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              다양한 기술 스택과 도메인을 경험하며 성장해온 프로젝트들을
              소개합니다
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto rounded-full mt-8"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesLoading ? (
              // 로딩 중일 때 스켈레톤 표시
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-8">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : categories.length > 0 ? (
              // 카테고리가 있을 때
              categories.map((category, index) => (
                <Link
                  href={`/main/home/${userId}/category/${category.id}`}
                  key={category.id}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <div className="relative h-48 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <div className="text-center text-white">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                          </div>
                          <p className="text-sm font-medium opacity-90">
                            프로젝트 #{index + 1}
                          </p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors duration-300">
                        {category.categoryTitle}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        프로젝트에 대한 자세한 내용을 확인해보세요. 기술 스택,
                        구현 과정, 성과 등을 확인하실 수 있습니다.
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-sky-100 text-sky-700 text-sm font-semibold rounded-full border border-sky-200">
                          프로젝트
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                          {new Date(category.createdAt).toLocaleDateString(
                            "ko-KR"
                          )}
                        </span>
                      </div>

                      <div className="flex items-center text-sky-600 font-medium group-hover:text-sky-700 transition-colors duration-300">
                        <span>자세히 보기</span>
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
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
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // 카테고리가 없을 때
              <div className="col-span-full text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  아직 프로젝트가 없습니다
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  첫 번째 프로젝트를 만들어보세요! 당신의 경험과 기술을 공유하는
                  좋은 기회가 될 것입니다.
                </p>

                {canEdit && (
                  <div className="max-w-md mx-auto">
                    {!showCreateForm ? (
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        프로젝트 추가하기
                      </button>
                    ) : (
                      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
                        <div className="text-center mb-6">
                          <h4 className="text-2xl font-bold text-gray-900 mb-2">
                            새 프로젝트 만들기
                          </h4>
                          <p className="text-gray-600">
                            프로젝트 제목을 입력하고 시작해보세요
                          </p>
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              프로젝트 제목
                            </label>
                            <input
                              type="text"
                              value={newCategoryTitle}
                              onChange={(e) =>
                                setNewCategoryTitle(e.target.value)
                              }
                              placeholder="예: 쇼핑몰 웹사이트, 모바일 앱 등"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 text-lg"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleCreateCategory();
                                }
                              }}
                              disabled={isCreatingCategory}
                            />
                          </div>
                          <div className="flex gap-4">
                            <button
                              onClick={handleCreateCategory}
                              disabled={
                                isCreatingCategory || !newCategoryTitle.trim()
                              }
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                              {isCreatingCategory ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                  생성 중...
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  생성하기
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setShowCreateForm(false);
                                setNewCategoryTitle("");
                              }}
                              disabled={isCreatingCategory}
                              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all duration-300"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!canEdit && (
                  <p className="text-gray-500 text-sm mt-6">
                    이 사용자는 아직 프로젝트를 추가하지 않았습니다.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-sky-100 to-cyan-100 bg-clip-text text-transparent">
              함께 일해보세요
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              새로운 프로젝트나 협업 기회를 찾고 계신가요? 함께 의미 있는 일을
              만들어 나가고 싶습니다.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto rounded-full mt-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">이메일</h3>
              <p className="text-gray-300 mb-4">프로젝트 문의 및 협업 제안</p>
              <div className="text-center">
                <a
                  href="mailto:contact@example.com"
                  className="text-sky-400 hover:text-sky-300 font-medium text-lg transition-colors duration-300"
                >
                  contact@example.com
                </a>
                {isGlobalEditMode && (
                  <p className="text-gray-400 text-sm mt-2">
                    아이콘을 클릭하여 이메일 변경
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">전화번호</h3>
              <p className="text-gray-300 mb-4">직접 연락 및 긴급 문의</p>
              <div className="text-center">
                <a
                  href="tel:+82-10-1234-5678"
                  className="text-cyan-400 hover:text-cyan-300 font-medium text-lg transition-colors duration-300"
                >
                  +82 10-1234-5678
                </a>
                {isGlobalEditMode && (
                  <p className="text-gray-400 text-sm mt-2">
                    아이콘을 클릭하여 전화번호 변경
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div
                className={`w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 relative group ${
                  isGlobalEditMode ? "cursor-pointer" : ""
                }`}
                onClick={
                  isGlobalEditMode
                    ? () => setIsMapSearchModalOpen(true)
                    : undefined
                }
              >
                <svg
                  className={`w-8 h-8 text-white ${
                    isGlobalEditMode
                      ? "group-hover:scale-110 transition-transform duration-300"
                      : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {/* 클릭 힌트 */}
                {isGlobalEditMode && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-sky-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-4">위치</h3>
              <p className="text-gray-300 mb-4">근무 및 협업 가능 지역</p>
              <div className="text-center">
                <span className="text-sky-400 font-medium text-lg">
                  {currentLocation.text}
                </span>
                {isGlobalEditMode && (
                  <p className="text-gray-400 text-sm mt-2">
                    아이콘을 클릭하여 위치 변경
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">
                현재 새로운 프로젝트 제안을 기다리고 있습니다
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 지도 검색 모달 */}
      {isMapSearchModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* 모달 헤더 */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">위치 검색</h3>
                <button
                  onClick={() => {
                    setIsMapSearchModalOpen(false);
                    setSearchKeyword("");
                    setSearchResults([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                근무 및 협업 가능한 지역을 검색하세요
              </p>
            </div>

            {/* 검색 입력 */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={handleSearchInput}
                  placeholder="도시, 지역, 장소를 입력하세요"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-500 border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>

            {/* 검색 결과 */}
            <div className="max-h-64 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {searchResults.map((place, index) => (
                    <button
                      key={index}
                      onClick={() => selectPlace(place)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">
                        {place.place_name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {place.address_name}
                      </div>
                      {place.category_name && (
                        <div className="text-xs text-gray-400 mt-1">
                          {place.category_name}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : searchKeyword && !isSearching ? (
                <div className="p-8 text-center text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p>검색 결과가 없습니다</p>
                  <p className="text-sm mt-1">다른 검색어를 시도해보세요</p>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p>도시나 지역명을 검색하세요</p>
                  <p className="text-sm mt-1">예: 서울, 부산, 강남역 등</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
