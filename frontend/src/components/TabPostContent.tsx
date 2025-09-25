import React from "react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import { TabRes } from "@/features/tab/types/tab";
import { PostResponse } from "@/features/post/types/post";
import { autoLinkUrls } from "@/utils/categoryUtils";

interface TabPostContentProps {
  tab: TabRes;
  editingTab: string | null;
  tabPosts: { [tabId: string]: PostResponse | null };
  postContent: string;
  handleEditorChange: (
    value: string | undefined,
    editorType: "intro" | "tab"
  ) => void;
  saveTabPost: () => Promise<void>;
  cancelEditingTabPost: () => void;
  isSavingPost: boolean;
}

export const TabPostContent: React.FC<TabPostContentProps> = ({
  tab,
  editingTab,
  tabPosts,
  postContent,
  handleEditorChange,
  saveTabPost,
  cancelEditingTabPost,
  isSavingPost,
}) => {
  const tabId = tab.id.toString();
  const post = tabPosts[tab.id];
  const hasContent = post && post.content && post.content.trim();
  const hasPost = post !== null && post !== undefined;

  if (editingTab === tabId) {
    return (
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">게시글 편집</h3>

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <MDEditor
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

  if (hasPost) {
    // 게시글은 있지만 내용이 빈 경우
    return (
      <div className="max-w-none">
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-500 italic text-center py-8">
            빈 게시글입니다. 편집 버튼을 눌러 내용을 작성해주세요.
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
