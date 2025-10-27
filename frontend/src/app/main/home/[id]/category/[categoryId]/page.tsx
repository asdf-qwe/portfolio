"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ProjectHeader from "@/components/ProjectHeader";
import { useAuth } from "@/features/auth/context/AuthContext";
import { categoryService } from "@/features/category/service/categoryService";
import { useCategory } from "@/hooks/useCategory";
import { useIntroduce } from "@/hooks/useIntroduce";
import { useTabs } from "@/hooks/useTabs";
import { useResources } from "@/hooks/useResources";
import { useVideo } from "@/hooks/useVideo";
import { CONSTANTS } from "@/utils/constants";
import { createCategoryPageHandlers } from "@/handlers/categoryPageHandlers";
import { TabPostContent } from "@/components/TabPostContent";
import { TabNavigation } from "@/components/TabNavigation";
import { ProjectIntroContent } from "@/components/ProjectIntroContent";
import { ResourcesContent } from "@/components/ResourcesContent";
import { TagManager } from "@/components/TagManager";
import { SlashMenu } from "@/components/SlashMenu";

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

  // 커스텀 훅 사용
  const { category, loading, error, setCategory } = useCategory(
    userId,
    categoryId
  );
  const { introduce, setIntroduce, introLoading, saveIntroduce } =
    useIntroduce(category);
  const {
    tabs,
    tabsLoading,
    activeTab,
    setActiveTab,
    newTabName,
    setNewTabName,
    isAddingTab,
    handleAddTab,
    tabPosts,
    editingTab,
    postContent,
    setPostContent,
    isSavingPost,
    startEditingTabPost,
    saveTabPost,
    cancelEditingTabPost,
    handleDeleteTab,
  } = useTabs(categoryId, category);
  const {
    resources,
    isResourcesLoading,
    handleUploadSuccess,
    handleDeleteResource,
  } = useResources(category);
  const {
    mainVideoUrl,
    isVideoLoading,
    isUploadingVideo,
    handleMainVideoUpload,
  } = useVideo(category);

  // 로컬 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCategoryTitle, setEditCategoryTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  // 접근 권한 체크
  const isOwner = isLoggedIn && user && user.id?.toString() === userId;
  const canEdit = isOwner;

  // 핸들러 함수들 생성
  const handlers = createCategoryPageHandlers({
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
  });

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
                <TagManager category={category} canEdit={!!canEdit} />
                {canEdit && !isEditMode && (
                  <button
                    onClick={handlers.handleDeleteCategory}
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
            <TabNavigation
              tabsLoading={tabsLoading}
              allTabs={allTabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              canEdit={canEdit}
              newTabName={newTabName}
              setNewTabName={setNewTabName}
              handleAddTab={handleAddTab}
              isAddingTab={isAddingTab}
            />

            {/* 탭 컨텐츠 */}
            <div className="prose max-w-none">
              {/* 프로젝트 소개 */}
              {activeTab === "intro" && (
                <ProjectIntroContent
                  canEdit={canEdit}
                  isEditMode={isEditMode}
                  setIsEditMode={setIsEditMode}
                  isSaving={isSaving}
                  handlers={handlers}
                  introduce={introduce}
                  category={category}
                  categoryId={categoryId}
                  editCategoryTitle={editCategoryTitle}
                  setEditCategoryTitle={setEditCategoryTitle}
                  introLoading={introLoading}
                  mainVideoUrl={mainVideoUrl}
                  isVideoLoading={isVideoLoading}
                  handleMainVideoUpload={handleMainVideoUpload}
                  isUploadingVideo={isUploadingVideo}
                  tabEditorRef={tabEditorRef}
                  introEditorRef={introEditorRef}
                />
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
                <ResourcesContent
                  canEdit={canEdit}
                  resources={resources}
                  isResourcesLoading={isResourcesLoading}
                  handleUploadSuccess={handleUploadSuccess}
                  handleDeleteResource={handleDeleteResource}
                  category={category}
                />
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
                            <button
                              onClick={() => handleDeleteTab(tab.id)}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                삭제
                              </div>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 탭 컨텐츠 */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <TabPostContent
                          tab={tab}
                          editingTab={editingTab}
                          tabPosts={tabPosts}
                          postContent={postContent}
                          handleEditorChange={handlers.handleEditorChange}
                          saveTabPost={saveTabPost}
                          cancelEditingTabPost={cancelEditingTabPost}
                          isSavingPost={isSavingPost}
                        />
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
        <SlashMenu
          position={slashMenuPosition}
          onSelect={(option) =>
            handlers.handleSlashMenuSelect(option, currentEditor || "intro")
          }
        />
      )}
    </>
  );
}
