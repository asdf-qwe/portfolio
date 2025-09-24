import React, { useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import { IntroduceResponse } from "@/features/main/type/introduce";
import { autoLinkUrls } from "@/utils/categoryUtils";
import { slashMenuOptions } from "@/utils/slashMenuOptions";
import { SlashMenu } from "@/components/SlashMenu";

interface IntroTabProps {
  categoryTitle: string;
  introduce: IntroduceResponse | null;
  setIntroduce: React.Dispatch<React.SetStateAction<IntroduceResponse | null>>;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  introLoading: boolean;
  isSaving: boolean;
  canEdit: boolean;
  mainVideoUrl: string | null;
  isVideoLoading: boolean;
  isUploadingVideo: boolean;
  onSave: () => Promise<void>;
  onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const IntroTab: React.FC<IntroTabProps> = ({
  categoryTitle,
  introduce,
  setIntroduce,
  isEditMode,
  setIsEditMode,
  introLoading,
  isSaving,
  canEdit,
  mainVideoUrl,
  isVideoLoading,
  isUploadingVideo,
  onSave,
  onVideoUpload,
}) => {
  const introEditorRef = useRef<HTMLDivElement | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [previousContent, setPreviousContent] = useState("");

  const handleEditorChange = (value: string | undefined) => {
    const content = value || "";
    const lastChar = content.slice(-1);
    const prevLastChar = previousContent.slice(-1);

    if (lastChar === "/" && prevLastChar !== "/" && !showSlashMenu) {
      const textarea = document.activeElement as HTMLTextAreaElement;
      if (textarea) {
        const rect = textarea.getBoundingClientRect();
        setSlashMenuPosition({
          top: rect.top + rect.height + 5,
          left: rect.left,
        });
        setShowSlashMenu(true);
      }
    } else if (lastChar !== "/") {
      setShowSlashMenu(false);
    }

    setPreviousContent(content);
    setIntroduce((prev: IntroduceResponse | null) =>
      prev
        ? { ...prev, content }
        : ({ title: categoryTitle, content } as IntroduceResponse)
    );
  };

  const handleSlashMenuSelect = (option: (typeof slashMenuOptions)[0]) => {
    if (!introduce) return;

    const currentContent = introduce.content || "";
    const lastSlashIndex = currentContent.lastIndexOf("/");
    if (lastSlashIndex !== -1) {
      const newContent =
        currentContent.substring(0, lastSlashIndex) +
        option.value +
        currentContent.substring(lastSlashIndex + 1);
      setIntroduce((prev: IntroduceResponse | null) =>
        prev ? { ...prev, content: newContent } : null
      );
      setPreviousContent(newContent);

      const cursorPosition = lastSlashIndex + option.value.length;
      setTimeout(() => {
        const textareas = document.querySelectorAll("textarea");
        for (const textarea of textareas) {
          if (textarea.offsetParent !== null) {
            textarea.focus();
            textarea.setSelectionRange(cursorPosition, cursorPosition);
            break;
          }
        }
      }, 100);
    }
    setShowSlashMenu(false);
  };

  const toggleEditMode = () => {
    if (!canEdit) return;

    if (!isEditMode) {
      if (!introduce || !introduce.content) {
        setIntroduce({
          title: categoryTitle,
          content: `## 프로젝트 개요\n여기에 프로젝트에 대한 설명을 작성해주세요.\n\n## 주요 기능\n- 기능 1\n- 기능 2\n- 기능 3\n\n## 사용 기술\n- 기술 스택을 작성해주세요.\n\n## 프로젝트 목표\n- 목표를 작성해주세요.`,
        });
      }
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  };

  return (
    <div>
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
                onClick={onSave}
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

      {isEditMode ? (
        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트 소개 내용 (마크다운 지원)
              </label>
              <MDEditor
                ref={introEditorRef}
                value={introduce?.content || ""}
                onChange={handleEditorChange}
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

          <VideoPlayer
            mainVideoUrl={mainVideoUrl}
            isVideoLoading={isVideoLoading}
            isUploadingVideo={isUploadingVideo}
            canEdit={canEdit}
            categoryTitle={categoryTitle}
            onVideoUpload={onVideoUpload}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-2">
            {introLoading ? (
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ) : introduce?.content ? (
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
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="max-w-xs mx-auto">
                  <svg
                    className="w-10 h-10 text-gray-400 mx-auto mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

          <VideoPlayer
            mainVideoUrl={mainVideoUrl}
            isVideoLoading={isVideoLoading}
            isUploadingVideo={isUploadingVideo}
            canEdit={canEdit}
            categoryTitle={categoryTitle}
            onVideoUpload={onVideoUpload}
          />
        </div>
      )}

      {showSlashMenu && (
        <SlashMenu
          position={slashMenuPosition}
          onSelect={handleSlashMenuSelect}
        />
      )}

      {canEdit && (
        <input
          id="main-video-upload"
          type="file"
          accept="video/*"
          onChange={onVideoUpload}
          className="hidden"
          disabled={isUploadingVideo}
        />
      )}
    </div>
  );
};

interface VideoPlayerProps {
  mainVideoUrl: string | null;
  isVideoLoading: boolean;
  isUploadingVideo: boolean;
  canEdit: boolean;
  categoryTitle: string;
  onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  mainVideoUrl,
  isVideoLoading,
  isUploadingVideo,
  canEdit,
  categoryTitle,
  onVideoUpload,
}) => (
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
      <p className="text-sm text-gray-600">▶️ {categoryTitle} 데모 영상</p>
    </div>
  </div>
);
