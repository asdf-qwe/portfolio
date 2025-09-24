import React, { useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import { TabRes } from "@/features/tab/types/tab";
import { PostResponse } from "@/features/post/types/post";
import { autoLinkUrls } from "@/utils/categoryUtils";
import { slashMenuOptions } from "@/utils/slashMenuOptions";
import { SlashMenu } from "@/components/SlashMenu";

interface CustomTabProps {
  tab: TabRes;
  post: PostResponse | null;
  editingTab: string | null;
  postContent: string;
  isSavingPost: boolean;
  canEdit: boolean;
  onStartEditing: (tabId: string) => void;
  onSavePost: () => Promise<void>;
  onCancelEditing: () => void;
  onPostContentChange: (content: string) => void;
}

export const CustomTab: React.FC<CustomTabProps> = ({
  tab,
  post,
  editingTab,
  postContent,
  isSavingPost,
  canEdit,
  onStartEditing,
  onSavePost,
  onCancelEditing,
  onPostContentChange,
}) => {
  const tabEditorRef = useRef<HTMLDivElement | null>(null);
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
    onPostContentChange(content);
  };

  const handleSlashMenuSelect = (option: (typeof slashMenuOptions)[0]) => {
    const currentContent = postContent;
    const lastSlashIndex = currentContent.lastIndexOf("/");
    if (lastSlashIndex !== -1) {
      const newContent =
        currentContent.substring(0, lastSlashIndex) +
        option.value +
        currentContent.substring(lastSlashIndex + 1);
      onPostContentChange(newContent);
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

  const renderTabPostContent = () => {
    const tabId = tab.id.toString();
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
                onChange={handleEditorChange}
                preview="edit"
                hideToolbar={false}
                visibleDragbar={false}
                className="border border-gray-300 rounded-lg"
                height={300}
              />
            </div>

            <div className="flex space-x-2 justify-center">
              <button
                onClick={onSavePost}
                disabled={isSavingPost}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {isSavingPost ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={onCancelEditing}
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
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {autoLinkUrls(post?.content || "내용이 없습니다.")}
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{tab.tabName}</h2>
        {canEdit && (
          <div className="flex gap-2">
            <button
              onClick={() => onStartEditing(tab.id.toString())}
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderTabPostContent()}
      </div>

      {showSlashMenu && (
        <SlashMenu
          position={slashMenuPosition}
          onSelect={handleSlashMenuSelect}
        />
      )}
    </div>
  );
};
