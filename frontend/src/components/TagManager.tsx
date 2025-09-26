import React, { useState, useEffect } from "react";
import { TagResponse, TagRequest } from "@/features/tag/types/tag";
import { tagService } from "@/features/tag/service/tagService";

interface TagManagerProps {
  categoryId: string;
  canEdit: boolean;
}

export const TagManager: React.FC<TagManagerProps> = ({
  categoryId,
  canEdit,
}) => {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [editingTag, setEditingTag] = useState<TagResponse | null>(null);
  const [editTagName, setEditTagName] = useState("");
  const [activeTagId, setActiveTagId] = useState<number | null>(null);

  // 태그 목록 조회
  const fetchTags = async () => {
    try {
      setLoading(true);
      const tagList = await tagService.getTags(parseInt(categoryId));
      setTags(tagList);
    } catch (error) {
      console.error("태그 목록 조회 실패:", error);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  // 태그 생성
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      setIsAddingTag(true);
      const tagRequest: TagRequest = { tagName: newTagName.trim() };
      await tagService.createTag(tagRequest, parseInt(categoryId));
      setNewTagName("");
      await fetchTags();
    } catch (error) {
      console.error("태그 생성 실패:", error);
      alert("태그 생성에 실패했습니다.");
    } finally {
      setIsAddingTag(false);
    }
  };

  // 태그 수정 시작
  const startEditingTag = (tag: TagResponse) => {
    setEditingTag(tag);
    setEditTagName(tag.tagName);
  };

  // 태그 수정 완료
  const handleUpdateTag = async () => {
    if (!editingTag || !editTagName.trim()) return;

    try {
      const tagRequest: TagRequest = { tagName: editTagName.trim() };
      await tagService.updateTag(tagRequest, editingTag.tagId);
      setEditingTag(null);
      setEditTagName("");
      await fetchTags();
    } catch (error) {
      console.error("태그 수정 실패:", error);
      alert("태그 수정에 실패했습니다.");
    }
  };

  // 태그 수정 취소
  const cancelEditingTag = () => {
    setEditingTag(null);
    setEditTagName("");
  };

  // 태그 클릭 핸들러
  const handleTagClick = (tagId: number) => {
    setActiveTagId(activeTagId === tagId ? null : tagId);
  };

  // 외부 클릭 시 액티브 태그 해제
  const handleOutsideClick = () => {
    setActiveTagId(null);
  };

  // 태그 삭제
  const handleDeleteTag = async (tagId: number) => {
    if (!confirm("정말로 이 태그를 삭제하시겠습니까?")) return;

    try {
      await tagService.deleteTag(tagId);
      await fetchTags();
    } catch (error) {
      console.error("태그 삭제 실패:", error);
      alert("태그 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchTags();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-pulse bg-gray-200 h-6 w-16 rounded-full"></div>
        <div className="animate-pulse bg-gray-200 h-6 w-20 rounded-full"></div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      onClick={handleOutsideClick}
    >
      {/* 기존 태그들 */}
      {tags.map((tag) => (
        <div key={tag.tagId} className="flex items-center gap-1 relative">
          {editingTag?.tagId === tag.tagId ? (
            // 수정 모드
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={editTagName}
                onChange={(e) => setEditTagName(e.target.value)}
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdateTag();
                  if (e.key === "Escape") cancelEditingTag();
                }}
                autoFocus
              />
              <button
                onClick={handleUpdateTag}
                className="text-green-600 hover:text-green-800 p-1"
                title="저장"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              <button
                onClick={cancelEditingTag}
                className="text-gray-600 hover:text-gray-800 p-1"
                title="취소"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            // 표시 모드
            <div className="flex items-center gap-1">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  if (canEdit) handleTagClick(tag.tagId);
                }}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all ${
                  activeTagId === tag.tagId
                    ? "bg-sky-200 text-sky-900 border-2 border-sky-300"
                    : "bg-sky-100 text-sky-800 border border-sky-200 hover:bg-sky-200"
                }`}
              >
                {tag.tagName}
              </span>
              {canEdit && activeTagId === tag.tagId && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingTag(tag);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="수정"
                  >
                    <svg
                      className="w-3 h-3"
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
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTag(tag.tagId);
                    }}
                    className="text-gray-400 hover:text-red-600 p-1"
                    title="삭제"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* 새 태그 추가 */}
      {canEdit && (
        <div className="flex items-center gap-1">
          {isAddingTag ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="태그명 입력"
                className="px-2 py-1 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateTag();
                  if (e.key === "Escape") {
                    setNewTagName("");
                    setIsAddingTag(false);
                  }
                }}
                autoFocus
              />
              <button
                onClick={handleCreateTag}
                disabled={!newTagName.trim()}
                className="text-green-600 hover:text-green-800 p-1 disabled:opacity-50"
                title="추가"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  setNewTagName("");
                  setIsAddingTag(false);
                }}
                className="text-gray-600 hover:text-gray-800 p-1"
                title="취소"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTag(true)}
              className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300 transition-colors"
              title="태그 추가"
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              태그 추가
            </button>
          )}
        </div>
      )}
    </div>
  );
};
