"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { categoryService } from "@/features/category/service/categoryService";
import {
  CategoryResponse,
  CategoryRequest,
} from "@/features/category/types/category";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function ProjectHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // URL에서 사용자 ID 추출
  const getUserIdFromPath = useCallback((): number | null => {
    const match = pathname.match(/\/main\/home\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }, [pathname]);

  // 카테고리 목록 가져오기
  const fetchCategories = useCallback(async () => {
    try {
      // URL에서 사용자 ID를 추출하거나, 로그인된 사용자 ID 사용
      const userIdFromPath = getUserIdFromPath();
      const targetUserId = userIdFromPath || user?.id;

      if (targetUserId) {
        const categoryList = await categoryService.getCategories(targetUserId);
        setCategories(categoryList);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("카테고리 목록 조회 실패:", error);
      // 에러 시 빈 배열 사용
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [getUserIdFromPath, user?.id]);

  useEffect(() => {
    const userIdFromPath = getUserIdFromPath();
    const targetUserId = userIdFromPath || user?.id;

    if (targetUserId) {
      fetchCategories();
    } else {
      setLoading(false);
    }
  }, [fetchCategories, getUserIdFromPath, user?.id]);

  // 카테고리 생성 기능
  const handleCreateCategory = async () => {
    if (!newCategoryTitle.trim() || !user?.id) {
      alert("카테고리 제목을 입력해주세요.");
      return;
    }

    try {
      setIsCreating(true);

      const categoryData: CategoryRequest = {
        categoryTitle: newCategoryTitle.trim(),
      };

      const newCategory = await categoryService.createCategory(
        categoryData,
        user.id
      );

      // 카테고리 목록 새로고침
      await fetchCategories();

      // 모달 닫기 및 입력 초기화
      setShowCreateModal(false);
      setNewCategoryTitle("");

      // 새로 생성된 카테고리 페이지로 이동
      router.push(`/pof-2/${user.id}/${newCategory.id}`);

      alert(`"${newCategory.categoryTitle}" 카테고리가 생성되었습니다!`);
    } catch (error) {
      console.error("카테고리 생성 실패:", error);
      alert("카테고리 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto max-w-6xl px-6">
          <div className="flex items-center space-x-8 py-4">
            {/* 홈 아이콘 */}
            <Link
              href={(() => {
                const userIdFromPath = getUserIdFromPath();
                const targetUserId = userIdFromPath || user?.id;
                return targetUserId ? `/pof-1/${targetUserId}` : "/";
              })()}
              className="text-blue-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-50"
              aria-label="홈으로 이동"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </Link>

            {/* 프로젝트 메뉴 */}
            <ul className="flex space-x-8 items-center">
              {loading ? (
                // 로딩 중 스켈레톤
                <>
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="relative">
                      <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </li>
                  ))}
                </>
              ) : (
                // 실제 카테고리 메뉴
                categories.map((category) => {
                  // URL에서 사용자 ID 추출하거나 로그인된 사용자 ID 사용
                  const userIdFromPath = getUserIdFromPath();
                  const targetUserId = userIdFromPath || user?.id;
                  const categoryPath = targetUserId
                    ? `/pof-2/${targetUserId}/${category.id}`
                    : `/main/category/${category.id}`;
                  return (
                    <li key={category.id} className="relative">
                      <Link
                        href={categoryPath}
                        className={`text-xl font-medium tracking-wide block px-1 py-1 ${
                          pathname === categoryPath
                            ? "text-blue-500"
                            : "text-blue-400 hover:text-blue-500 transition-colors"
                        }`}
                        aria-current={
                          pathname === categoryPath ? "page" : undefined
                        }
                      >
                        {category.categoryTitle}
                        {pathname === categoryPath && (
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform transition-all duration-300">
                            <div className="absolute top-0 left-0 w-full h-full bg-blue-400 animate-pulse"></div>
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })
              )}

              {/* 카테고리 추가 버튼 - 로그인된 소유자만 표시 */}
              {user && getUserIdFromPath() === user.id && (
                <li>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-1 px-3 py-1 text-blue-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="새 카테고리 추가"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-sm font-medium">추가</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
      <div className="bg-blue-50/70 py-12">
        {/* 이 div는 헤더 아래의 연한 하늘색 배경을 위한 것입니다 */}
      </div>

      {/* 카테고리 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                새 카테고리 생성
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewCategoryTitle("");
                }}
                className="text-gray-400 hover:text-gray-600"
                disabled={isCreating}
              >
                <svg
                  className="w-6 h-6"
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 제목
              </label>
              <input
                type="text"
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 프로젝트 4"
                disabled={isCreating}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateCategory();
                  }
                }}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewCategoryTitle("");
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isCreating}
              >
                취소
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={isCreating || !newCategoryTitle.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    생성 중...
                  </div>
                ) : (
                  "생성"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
