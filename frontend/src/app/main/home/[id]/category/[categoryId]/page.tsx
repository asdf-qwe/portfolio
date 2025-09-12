"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import ProjectHeader from "@/components/ProjectHeader";
import ResourceManager from "@/components/ResourceManager";
import { getProjectData } from "@/constants/projectsData";
import { createPost, getPosts } from "@/features/post/service/postService";
import { CreatePostDto } from "@/features/post/types/post";
import { useAuth } from "@/features/auth/context/AuthContext";
import { categoryService } from "@/features/category/service/categoryService";
import { CategoryResponse } from "@/features/category/types/category";

interface CategoryPageProps {
  params: Promise<{
    id: string;
    categoryId: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = React.use(params);
  const { id: userId, categoryId } = resolvedParams;
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("intro");
  const [isEditMode, setIsEditMode] = useState(false);
  const [introContent, setIntroContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 접근 권한 체크
  const isOwner = isLoggedIn && user && user.id?.toString() === userId;
  const canEdit = isOwner;

  // 프로젝트 데이터 가져오기 (하드코딩된 데이터 사용)
  const projectData = getProjectData(categoryId);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);

        // 방법 1: postService로 해당 카테고리의 게시글 존재 여부 확인
        try {
          await getPosts(parseInt(categoryId));
          // 게시글이 존재하면 카테고리가 유효하다고 판단
          const projectData = getProjectData(categoryId);
          setCategory({
            id: parseInt(categoryId),
            categoryTitle: projectData?.title || `프로젝트 ${categoryId}`,
            createdAt: "",
            updatedAt: "",
          });
        } catch (postError) {
          // postService도 실패하면 사용자의 카테고리 목록에서 찾기
          if (user?.id) {
            const categories = await categoryService.getCategories(user.id);
            const foundCategory = categories.find(
              (cat) => cat.id === parseInt(categoryId)
            );

            if (foundCategory) {
              setCategory(foundCategory);
            } else {
              setError("카테고리를 찾을 수 없습니다.");
            }
          } else {
            setError("사용자 정보를 확인할 수 없습니다.");
          }
        }
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
        setError("카테고리를 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, user?.id]);

  // 존재하지 않는 프로젝트인 경우 404 페이지 표시
  if (!projectData) {
    notFound();
  }

  if (loading) {
    return (
      <>
        <ProjectHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">카테고리 정보를 불러오는 중...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !category) {
    return (
      <>
        <ProjectHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              페이지를 찾을 수 없습니다
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => router.push(`/main/home/${userId}`)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </>
    );
  }

  // 편집 모드 토글
  const toggleEditMode = () => {
    if (!canEdit) {
      alert("편집 권한이 없습니다.");
      return;
    }

    setIsEditMode(!isEditMode);
    if (!isEditMode && !introContent) {
      // 편집 모드로 진입 시 빈 템플릿 설정 (최초 편집 시에만)
      setIntroContent(`# ${projectData.title}

## 프로젝트 개요
여기에 프로젝트에 대한 설명을 작성해주세요.

## 주요 기능
- 기능 1
- 기능 2
- 기능 3

## 사용 기술
- 기술 스택을 작성해주세요.

## 프로젝트 목표
- 목표를 작성해주세요.`);
    }
  };

  // 저장 기능
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const postData: CreatePostDto = {
        title: `${projectData.title} - 프로젝트 소개`,
        content: introContent,
        imageUrl: "", // 이미지 URL은 빈 문자열로 설정
      };

      await createPost(postData, projectData.categoryId);

      setIsEditMode(false);
      alert("프로젝트 소개가 저장되었습니다!");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "intro", label: "프로젝트 소개" },
    { id: "features", label: "주요 기능" },
    { id: "tech", label: "기술 스택" },
    { id: "resources", label: "자료" },
    {
      id: "post",
      label: categoryId === "1" ? "배운점 및 느낀점" : "게시글 작성",
    },
  ];

  return (
    <>
      <ProjectHeader />
      <main className="min-h-screen bg-blue-50/70">
        <div className="container mx-auto max-w-7xl px-10 -mt-8">
          <div className="bg-white p-12 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold">{projectData.title}</h1>
                <p className="text-sm text-gray-500 mt-2">
                  소유자: User {userId}
                </p>
                {!canEdit && (
                  <p className="text-sm text-orange-500">읽기 전용 모드</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                {canEdit && (
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    내 프로젝트
                  </span>
                )}
                <button
                  onClick={() => router.push(`/main/home/${userId}`)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  ← 홈으로
                </button>
              </div>
            </div>

            {/* 탭 메뉴 */}
            <div className="border-b mb-8">
              <nav className="flex gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-4 font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? "text-blue-500 border-blue-500"
                        : "text-gray-500 border-transparent hover:text-blue-500"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="prose max-w-none">
              {/* 프로젝트 소개 */}
              {activeTab === "intro" && (
                <div>
                  {/* 편집 모드 버튼 */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      프로젝트 소개
                    </h2>
                    <div className="flex gap-2">
                      {isEditMode ? (
                        <>
                          <button
                            onClick={() => setIsEditMode(false)}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isSaving}
                          >
                            취소
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                저장 중...
                              </div>
                            ) : (
                              "저장"
                            )}
                          </button>
                        </>
                      ) : (
                        canEdit && (
                          <button
                            onClick={toggleEditMode}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <div className="flex items-center gap-2">
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              편집
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* 편집 모드 */}
                  {isEditMode ? (
                    /* 편집 모드도 2:3 레이아웃 유지 */
                    <div className="grid md:grid-cols-5 gap-8 items-start">
                      {/* 편집 영역 */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            프로젝트 소개 내용 (마크다운 지원)
                          </label>
                          <textarea
                            value={introContent}
                            onChange={(e) => setIntroContent(e.target.value)}
                            className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none"
                            placeholder="마크다운 형식으로 프로젝트 소개를 작성해주세요..."
                          />
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="text-xs font-medium text-gray-700 mb-2">
                            📝 마크다운 가이드
                          </h4>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>
                              <code># 제목</code> - 대제목
                            </div>
                            <div>
                              <code>## 부제목</code> - 중간 제목
                            </div>
                            <div>
                              <code>- 항목</code> - 목록
                            </div>
                            <div>
                              <code>**굵은글씨**</code> - 굵은 텍스트
                            </div>
                            <div>
                              <code>`코드`</code> - 인라인 코드
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 동영상 플레이어 - 편집 중에도 표시 */}
                      <div className="md:col-span-3 rounded-xl overflow-hidden shadow-lg bg-gray-50">
                        {projectData.videoSrc ? (
                          // 비디오가 있는 경우
                          <div className="aspect-[16/9]">
                            <video
                              className="w-full h-full object-cover"
                              controls
                              poster={projectData.imageSrc}
                            >
                              <source
                                src={projectData.videoSrc}
                                type="video/mp4"
                              />
                              브라우저가 비디오 재생을 지원하지 않습니다.
                            </video>
                          </div>
                        ) : (
                          // 비디오가 없는 경우 플레이스홀더
                          <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
                            <div className="text-center p-8">
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
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="text-gray-500">데모 영상 준비중</p>
                            </div>
                          </div>
                        )}
                        <div className="p-4">
                          <p className="text-sm text-gray-600">
                            ▶️ {projectData.title} 데모 영상
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 읽기 모드 - 항상 동영상 플레이어와 함께 표시 */
                    <div className="grid md:grid-cols-5 gap-8 items-start">
                      {/* 텍스트 콘텐츠 영역 */}
                      <div className="md:col-span-2">
                        {introContent ? (
                          /* 저장된 내용이 있으면 표시 */
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                              {introContent}
                            </pre>
                          </div>
                        ) : (
                          /* 저장된 내용이 없으면 빈 상태 표시 */
                          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <div className="max-w-xs mx-auto">
                              <svg
                                className="w-10 h-10 text-gray-400 mx-auto mb-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <h3 className="text-base font-medium text-gray-700 mb-2">
                                프로젝트 소개가 아직 작성되지 않았습니다
                              </h3>
                              <p className="text-sm text-gray-500 mb-4">
                                {canEdit
                                  ? "편집 버튼을 클릭하여 프로젝트 소개를 작성해보세요."
                                  : "프로젝트 소개가 작성되지 않았습니다."}
                              </p>
                              {canEdit && (
                                <button
                                  onClick={toggleEditMode}
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  작성하기
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 동영상 플레이어 - 항상 표시 */}
                      <div className="md:col-span-3 rounded-xl overflow-hidden shadow-lg bg-gray-50">
                        {projectData.videoSrc ? (
                          // 비디오가 있는 경우
                          <div className="aspect-[16/9]">
                            <video
                              className="w-full h-full object-cover"
                              controls
                              poster={projectData.imageSrc}
                            >
                              <source
                                src={projectData.videoSrc}
                                type="video/mp4"
                              />
                              브라우저가 비디오 재생을 지원하지 않습니다.
                            </video>
                          </div>
                        ) : (
                          // 비디오가 없는 경우 플레이스홀더
                          <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
                            <div className="text-center p-8">
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
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="text-gray-500">데모 영상 준비중</p>
                            </div>
                          </div>
                        )}
                        <div className="p-4">
                          <p className="text-sm text-gray-600">
                            ▶️ {projectData.title} 데모 영상
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 주요 기능 */}
              {activeTab === "features" && (
                <div>
                  <ul className="space-y-6">
                    {projectData.detailedFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <svg
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d={feature.icon}
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 기술 스택 */}
              {activeTab === "tech" && (
                <div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">프론트엔드</h3>
                      <div className="flex flex-wrap gap-2">
                        {projectData.frontendTech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">백엔드</h3>
                      <div className="flex flex-wrap gap-2">
                        {projectData.backendTech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 자료 */}
              {activeTab === "resources" && (
                <div>
                  <ResourceManager projectId={`${userId}_${categoryId}`} />
                </div>
              )}

              {/* 게시글 작성 */}
              {activeTab === "post" && canEdit && (
                <div>
                  <p className="text-gray-600 mb-6">
                    이 프로젝트에 대한 게시글을 작성하고 공유해보세요.
                  </p>
                  <button
                    onClick={() => {
                      router.push(
                        `/main/post?returnTo=/main/home/${userId}/category/${categoryId}&categoryId=${projectData.categoryId}`
                      );
                    }}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    게시글 작성하기
                  </button>
                </div>
              )}

              {activeTab === "post" && !canEdit && (
                <div>
                  <p className="text-gray-600">
                    다른 사용자의 프로젝트에서는 게시글을 작성할 수 없습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
