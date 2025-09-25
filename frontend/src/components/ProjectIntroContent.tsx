import React from "react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import { autoLinkUrls } from "@/utils/categoryUtils";
import { IntroduceResponse } from "@/features/main/type/introduce";
import { CategoryResponse } from "@/features/category/types/category";

interface CategoryPageHandlers {
  handleSlashMenuSelect: (
    option: { label: string; value: string; icon: string },
    editorType: "intro" | "tab"
  ) => void;
  handleEditorChange: (
    value: string | undefined,
    editorType: "intro" | "tab"
  ) => void;
  toggleEditMode: () => void;
  handleSave: () => Promise<void>;
  handleDeleteCategory: () => Promise<void>;
}

interface ProjectIntroContentProps {
  canEdit: boolean | null;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  isSaving: boolean;
  handlers: CategoryPageHandlers;
  introduce: IntroduceResponse | null;
  category: CategoryResponse | null;
  categoryId: string;
  editCategoryTitle: string;
  setEditCategoryTitle: (value: string) => void;
  introLoading: boolean;
  mainVideoUrl: string | null;
  isVideoLoading: boolean;
  handleMainVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploadingVideo: boolean;
  tabEditorRef: React.RefObject<HTMLDivElement | null>;
  introEditorRef: React.RefObject<HTMLDivElement | null>;
}

export const ProjectIntroContent: React.FC<ProjectIntroContentProps> = ({
  canEdit,
  isEditMode,
  setIsEditMode,
  isSaving,
  handlers,
  introduce,
  category,
  categoryId,
  editCategoryTitle,
  setEditCategoryTitle,
  introLoading,
  mainVideoUrl,
  isVideoLoading,
  handleMainVideoUpload,
  isUploadingVideo,
  tabEditorRef,
  introEditorRef,
}) => {
  return (
    <div>
      {/* 편집 모드 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">프로젝트 소개</h2>
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
                onClick={handlers.handleSave}
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
                onClick={handlers.toggleEditMode}
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
                  handlers.handleEditorChange(value, "intro")
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
                <video className="w-full h-full object-cover" controls>
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
                  {canEdit && (
                    <p className="text-xs text-gray-400 mt-2">
                      아래 업로드 버튼을 클릭하여 동영상을 추가하세요
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 동영상 업로드 버튼 (편집 모드에서만 표시) */}
            {canEdit && (
              <div className="absolute top-2 right-2">
                <label htmlFor="main-video-upload" className="cursor-pointer">
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
                ▶️ {category?.categoryTitle || `카테고리 ${categoryId}`} 데모
                영상
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
            ) : introduce ? (
              /* introduce 데이터가 있으면 표시 (빈 content라도 빈 게시글로 표시) */
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="max-w-none">
                  <div className="text-gray-700 leading-relaxed">
                    {introduce.content && introduce.content.trim() ? (
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
                            <p className="mb-4 text-gray-700 leading-relaxed font-medium">
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
                        {autoLinkUrls(introduce.content)}
                      </ReactMarkdown>
                    ) : (
                      <div className="text-gray-500 italic text-center py-8">
                        빈 게시글입니다. 편집 버튼을 눌러 내용을 작성해주세요.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* introduce 데이터가 없으면 빈 상태 표시 */
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
                      onClick={handlers.toggleEditMode}
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
                <video className="w-full h-full object-cover" controls>
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
                <label htmlFor="main-video-upload" className="cursor-pointer">
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
                ▶️ {category?.categoryTitle || `카테고리 ${categoryId}`} 데모
                영상
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
