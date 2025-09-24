import { TabRes } from "@/features/tab/types/tab";
import { slashMenuOptions } from "@/constants/slashMenuOptions";
import { autoLinkUrls } from "@/utils/categoryUtils";

export interface CategoryPageHandlersProps {
  // 상태들
  introduce: any;
  setIntroduce: (value: any) => void;
  postContent: string;
  setPostContent: (value: string) => void;
  setCategory: (value: any) => void;
  category: any;
  categoryId: string;
  canEdit: boolean | null;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  editCategoryTitle: string;
  setEditCategoryTitle: (value: string) => void;
  isSaving: boolean;
  setIsSaving: (value: boolean) => void;
  showSlashMenu: boolean;
  setShowSlashMenu: (value: boolean) => void;
  slashMenuPosition: { top: number; left: number };
  setSlashMenuPosition: (value: { top: number; left: number }) => void;
  currentEditor: "intro" | "tab" | null;
  setCurrentEditor: (value: "intro" | "tab" | null) => void;
  previousContent: string;
  setPreviousContent: (value: string) => void;

  // 훅에서 가져온 함수들
  saveIntroduce: (title: string, content: string) => Promise<void>;
  editingTab: string | null;
  tabPosts: any;
  startEditingTabPost: (tabId: string) => void;
  saveTabPost: () => Promise<void>;
  cancelEditingTabPost: () => void;
  isSavingPost: boolean;

  // 서비스 함수들
  categoryService: any;
  router: any;
  userId: string;
}

export const createCategoryPageHandlers = (
  props: CategoryPageHandlersProps
) => {
  const {
    introduce,
    setIntroduce,
    postContent,
    setPostContent,
    setCategory,
    category,
    categoryId,
    canEdit,
    isEditMode,
    setIsEditMode,
    editCategoryTitle,
    setEditCategoryTitle,
    isSaving,
    setIsSaving,
    showSlashMenu,
    setShowSlashMenu,
    slashMenuPosition,
    setSlashMenuPosition,
    currentEditor,
    setCurrentEditor,
    previousContent,
    setPreviousContent,
    saveIntroduce,
    editingTab,
    tabPosts,
    startEditingTabPost,
    saveTabPost,
    cancelEditingTabPost,
    isSavingPost,
    categoryService,
    router,
    userId,
  } = props;

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
        setIntroduce((prev: any) =>
          prev ? { ...prev, content: newContent } : null
        );
        setPreviousContent(newContent);
        // 선택 후 에디터에 포커스 - 교체 위치 바로 다음으로 커서 이동
        const cursorPosition = lastSlashIndex + option.value.length;
        setTimeout(
          (cursorPos: number) => {
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
          (cursorPos: number) => {
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

    // 슬래시 입력 감지 - 마지막 문자가 "/"일 때 (이전 상태에서는 "/"가 아니었을 때)
    const lastChar = content.slice(-1);
    const prevLastChar = previousContent.slice(-1);

    if (lastChar === "/" && prevLastChar !== "/" && !showSlashMenu) {
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
    } else if (lastChar !== "/") {
      setShowSlashMenu(false);
    }

    // previousContent 업데이트
    setPreviousContent(content);

    // 기존 onChange 로직
    if (editorType === "intro") {
      setIntroduce((prev: any) =>
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
        setCategory((prev: any) =>
          prev ? { ...prev, categoryTitle: editCategoryTitle } : null
        );
      }
      const titleToUse =
        editCategoryTitle.trim() ||
        category?.categoryTitle ||
        `카테고리 ${categoryId}`;

      await saveIntroduce(titleToUse, introduce.content);
      setIsEditMode(false);
      setEditCategoryTitle("");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

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

  return {
    handleSlashMenuSelect,
    handleEditorChange,
    toggleEditMode,
    handleSave,
    handleDeleteCategory,
  };
};
