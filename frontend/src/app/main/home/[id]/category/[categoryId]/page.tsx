"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectHeader from "@/components/ProjectHeader";
import {
  getPostByTab,
  updatePost,
  getBasicTabs,
  updateBasicTabContent,
} from "@/features/post/service/postService";
import {
  CreatePostDto,
  PostResponse,
  BasicTabDto,
} from "@/features/post/types/post";
import { useAuth } from "@/features/auth/context/AuthContext";
import { categoryService } from "@/features/category/service/categoryService";
import { CategoryResponse } from "@/features/category/types/category";
import { tabService } from "@/features/tab/service/tabService";
import { TabRes } from "@/features/tab/types/tab";
import {
  getFilesByCategory,
  uploadMainVideo,
  getMainVideoByCategory,
} from "@/features/upload/service/uploadService";
import FileUpload from "@/features/upload/components/FileUpload";

interface FileResource {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  size: number;
}

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
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // 프로젝트 소개 기본 탭 관련 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [introContent, setIntroContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 기본 탭 내용 상태
  const [basicTabs, setBasicTabs] = useState<BasicTabDto[]>([]);
  const [basicTabsLoading, setBasicTabsLoading] = useState(true);

  // 자료 기본 탭 관련 상태
  const [resources, setResources] = useState<FileResource[]>([]);
  const [isResourcesLoading, setIsResourcesLoading] = useState(true);

  // 대표 동영상 관련 상태
  const [mainVideoUrl, setMainVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // 탭 관련 상태
  const [tabs, setTabs] = useState<TabRes[]>([]);
  const [tabsLoading, setTabsLoading] = useState(true);
  const [newTabName, setNewTabName] = useState("");
  const [isAddingTab, setIsAddingTab] = useState(false);

  // 탭별 게시글 관련 상태
  const [tabPosts, setTabPosts] = useState<{
    [tabId: string]: PostResponse | null;
  }>({});
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [isSavingPost, setIsSavingPost] = useState(false);

  // 접근 권한 체크
  const isOwner = isLoggedIn && user && user.id?.toString() === userId;
  const canEdit = isOwner;

  // 프로젝트 소개 편집 모드 토글
  const toggleEditMode = () => {
    if (!canEdit) {
      return;
    }

    setIsEditMode(!isEditMode);
    if (!isEditMode && (!introContent || introContent === "빈 게시글")) {
      // 편집 모드로 진입 시 빈 템플릿 설정 (최초 편집 시 또는 빈 게시글인 경우)
      setIntroContent(`# ${category?.categoryTitle || `카테고리 ${categoryId}`}

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

  // 프로젝트 소개 저장
  const handleSave = async () => {
    if (!canEdit) {
      return;
    }

    try {
      setIsSaving(true);
      await updateBasicTabContent(parseInt(categoryId), introContent);
      setIsEditMode(false);
    } catch (error) {
      console.error("저장 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 자료 관리 함수들
  const loadResources = async () => {
    try {
      setIsResourcesLoading(true);
      // ✅ 백엔드 API에서 파일 목록 가져오기
      const fileUrls = await getFilesByCategory(parseInt(categoryId));

      // URL 목록을 FileResource 형태로 변환
      const resourcesFromApi = fileUrls.map((url, index) => {
        const fileName = url.split("/").pop() || `파일_${index + 1}`;
        return {
          id: `api_${index}`,
          name: fileName,
          url: url,
          uploadDate: new Date().toISOString(), // 실제로는 백엔드에서 날짜 정보를 받아와야 함
          size: 0, // 실제로는 백엔드에서 파일 크기 정보를 받아와야 함
        };
      });

      setResources(resourcesFromApi);
    } catch (error) {
      console.error("자료 로딩 실패:", error);
      setResources([]);
    } finally {
      setIsResourcesLoading(false);
    }
  };

  const handleUploadSuccess = async (url: string, fileName: string) => {
    const newResource: FileResource = {
      id: `new_${Date.now()}`,
      name: fileName,
      url: url,
      uploadDate: new Date().toISOString(),
      size: 0, // 실제로는 백엔드에서 파일 크기 정보를 받아와야 함
    };

    // 새 파일을 목록에 즉시 추가
    setResources((prev) => [newResource, ...prev]);

    // 선택적으로 전체 목록을 다시 로드하여 서버와 동기화
    setTimeout(() => {
      loadResources();
    }, 1000);
  };

  const handleDeleteResource = (id: string) => {
    const updatedResources = resources.filter((resource) => resource.id !== id);
    setResources(updatedResources);
    // TODO: 실제 백엔드 API로 파일 삭제 구현 필요
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "알 수 없음";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 대표 동영상 업로드 처리
  const handleMainVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !canEdit) return;

    // 동영상 파일 검증
    if (!file.type.startsWith("video/")) {
      console.warn("동영상 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (100MB)
    if (file.size > 100 * 1024 * 1024) {
      console.warn("파일 크기는 100MB 이하여야 합니다.");
      return;
    }

    try {
      setIsUploadingVideo(true);
      console.log(
        `동영상 업로드 시작: ${file.name} (${(file.size / 1024 / 1024).toFixed(
          2
        )}MB)`
      );

      const videoUrl = await uploadMainVideo(file, parseInt(categoryId));
      setMainVideoUrl(videoUrl);

      console.log("대표 동영상 업로드 완료");
    } catch (error) {
      console.error("대표 동영상 업로드 실패:", error);

      // 구체적인 오류 메시지 로깅
      if (error instanceof Error) {
        console.error("오류 상세:", error.message);
      }
    } finally {
      setIsUploadingVideo(false);
      // 파일 입력 초기화
      event.target.value = "";
    }
  };

  // 탭 데이터 가져오기 함수
  const fetchTabs = async () => {
    try {
      setTabsLoading(true);
      console.log(`카테고리 ${categoryId}의 탭 목록을 조회합니다.`);

      const tabsData = await tabService.getTabs(parseInt(categoryId));
      console.log(`탭 조회 결과: ${tabsData.length}개`);

      setTabs(tabsData);

      // 기본적으로 "프로젝트 소개" 탭을 활성화
      setActiveTab("intro");
      console.log("프로젝트 소개 탭 활성화");
    } catch (error) {
      console.error("탭 목록 조회 실패:", error);
      // 에러가 발생해도 빈 배열로 설정하여 UI가 정상적으로 표시되도록 함
      setTabs([]);
      setActiveTab("intro"); // 에러가 발생해도 기본 탭은 활성화

      // 사용자에게 알림 (console로만, UI 방해하지 않음)
      console.warn(
        "탭 목록을 불러올 수 없습니다. 새 탭을 추가하여 시작해보세요."
      );
    } finally {
      setTabsLoading(false);
    }
  };

  // 새 탭 추가 함수
  const handleAddTab = async () => {
    if (!newTabName.trim() || !canEdit) {
      return;
    }

    try {
      setIsAddingTab(true);
      await tabService.createTab(
        { tabName: newTabName.trim() },
        parseInt(categoryId)
      );
      setNewTabName("");
      await fetchTabs(); // 탭 목록 다시 불러오기
    } catch (error) {
      console.error("탭 추가 실패:", error);
    } finally {
      setIsAddingTab(false);
    }
  };

  // 탭별 게시글 가져오기
  const fetchTabPost = async (tabId: number) => {
    try {
      console.log(`탭 ${tabId}의 게시글을 조회합니다.`);
      const post = await getPostByTab(tabId);

      setTabPosts((prev) => ({
        ...prev,
        [tabId.toString()]: post, // post는 null일 수 있음
      }));

      if (post) {
        console.log(`탭 ${tabId}의 게시글 조회 성공: ${post.title}`);
      } else {
        console.log(`탭 ${tabId}에 게시글이 없습니다.`);
      }
    } catch (error) {
      console.error("탭 게시글 조회 실패:", error);
      // 에러가 발생한 경우 null로 설정
      setTabPosts((prev) => ({
        ...prev,
        [tabId.toString()]: null,
      }));
    }
  };

  // 탭 게시글 편집 시작
  const startEditingTabPost = async (tabId: string) => {
    const existingPost = tabPosts[parseInt(tabId)];
    if (
      existingPost &&
      (existingPost.title.trim() || existingPost.content.trim())
    ) {
      // 기존 내용이 있으면 로드
      setPostTitle(existingPost.title || "");
      setPostContent(existingPost.content || "");
      console.log(`기존 게시글 편집 모드 - tabId: ${tabId}`);
    } else {
      // 내용이 없으면 기본 제목으로 시작
      setPostTitle(
        `${tabs.find((t) => t.id.toString() === tabId)?.tabName || "탭"} 내용`
      );
      setPostContent("");
      console.log(`빈 게시글 편집 모드 - tabId: ${tabId}`);
    }
    setEditingTab(tabId);
  };

  // 탭 게시글 저장 (수정만)
  const saveTabPost = async () => {
    if (!editingTab || !canEdit) return;

    try {
      setIsSavingPost(true);

      const postData = {
        title:
          postTitle.trim() ||
          `${
            tabs.find((t) => t.id.toString() === editingTab)?.tabName || "탭"
          } 내용`,
        content: postContent,
        imageUrl: "",
      };

      const tabId = parseInt(editingTab);

      // 항상 수정 API 사용 (탭 생성 시 post가 자동으로 생성되므로)
      console.log(`게시글 수정 - tabId: ${tabId}`);
      await updatePost(postData, tabId);

      // 게시글 저장 후 해당 탭의 게시글 다시 가져오기
      await fetchTabPost(tabId);

      setEditingTab(null);
      setPostTitle("");
      setPostContent("");
    } catch (error) {
      console.error("게시글 저장 실패:", error);
    } finally {
      setIsSavingPost(false);
    }
  };

  // 편집 취소
  const cancelEditingTabPost = () => {
    setEditingTab(null);
    setPostTitle("");
    setPostContent("");
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null); // 에러 상태 초기화

        // URL의 userId를 사용하여 카테고리 조회 (인증 불필요)
        const categories = await categoryService.getCategories(
          parseInt(userId)
        );
        const foundCategory = categories.find(
          (cat) => cat.id === parseInt(categoryId)
        );

        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          setError("카테고리를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
        setError("카테고리를 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, userId]);

  // 기본 탭 내용 불러오기
  useEffect(() => {
    const loadBasicTabs = async () => {
      try {
        setBasicTabsLoading(true);
        const basicTabData = await getBasicTabs(parseInt(categoryId));
        setBasicTabs([basicTabData]); // 단일 객체를 배열로 래핑

        // 첫 번째 기본 탭 내용을 프로젝트 소개에 사용
        if (
          basicTabData.basicContent1 &&
          basicTabData.basicContent1 !== "빈 게시글"
        ) {
          setIntroContent(basicTabData.basicContent1);
        }
      } catch (error) {
        console.error("기본 탭 내용 조회 실패:", error);
      } finally {
        setBasicTabsLoading(false);
      }
    };

    if (categoryId) {
      loadBasicTabs();
    }
  }, [categoryId]);

  // 자료 목록 불러오기
  useEffect(() => {
    if (categoryId) {
      loadResources();
    }
  }, [categoryId]);

  // 대표 동영상 불러오기
  useEffect(() => {
    const loadMainVideo = async () => {
      try {
        setIsVideoLoading(true);
        const videoUrl = await getMainVideoByCategory(parseInt(categoryId));
        if (videoUrl) {
          setMainVideoUrl(videoUrl);
        }
      } catch (error) {
        console.error("대표 동영상 조회 실패:", error);
        // 에러 시 동영상 없음으로 처리
      } finally {
        setIsVideoLoading(false);
      }
    };

    if (categoryId) {
      loadMainVideo();
    }
  }, [categoryId]);

  // 탭 데이터 가져오기
  useEffect(() => {
    // 카테고리가 성공적으로 로드된 후에만 탭 데이터 가져오기
    if (categoryId && category) {
      fetchTabs();
    }
  }, [categoryId, category]);

  // 탭이 로드되면 첫 번째 탭을 자동으로 선택
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].id.toString());
    }
  }, [tabs, activeTab]);

  // 활성 탭이 변경될 때 해당 탭의 게시글 가져오기
  useEffect(() => {
    if (activeTab && tabs.length > 0) {
      const currentTab = tabs.find((tab) => tab.id.toString() === activeTab);
      if (currentTab) {
        fetchTabPost(currentTab.id);
      }
    }
  }, [activeTab, tabs]);

  // 카테고리 정보가 로딩 중인 경우
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

  // 카테고리 삭제 기능
  const handleDeleteCategory = async () => {
    if (!canEdit) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    const confirmDelete = window.confirm(
      `정말로 "${
        category?.categoryTitle || `카테고리 ${categoryId}`
      }"을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );

    if (!confirmDelete) return;

    try {
      await categoryService.deleteCategory(parseInt(categoryId));
      alert("카테고리가 성공적으로 삭제되었습니다.");
      router.push(`/main/home/${userId}`);
    } catch (error) {
      console.error("카테고리 삭제 실패:", error);
      alert("카테고리 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 모든 탭 결합 (기본 탭 + 사용자 생성 탭)
  const allTabs = [
    { id: "intro", label: "프로젝트 소개", isCustom: false },
    { id: "resources", label: "자료", isCustom: false },
    ...tabs.map((tab) => ({
      id: tab.id.toString(),
      label: tab.tabName,
      isCustom: true,
    })),
  ];

  return (
    <>
      <ProjectHeader />
      <main className="min-h-screen bg-blue-50/70">
        <div className="container mx-auto max-w-7xl px-10 -mt-8">
          <div className="bg-white p-12 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold">
                  {category?.categoryTitle || `카테고리 ${categoryId}`}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                {canEdit && (
                  <button
                    onClick={handleDeleteCategory}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    삭제
                  </button>
                )}
              </div>
            </div>

            {/* 탭 메뉴 */}
            <div className="border-b mb-8">
              <div className="flex justify-between items-center mb-4">
                <nav className="flex gap-4 flex-wrap">
                  {tabsLoading
                    ? // 탭 로딩 중
                      Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-10 w-20 bg-gray-200 rounded animate-pulse"
                        ></div>
                      ))
                    : allTabs.map((tab) => (
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

                {/* 탭 추가 기능 */}
                {canEdit && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTabName}
                      onChange={(e) => setNewTabName(e.target.value)}
                      placeholder="새 탭 이름"
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddTab();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddTab}
                      disabled={isAddingTab || !newTabName.trim()}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingTab ? "추가 중..." : "탭 추가"}
                    </button>
                  </div>
                )}
              </div>
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
                      <div className="md:col-span-3 rounded-xl overflow-hidden shadow-lg bg-gray-50 relative">
                        {isVideoLoading ? (
                          <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          </div>
                        ) : mainVideoUrl ? (
                          <div className="aspect-[16/9]">
                            <video
                              className="w-full h-full object-cover"
                              controls
                            >
                              <source src={mainVideoUrl} type="video/mp4" />
                              <source src={mainVideoUrl} type="video/webm" />
                              <source src={mainVideoUrl} type="video/mov" />
                              브라우저가 비디오 재생을 지원하지 않습니다.
                            </video>
                          </div>
                        ) : (
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
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="text-gray-500">데모 영상 준비중</p>
                              {canEdit && (
                                <p className="text-xs text-gray-400 mt-2">
                                  아래 업로드 버튼을 클릭하여 동영상을
                                  추가하세요
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 동영상 업로드 버튼 (편집 모드에서만 표시) */}
                        {canEdit && (
                          <div className="absolute top-2 right-2">
                            <label
                              htmlFor="main-video-upload"
                              className="cursor-pointer"
                            >
                              <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                                {isUploadingVideo ? (
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
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                  </svg>
                                )}
                              </div>
                            </label>
                          </div>
                        )}

                        <div className="p-4">
                          <p className="text-sm text-gray-600">
                            ▶️{" "}
                            {category?.categoryTitle ||
                              `카테고리 ${categoryId}`}{" "}
                            데모 영상
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 읽기 모드 - 항상 동영상 플레이어와 함께 표시 */
                    <div className="grid md:grid-cols-5 gap-8 items-start">
                      {/* 텍스트 콘텐츠 영역 */}
                      <div className="md:col-span-2">
                        {basicTabsLoading ? (
                          /* 기본 탭 로딩 중 */
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="animate-pulse space-y-4">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                          </div>
                        ) : introContent && introContent !== "빈 게시글" ? (
                          /* 저장된 내용이 있으면 표시 */
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="prose max-w-none">
                              <pre className="whitespace-pre-wrap text-gray-700 text-base leading-relaxed">
                                {introContent}
                              </pre>
                            </div>
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
                      <div className="md:col-span-3 rounded-xl overflow-hidden shadow-lg bg-gray-50 relative">
                        {isVideoLoading ? (
                          <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          </div>
                        ) : mainVideoUrl ? (
                          <div className="aspect-[16/9]">
                            <video
                              className="w-full h-full object-cover"
                              controls
                            >
                              <source src={mainVideoUrl} type="video/mp4" />
                              <source src={mainVideoUrl} type="video/webm" />
                              <source src={mainVideoUrl} type="video/mov" />
                              브라우저가 비디오 재생을 지원하지 않습니다.
                            </video>
                          </div>
                        ) : (
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

                        {/* 동영상 업로드 버튼 (편집 권한이 있을 때만 표시) */}
                        {canEdit && (
                          <div className="absolute top-2 right-2">
                            <label
                              htmlFor="main-video-upload"
                              className="cursor-pointer"
                            >
                              <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                                {isUploadingVideo ? (
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
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                  </svg>
                                )}
                              </div>
                            </label>
                          </div>
                        )}

                        <div className="p-4">
                          <p className="text-sm text-gray-600">
                            ▶️{" "}
                            {category?.categoryTitle ||
                              `카테고리 ${categoryId}`}{" "}
                            데모 영상
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 숨겨진 파일 입력 (프로젝트 소개 탭용) */}
              {canEdit && (
                <input
                  id="main-video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleMainVideoUpload}
                  className="hidden"
                  disabled={isUploadingVideo}
                />
              )}

              {/* 자료 */}
              {activeTab === "resources" && (
                <div>
                  {/* 자료 탭 헤더 */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      자료
                    </h2>
                  </div>

                  {/* 전체 폭 사용 */}
                  <div className="space-y-6">
                    {/* 파일 업로드 섹션 */}
                    {canEdit && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          새 자료 업로드
                        </h3>
                        <FileUpload
                          onUploadSuccess={handleUploadSuccess}
                          categoryId={parseInt(categoryId)} // ✅ categoryId 전달
                          allowedTypes={[
                            ".pdf",
                            ".doc",
                            ".docx",
                            ".ppt",
                            ".pptx",
                            ".xls",
                            ".xlsx",
                            ".txt",
                            ".zip",
                            ".rar",
                          ]}
                          maxSizeMB={50}
                        />
                      </div>
                    )}

                    {/* 자료 목록 섹션 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        업로드된 자료
                      </h3>

                      {isResourcesLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      ) : resources.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <p>업로드된 자료가 없습니다.</p>
                          {canEdit && (
                            <p className="text-sm">
                              위의 업로드 영역을 사용하여 자료를 추가해보세요.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {resources.map((resource) => (
                            <div
                              key={resource.id}
                              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                  <svg
                                    className="h-8 w-8 text-blue-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                  <div className="flex-1 min-w-0">
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block"
                                    >
                                      <h4 className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer truncate">
                                        {resource.name}
                                      </h4>
                                    </a>
                                    <p className="text-sm text-gray-500">
                                      {formatDate(resource.uploadDate)} •{" "}
                                      {formatFileSize(resource.size)}
                                    </p>
                                  </div>
                                </div>
                                {canEdit && (
                                  <div className="ml-4">
                                    <button
                                      onClick={() =>
                                        handleDeleteResource(resource.id)
                                      }
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                                    >
                                      <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                      삭제
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 사용자 생성 탭들 */}
              {tabs.map(
                (tab) =>
                  activeTab === tab.id.toString() && (
                    <div key={tab.id}>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {tab.tabName}
                        </h2>
                        {canEdit && (
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
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
                          </div>
                        )}
                      </div>

                      {/* 탭 컨텐츠 */}
                      <div className="min-h-[300px] p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <div className="text-center">
                          {/* 게시글 편집 영역 */}
                          {editingTab === tab.id.toString() ? (
                            <div className="max-w-2xl mx-auto">
                              <h3 className="text-lg font-medium text-gray-900 mb-4">
                                게시글 편집
                              </h3>

                              <div className="space-y-4 text-left">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    제목
                                  </label>
                                  <input
                                    type="text"
                                    value={postTitle}
                                    onChange={(e) =>
                                      setPostTitle(e.target.value)
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="게시글 제목을 입력하세요"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    내용
                                  </label>
                                  <textarea
                                    value={postContent}
                                    onChange={(e) =>
                                      setPostContent(e.target.value)
                                    }
                                    rows={10}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="게시글 내용을 입력하세요"
                                  />
                                </div>

                                <div className="flex space-x-2 justify-center">
                                  <button
                                    onClick={saveTabPost}
                                    disabled={isSavingPost}
                                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                                  >
                                    {isSavingPost ? "저장 중..." : "저장"}
                                  </button>
                                  <button
                                    onClick={cancelEditingTabPost}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                  >
                                    취소
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* 게시글이 있고 내용이 있는 경우 */}
                              {tabPosts[tab.id] &&
                              (tabPosts[tab.id]!.title.trim() ||
                                tabPosts[tab.id]!.content.trim()) ? (
                                <div className="max-w-2xl mx-auto text-left">
                                  <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                      {tabPosts[tab.id]!.title ||
                                        `${tab.tabName} 내용`}
                                    </h3>
                                    {canEdit && (
                                      <button
                                        onClick={() =>
                                          startEditingTabPost(tab.id.toString())
                                        }
                                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                      >
                                        편집
                                      </button>
                                    )}
                                  </div>

                                  <div className="prose max-w-none">
                                    <pre className="whitespace-pre-wrap text-gray-700">
                                      {tabPosts[tab.id]!.content ||
                                        "내용이 없습니다."}
                                    </pre>
                                  </div>

                                  {tabPosts[tab.id]!.createdAt && (
                                    <p className="text-sm text-gray-500 mt-4">
                                      작성일:{" "}
                                      {new Date(
                                        tabPosts[tab.id]!.createdAt!
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                /* 게시글이 없거나 내용이 비어있는 경우 */
                                <div>
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
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {tab.tabName} 컨텐츠
                                  </h3>
                                  <p className="text-gray-500 mb-4">
                                    이 탭의 내용을 편집해보세요.
                                  </p>
                                  {canEdit && (
                                    <button
                                      onClick={() =>
                                        startEditingTabPost(tab.id.toString())
                                      }
                                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                      편집하기
                                    </button>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
