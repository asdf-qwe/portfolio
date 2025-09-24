"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ProjectHeader from "@/components/ProjectHeader";
import {
  getPostByTab,
  updatePost,
  createPost,
  getIntroduce,
  createIntroduce,
  updateIntroduce,
} from "@/features/post/service/postService";
import { PostResponse } from "@/features/post/types/post";
import {
  IntroduceResponse,
  CreateIntroduce,
} from "@/features/main/type/introduce";
import { useAuth } from "@/features/auth/context/AuthContext";
import { categoryService } from "@/features/category/service/categoryService";
import { CategoryResponse } from "@/features/category/types/category";
import { tabService } from "@/features/tab/service/tabService";
import { TabRes } from "@/features/tab/types/tab";
import {
  getFilesByCategory,
  uploadMainVideo,
  getMainVideoByCategory,
  deleteFile,
  FileResource,
} from "@/features/upload/service/uploadService";
import FileUpload from "@/features/upload/components/FileUpload";
import ReactMarkdown from "react-markdown";
import MDEditor from "@uiw/react-md-editor";

// 상수 정의
const CONSTANTS = {
  MAX_VIDEO_SIZE_MB: 100,
  LOADING_SPINNER_SIZE: {
    SMALL: "h-4 w-4",
    MEDIUM: "h-8 w-8",
    LARGE: "h-32 w-32",
  },
  COLORS: {
    BLUE: "bg-blue-500 hover:bg-blue-600",
    GREEN: "bg-green-500 hover:bg-green-600",
    YELLOW: "bg-yellow-500 hover:bg-yellow-600",
    GRAY: "bg-gray-500 hover:bg-gray-600",
    RED: "bg-red-100 hover:bg-red-200 text-red-600",
  },
  ICON_SIZE: {
    SMALL: "w-4 h-4",
    MEDIUM: "w-10 h-10",
    LARGE: "w-16 h-16",
  },
  GRID_COLS: "md:grid-cols-5",
  ASPECT_RATIO: "aspect-[16/9]",
  FILE_TYPES: [
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
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
  ] as string[],
} as const;

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

  // 프로젝트 소개 introduce API 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [introduce, setIntroduce] = useState<IntroduceResponse | null>(null);
  const [introduceExists, setIntroduceExists] = useState(false); // introduce 존재 여부
  const [isSaving, setIsSaving] = useState(false);
  const [introLoading, setIntroLoading] = useState(true);

  // 제목 편집용 상태 (isEditMode와 함께 사용)
  const [editCategoryTitle, setEditCategoryTitle] = useState("");

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

  // 슬래시 메뉴 옵션들
  const slashMenuOptions = [
    { label: "제목 1", value: "# ", icon: "H1" },
    { label: "제목 2", value: "## ", icon: "H2" },
    { label: "제목 3", value: "### ", icon: "H3" },
    { label: "굵은 글씨", value: "**텍스트**", icon: "B" },
    { label: "기울임 글씨", value: "*텍스트*", icon: "I" },
    { label: "목록", value: "- ", icon: "•" },
    { label: "번호 목록", value: "1. ", icon: "1." },
    { label: "코드 블록", value: "```\n코드\n```", icon: "</>" },
    { label: "인라인 코드", value: "`코드`", icon: "`" },
    { label: "링크", value: "[링크 텍스트](URL)", icon: "🔗" },
  ];

  // 에디터 ref들
  const introEditorRef = useRef<HTMLDivElement | null>(null);
  const tabEditorRef = useRef<HTMLDivElement | null>(null);

  // 슬래시 명령어 드롭다운 상태
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [currentEditor, setCurrentEditor] = useState<"intro" | "tab" | null>(
    null
  );
  const [previousContent, setPreviousContent] = useState("");

  // 슬래시 메뉴 핸들러 함수들
  const handleSlashMenuSelect = (
    option: (typeof slashMenuOptions)[0],
    editorType: "intro" | "tab"
  ) => {
    if (editorType === "intro" && introduce) {
      // 프로젝트 소개 에디터용 - "/"를 선택된 옵션으로 교체
      const currentContent = introduce.content || "";
      const lastSlashIndex = currentContent.lastIndexOf("/");
      if (lastSlashIndex !== -1) {
        const newContent =
          currentContent.substring(0, lastSlashIndex) +
          option.value +
          currentContent.substring(lastSlashIndex + 1);
        setIntroduce((prev) =>
          prev ? { ...prev, content: newContent } : null
        );
        setPreviousContent(newContent);
        // 선택 후 에디터에 포커스 - 교체 위치 바로 다음으로 커서 이동
        const cursorPosition = lastSlashIndex + option.value.length;
        setTimeout(
          (cursorPos) => {
            const textareas = document.querySelectorAll("textarea");
            // 현재 에디터 타입에 맞는 textarea 찾기
            for (const textarea of textareas) {
              if (textarea.offsetParent !== null) {
                // visible textarea
                textarea.focus();
                textarea.setSelectionRange(cursorPos, cursorPos);
                break;
              }
            }
          },
          100,
          cursorPosition
        );
      }
    } else if (editorType === "tab") {
      // 탭 게시글 에디터용 - "/"를 선택된 옵션으로 교체
      const lastSlashIndex = postContent.lastIndexOf("/");
      if (lastSlashIndex !== -1) {
        const newContent =
          postContent.substring(0, lastSlashIndex) +
          option.value +
          postContent.substring(lastSlashIndex + 1);
        setPostContent(newContent);
        setPreviousContent(newContent);
        // 선택 후 에디터에 포커스 - 교체 위치 바로 다음으로 커서 이동
        const cursorPosition = lastSlashIndex + option.value.length;
        setTimeout(
          (cursorPos) => {
            const textareas = document.querySelectorAll("textarea");
            // 현재 에디터 타입에 맞는 textarea 찾기
            for (const textarea of textareas) {
              if (textarea.offsetParent !== null) {
                // visible textarea
                textarea.focus();
                textarea.setSelectionRange(cursorPos, cursorPos);
                break;
              }
            }
          },
          100,
          cursorPosition
        );
      }
    }
    setShowSlashMenu(false);
  };

  const handleEditorChange = (
    value: string | undefined,
    editorType: "intro" | "tab"
  ) => {
    const content = value || "";

    // 슬래시 입력 감지 - content에 "/"가 처음 나타날 때
    if (
      content.includes("/") &&
      !previousContent.includes("/") &&
      !showSlashMenu
    ) {
      // 커서 위치 계산 (간단한 구현)
      const textarea = document.activeElement as HTMLTextAreaElement;
      if (textarea) {
        const rect = textarea.getBoundingClientRect();
        setSlashMenuPosition({
          top: rect.top + rect.height + 5,
          left: rect.left,
        });
        setCurrentEditor(editorType);
        setShowSlashMenu(true);
      }
    } else if (!content.includes("/") && showSlashMenu) {
      setShowSlashMenu(false);
    }

    // previousContent 업데이트
    setPreviousContent(content);

    // 기존 onChange 로직
    if (editorType === "intro") {
      setIntroduce((prev) =>
        prev
          ? { ...prev, content }
          : {
              title: category?.categoryTitle || `카테고리 ${categoryId}`,
              content,
            }
      );
    } else if (editorType === "tab") {
      setPostContent(content);
    }
  };
  // 탭별 게시글 관련 상태
  const [tabPosts, setTabPosts] = useState<{
    [tabId: string]: PostResponse | null;
  }>({});
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [postContent, setPostContent] = useState("");
  const [isSavingPost, setIsSavingPost] = useState(false);

  // 파일이 이미지인지 확인하는 함수
  const isImageFile = (fileName: string | null | undefined) => {
    if (!fileName || typeof fileName !== "string") return false;
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".svg",
    ];
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) return false;
    const extension = fileName.toLowerCase().substring(lastDotIndex);
    return imageExtensions.includes(extension);
  };

  // 링크를 클릭 가능하게 변환하는 함수
  const parseLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const html = text.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${url}</a>`
    );
    return html;
  };

  // 접근 권한 체크
  const isOwner = isLoggedIn && user && user.id?.toString() === userId;
  const canEdit = isOwner;

  // 프로젝트 소개 편집 모드 토글
  const toggleEditMode = () => {
    if (!canEdit) {
      return;
    }

    if (!isEditMode) {
      // 편집 모드 진입 시
      setEditCategoryTitle(category?.categoryTitle || "");
      setIsEditMode(true);

      // introduce가 없으면 템플릿 세팅
      if (!introduce || !introduce.content) {
        setIntroduce({
          title: category?.categoryTitle || `카테고리 ${categoryId}`,
          content: `## 프로젝트 개요\n여기에 프로젝트에 대한 설명을 작성해주세요.\n\n## 주요 기능\n- 기능 1\n- 기능 2\n- 기능 3\n\n## 사용 기술\n- 기술 스택을 작성해주세요.\n\n## 프로젝트 목표\n- 목표를 작성해주세요.`,
        });
      }
    } else {
      // 편집 모드 종료
      setIsEditMode(false);
      setEditCategoryTitle("");
    }
  };

  // 전역 편집 모드 토글
  // 프로젝트 소개 저장 (introduce API)
  const handleSave = async () => {
    if (!canEdit || !introduce) return;

    try {
      setIsSaving(true);

      // 제목이 변경된 경우 카테고리 제목도 업데이트
      if (
        editCategoryTitle.trim() &&
        editCategoryTitle !== category?.categoryTitle
      ) {
        setCategory((prev) =>
          prev ? { ...prev, categoryTitle: editCategoryTitle } : null
        );
      }
      const titleToUse =
        editCategoryTitle.trim() ||
        category?.categoryTitle ||
        `카테고리 ${categoryId}`;

      if (introduceExists) {
        await updateIntroduce(
          {
            title: titleToUse,
            content: introduce.content,
          },
          parseInt(categoryId)
        );
      } else {
        await createIntroduce(
          {
            title: titleToUse,
            content: introduce.content,
          },
          parseInt(categoryId)
        );
        setIntroduceExists(true);
      }
      setIsEditMode(false);
      setEditCategoryTitle("");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  // 자료 관리 함수들
  const loadResources = useCallback(async () => {
    try {
      setIsResourcesLoading(true);
      const resourcesFromApi = await getFilesByCategory(parseInt(categoryId));

      setResources(resourcesFromApi);
    } catch (error) {
      console.error("자료 로딩 실패:", error);
      setResources([]);
    } finally {
      setIsResourcesLoading(false);
    }
  }, [categoryId]);

  const handleUploadSuccess = async (url: string, fileName: string) => {
    // 업로드 성공 시 목록을 클리어하고 로딩 상태로 전환
    setResources([]);
    setIsResourcesLoading(true);

    // 서버에서 최신 데이터 다시 로드
    await loadResources();
  };

  const handleDeleteResource = async (id: string) => {
    if (!canEdit) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    const confirmDelete = window.confirm(
      "정말로 이 자료를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다."
    );
    if (!confirmDelete) return;

    try {
      await deleteFile(parseInt(id));
      // 삭제 성공 시 로컬 상태 업데이트
      const updatedResources = resources.filter(
        (resource) => resource.id !== id
      );
      setResources(updatedResources);
    } catch (error) {
      console.error("자료 삭제 실패:", error);
      alert("자료 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const formatFileSize = (bytes: number | undefined | null) => {
    if (!bytes || bytes === 0 || isNaN(bytes)) return "알 수 없음";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "알 수 없음";
    try {
      return new Date(dateString).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "알 수 없음";
    }
  };

  // 대표 동영상 업로드 처리
  const handleMainVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !canEdit) return;

    // 동영상 파일 검증
    if (!file.type.startsWith("video/")) {
      return;
    }

    // 파일 크기 검증
    if (file.size > CONSTANTS.MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      return;
    }

    try {
      setIsUploadingVideo(true);

      const videoUrl = await uploadMainVideo(file, parseInt(categoryId));
      setMainVideoUrl(videoUrl);
    } catch (error) {
      // 동영상 업로드 실패 처리
    } finally {
      setIsUploadingVideo(false);
      // 파일 입력 초기화
      event.target.value = "";
    }
  };

  // 탭 데이터 가져오기 함수
  const fetchTabs = useCallback(async () => {
    try {
      setTabsLoading(true);

      const tabsData = await tabService.getTabs(parseInt(categoryId));

      setTabs(tabsData);

      // 기본적으로 "프로젝트 소개" 탭을 활성화
      setActiveTab("intro");
    } catch (error) {
      // 에러가 발생해도 빈 배열로 설정하여 UI가 정상적으로 표시되도록 함
      setTabs([]);
      setActiveTab("intro"); // 에러가 발생해도 기본 탭은 활성화
    } finally {
      setTabsLoading(false);
    }
  }, [categoryId]);

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
      const post = await getPostByTab(tabId);

      setTabPosts((prev) => ({
        ...prev,
        [tabId.toString()]: post, // post는 null일 수 있음
      }));
    } catch (error) {
      console.error("탭 게시글 조회 실패:", error);
      setTabPosts((prev) => ({
        ...prev,
        [tabId.toString()]: null,
      }));
    }
  };

  // 탭 게시글 편집 시작
  const startEditingTabPost = async (tabId: string) => {
    const existingPost = tabPosts[parseInt(tabId)];
    if (existingPost && existingPost.content && existingPost.content.trim()) {
      // 기존 내용이 있으면 로드
      setPostContent(existingPost.content);
    } else {
      // 내용이 없으면 빈 내용으로 시작
      setPostContent("");
    }
    setEditingTab(tabId);
  };

  // 탭 게시글 저장 (수정만)
  const saveTabPost = async () => {
    if (!editingTab || !canEdit) return;

    try {
      setIsSavingPost(true);

      const postData = {
        content: postContent,
        imageUrl: "",
      };

      const tabId = parseInt(editingTab);
      const existingPost = tabPosts[tabId];

      // 게시글이 존재하면 수정, 없으면 생성
      if (existingPost) {
        // 기존 게시글이 있으면 수정 API 사용
        await updatePost(postData, tabId);
      } else {
        // 게시글이 없으면 생성 API 사용
        await createPost(postData, parseInt(categoryId), tabId);
      }

      // 게시글 저장 후 해당 탭의 게시글 다시 가져오기
      await fetchTabPost(tabId);

      setEditingTab(null);
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
    setPostContent("");
  };

  // 탭 게시글 콘텐츠 렌더링 함수
  const renderTabPostContent = (tab: TabRes) => {
    const tabId = tab.id.toString();
    const post = tabPosts[tab.id];
    const hasContent = post && post.content && post.content.trim();

    if (editingTab === tabId) {
      return (
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            게시글 편집
          </h3>

          <div className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <MDEditor
                ref={tabEditorRef}
                value={postContent}
                onChange={(value) => handleEditorChange(value, "tab")}
                preview="edit"
                hideToolbar={false}
                visibleDragbar={false}
                className="border border-gray-300 rounded-lg"
                height={300}
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
      );
    }

    if (hasContent) {
      return (
        <div className="max-w-none">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-800">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono text-gray-800">
                      {children}
                    </pre>
                  ),
                }}
              >
                {post?.content || "내용이 없습니다."}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
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
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {tab.tabName} 컨텐츠
          </h3>
          <p className="text-gray-500 text-sm">아직 작성된 내용이 없습니다.</p>
        </div>
      </div>
    );
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

  // introduce 데이터 불러오기
  useEffect(() => {
    const loadIntroduce = async () => {
      try {
        setIntroLoading(true);
        const introduceData = await getIntroduce(parseInt(categoryId));

        // introduce 데이터가 있으면 설정
        if (introduceData && introduceData.title && introduceData.content) {
          setIntroduce({
            title: introduceData.title,
            content: introduceData.content,
          });
          setIntroduceExists(true);
        } else {
          // introduce 데이터가 없으면 기본값 설정 (null 또는 빈 데이터)
          setIntroduce({
            title: category?.categoryTitle || `카테고리 ${categoryId}`,
            content: "빈 게시글",
          });
          setIntroduceExists(false);
        }
      } catch (error) {
        // 예상치 못한 에러만 처리 (네트워크 에러나 서버 에러)
        console.error("introduce 데이터 조회 실패:", error);
        setIntroduce({
          title: category?.categoryTitle || `카테고리 ${categoryId}`,
          content: "빈 게시글",
        });
        setIntroduceExists(false);
      } finally {
        setIntroLoading(false);
      }
    };

    if (categoryId) {
      loadIntroduce();
    }
  }, [categoryId, category?.categoryTitle]);

  // 자료 목록 불러오기
  useEffect(() => {
    if (categoryId) {
      loadResources();
    }
  }, [categoryId, loadResources]);

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
  }, [categoryId, category, fetchTabs]);

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
            <div
              className={`animate-spin rounded-full ${CONSTANTS.LOADING_SPINNER_SIZE.LARGE} border-b-2 border-blue-500 mx-auto`}
            ></div>
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
              onClick={() => router.push(`/pof-1/${userId}`)}
              className={`px-6 py-2 ${CONSTANTS.COLORS.BLUE} text-white rounded-lg`}
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
      router.push(`/pof-1/${userId}`);
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
              <div className="flex-1 mr-4">
                {isEditMode ? (
                  <input
                    type="text"
                    value={editCategoryTitle}
                    onChange={(e) => setEditCategoryTitle(e.target.value)}
                    className="text-4xl font-bold bg-white border-2 border-blue-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="카테고리 제목을 입력해주세요..."
                  />
                ) : (
                  <h1 className="text-4xl font-bold">
                    {category?.categoryTitle || `카테고리 ${categoryId}`}
                  </h1>
                )}
              </div>
              <div className="flex items-center gap-4">
                {canEdit && !isEditMode && (
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
                          <MDEditor
                            ref={introEditorRef}
                            value={introduce?.content || ""}
                            onChange={(value) =>
                              handleEditorChange(value, "intro")
                            }
                            preview="edit"
                            hideToolbar={false}
                            visibleDragbar={false}
                            className="border border-gray-300 rounded-lg"
                            height={320}
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
                        {introLoading ? (
                          /* introduce 로딩 중 */
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="animate-pulse space-y-4">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                          </div>
                        ) : introduce?.content ? (
                          /* 저장된 내용이 있으면 표시 */
                          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="prose prose-lg max-w-none">
                              <div
                                className="text-gray-800 leading-relaxed font-['system-ui','Segoe_UI','Roboto','Helvetica_Neue','Arial','Noto_Sans','sans-serif'] text-[15px] tracking-wide"
                                style={{ lineHeight: "1.8" }}
                              >
                                <ReactMarkdown
                                  components={{
                                    h1: ({ children }) => (
                                      <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900">
                                        {children}
                                      </h1>
                                    ),
                                    h2: ({ children }) => (
                                      <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-800">
                                        {children}
                                      </h2>
                                    ),
                                    h3: ({ children }) => (
                                      <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800">
                                        {children}
                                      </h3>
                                    ),
                                    p: ({ children }) => (
                                      <p className="mb-4 text-gray-700 leading-relaxed">
                                        {children}
                                      </p>
                                    ),
                                    ul: ({ children }) => (
                                      <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
                                        {children}
                                      </ul>
                                    ),
                                    ol: ({ children }) => (
                                      <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">
                                        {children}
                                      </ol>
                                    ),
                                    li: ({ children }) => (
                                      <li className="text-gray-700">
                                        {children}
                                      </li>
                                    ),
                                    strong: ({ children }) => (
                                      <strong className="font-semibold text-gray-900">
                                        {children}
                                      </strong>
                                    ),
                                    code: ({ children }) => (
                                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
                                        {children}
                                      </code>
                                    ),
                                    pre: ({ children }) => (
                                      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono text-gray-800">
                                        {children}
                                      </pre>
                                    ),
                                  }}
                                >
                                  {introduce.content}
                                </ReactMarkdown>
                              </div>
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
                          categoryId={parseInt(categoryId)}
                          allowedTypes={CONSTANTS.FILE_TYPES}
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
                              <div className="flex items-start space-x-3">
                                {/* 아이콘 부분 */}
                                <div className="flex-shrink-0 mt-1">
                                  {isImageFile(resource.name) ? (
                                    <div className="w-8 h-8 rounded overflow-hidden bg-gray-100">
                                      <img
                                        src={resource.url}
                                        alt={resource.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          // 이미지 로드 실패 시 기본 아이콘으로 대체
                                          const parent =
                                            e.currentTarget.parentElement;
                                          if (parent) {
                                            parent.innerHTML = `
                                              <svg class="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                              </svg>
                                            `;
                                          }
                                        }}
                                      />
                                    </div>
                                  ) : (
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
                                  )}
                                </div>

                                {/* 텍스트 및 버튼 부분 */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                      <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                      >
                                        <h4 className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer truncate">
                                          {resource.title || resource.name}
                                        </h4>
                                      </a>
                                      <p className="text-sm text-gray-500 mt-1">
                                        {formatDate(resource.uploadDate)} •{" "}
                                        {formatFileSize(resource.size)}
                                      </p>
                                    </div>

                                    {/* 삭제 버튼 */}
                                    {canEdit && (
                                      <div className="flex-shrink-0 ml-2">
                                        <button
                                          onClick={() =>
                                            handleDeleteResource(resource.id)
                                          }
                                          className="inline-flex items-center p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                          title="삭제"
                                        >
                                          <svg
                                            className="w-4 h-4"
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
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
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
                            <button
                              onClick={() =>
                                startEditingTabPost(tab.id.toString())
                              }
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
                          </div>
                        )}
                      </div>

                      {/* 탭 컨텐츠 */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        {renderTabPostContent(tab)}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 슬래시 메뉴 드롭다운 */}
      {showSlashMenu && (
        <div
          className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg py-2 min-w-48"
          style={{
            top: slashMenuPosition.top,
            left: slashMenuPosition.left,
          }}
        >
          {slashMenuOptions.map((option, index) => (
            <button
              key={index}
              onClick={() =>
                handleSlashMenuSelect(option, currentEditor || "intro")
              }
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-sm"
            >
              <span className="font-mono text-gray-600 min-w-8">
                {option.icon}
              </span>
              <span className="text-gray-700">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
