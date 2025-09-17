"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
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
      console.log("메인 정보가 성공적으로 업데이트되었습니다.");
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
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href={`/main/home/${userId}`}
            className="text-xl font-bold text-gray-800"
          >
            Portfolio
          </Link>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-gray-600">
                  안녕하세요, {user?.nickname || user?.loginId}님!
                </span>
                {canEdit && (
                  <span className="text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded">
                    내 페이지
                  </span>
                )}
                {canEdit && (
                  <button
                    onClick={
                      isGlobalEditMode ? saveMainData : toggleGlobalEditMode
                    }
                    disabled={isSavingMain}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                      isGlobalEditMode
                        ? "bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
                    <span className="text-sm font-medium">
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
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-400/80 to-blue-500/80 text-white">
        <div className="container mx-auto px-6 text-center">
          {mainDataLoading ? (
            // 로딩 중
            <>
              <div className="h-12 w-64 bg-white/20 rounded animate-pulse mx-auto mb-4"></div>
              <div className="h-8 w-96 bg-white/20 rounded animate-pulse mx-auto mb-8"></div>
            </>
          ) : isEditingMain ? (
            // 편집 모드
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
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
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 text-4xl font-bold text-center focus:ring-2 focus:ring-white/40 focus:border-white/40"
                  placeholder="인사말을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
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
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 text-xl text-center focus:ring-2 focus:ring-white/40 focus:border-white/40"
                  placeholder="부제목을 입력하세요"
                />
              </div>
            </div>
          ) : (
            // 실제 데이터
            <>
              <h1 className="text-5xl font-bold mb-4">
                {mainData?.greeting || "안녕하세요!"}
              </h1>
              <p className="text-2xl mb-8">
                {mainData?.smallGreeting ||
                  "열정과 책임감이 있는 개발자입니다."}
              </p>
            </>
          )}
          {!isGlobalEditMode && (
            <button
              onClick={scrollToProjects}
              className="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
            >
              프로젝트 보기
            </button>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* About Section */}
      <section className="py-18 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-center">About Me</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 h-[320px] flex flex-col justify-center p-4">
              <div className="space-y-6">
                {mainDataLoading ? (
                  // 로딩 중 - 이름이 위에, 소개글이 아래에
                  <>
                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </>
                ) : isEditingMain ? (
                  // 편집 모드
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-bold"
                        placeholder="이름을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                        placeholder="자기소개를 입력하세요"
                      />
                    </div>
                  </>
                ) : (
                  // 실제 데이터 - 이름(굵은 글씨)이 위에, 소개글(일반 텍스트)이 아래에
                  <>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {mainData?.name || "사용자"}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {mainData?.introduce ||
                        "새로운 기술을 배우고 적용할 때 신기해 하고 좋아하며, 사용자 경험을 개선하는 데 열정을 가지고 있습니다."}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="relative w-[240px] h-[320px] rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-duration-300">
                {profileImageLoading ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <Image
                    src={profileImageUrl}
                    alt="Profile"
                    fill
                    sizes="(max-width: 240px) 100vw"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center top",
                    }}
                    className="rounded-lg"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>

                {/* 편집 가능한 경우 업로드 버튼 표시 */}
                {canEdit && (
                  <div className="absolute bottom-4 right-4">
                    <label
                      htmlFor="profile-image-upload"
                      className="cursor-pointer"
                    >
                      <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                        {isUploadingProfile ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <svg
                            className="w-4 h-4"
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
      <section id="projects" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-center">주요 프로젝트</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {categoriesLoading ? (
              // 로딩 중일 때 스켈레톤 표시
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : categories.length > 0 ? (
              // 카테고리가 있을 때
              categories.map((category) => (
                <Link
                  href={`/main/home/${userId}/category/${category.id}`}
                  key={category.id}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <svg
                            className="w-16 h-16 mx-auto mb-2 opacity-80"
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
                          <p className="text-sm opacity-80">프로젝트</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {category.categoryTitle}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        프로젝트에 대한 자세한 내용을 확인해보세요.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-sm">
                          프로젝트
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // 카테고리가 없을 때
              <div className="col-span-3 text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  아직 프로젝트가 없습니다
                </h3>
                <p className="text-gray-500 mb-6">
                  첫 번째 프로젝트를 만들어보세요!
                </p>

                {canEdit && (
                  <div className="max-w-md mx-auto">
                    {!showCreateForm ? (
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        프로젝트 추가하기
                      </button>
                    ) : (
                      <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h4 className="text-lg font-semibold mb-4">
                          새 프로젝트 만들기
                        </h4>
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={newCategoryTitle}
                            onChange={(e) =>
                              setNewCategoryTitle(e.target.value)
                            }
                            placeholder="프로젝트 제목을 입력하세요"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleCreateCategory();
                              }
                            }}
                            disabled={isCreatingCategory}
                          />
                          <div className="flex gap-3 justify-center">
                            <button
                              onClick={handleCreateCategory}
                              disabled={
                                isCreatingCategory || !newCategoryTitle.trim()
                              }
                              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {isCreatingCategory ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  생성 중...
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-4 h-4"
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
                                  생성
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setShowCreateForm(false);
                                setNewCategoryTitle("");
                              }}
                              disabled={isCreatingCategory}
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
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
                  <p className="text-gray-400 text-sm mt-4">
                    이 사용자는 아직 프로젝트를 추가하지 않았습니다.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">함께 일해보세요</h2>
          <p className="text-gray-600 mb-8">
            새로운 프로젝트나 협업 기회를 찾고 계신가요?
          </p>
          <button className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
            연락하기
          </button>
        </div>
      </section>
    </main>
  );
}
