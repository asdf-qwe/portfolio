import Link from "next/link";
import React from "react";
import { CategoryResponse } from "@/features/category/types/category";
import { TagResponse } from "@/features/tag/types/tag";
import { MAIN_PAGE_CONSTANTS } from "@/constants/mainPageConstants";

interface ProjectsSectionProps {
  categories: CategoryResponse[];
  categoriesLoading: boolean;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  canEdit: boolean;
  userId: string;
  showCreateForm: boolean;
  setShowCreateForm: (show: boolean) => void;
  newCategoryTitle: string;
  setNewCategoryTitle: (title: string) => void;
  isCreatingCategory: boolean;
  onCreateCategory: () => void;
  onGoToPreviousPage: () => void;
  onGoToNextPage: () => void;
  categoryTags?: { [categoryId: number]: TagResponse[] }; // 카테고리별 태그 데이터
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  categories,
  categoriesLoading,
  currentPage,
  totalPages,
  itemsPerPage,
  canEdit,
  userId,
  showCreateForm,
  setShowCreateForm,
  newCategoryTitle,
  setNewCategoryTitle,
  isCreatingCategory,
  onCreateCategory,
  onGoToPreviousPage,
  onGoToNextPage,
  categoryTags = {},
}) => {
  // 페이징 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);

  return (
    <section id="projects" className="py-24 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            주요 프로젝트
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            다양한 기술 스택과 도메인을 경험하며 성장해온 프로젝트들을
            소개합니다
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto rounded-full mt-8"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesLoading ? (
            // 로딩 중일 때 스켈레톤 표시
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-8">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))
          ) : categories.length > 0 ? (
            // 카테고리가 있을 때
            currentCategories.map((category, index) => (
              <Link
                href={`/pof-2/${userId}/${category.id}`}
                key={category.id}
                className="group block"
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="relative h-48 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium opacity-90">
                          프로젝트 #{currentPage * itemsPerPage + index + 1}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors duration-300">
                      {category.categoryTitle}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      프로젝트에 대한 자세한 내용을 확인해보세요. 기술 스택,
                      구현 과정, 성과 등을 확인하실 수 있습니다.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {categoryTags[category.id] &&
                      categoryTags[category.id].length > 0 ? (
                        // 실제 태그들 표시
                        categoryTags[category.id].slice(0, 4).map((tag) => (
                          <span
                            key={tag.tagId}
                            className="px-3 py-1 bg-sky-100 text-sky-700 text-sm font-semibold rounded-full border border-sky-200"
                          >
                            {tag.tagName}
                          </span>
                        ))
                      ) : (
                        // 태그가 없을 때 기본 태그 표시
                        <span className="px-3 py-1 bg-sky-100 text-sky-700 text-sm font-semibold rounded-full border border-sky-200">
                          프로젝트
                        </span>
                      )}
                      {categoryTags[category.id] &&
                        categoryTags[category.id].length > 4 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                            +{categoryTags[category.id].length - 4}개
                          </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sky-600 font-medium group-hover:text-sky-700 transition-colors duration-300">
                        <span>자세히 보기</span>
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">
                        {new Date(category.createdAt).toLocaleDateString(
                          "ko-KR"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // 카테고리가 없을 때
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                아직 프로젝트가 없습니다
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                첫 번째 프로젝트를 만들어보세요! 당신의 경험과 기술을 공유하는
                좋은 기회가 될 것입니다.
              </p>

              {canEdit && (
                <div className="max-w-md mx-auto">
                  {!showCreateForm ? (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      프로젝트 추가하기
                    </button>
                  ) : (
                    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
                      <div className="text-center mb-6">
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">
                          새 프로젝트 만들기
                        </h4>
                        <p className="text-gray-600">
                          프로젝트 제목을 입력하고 시작해보세요
                        </p>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            프로젝트 제목
                          </label>
                          <input
                            type="text"
                            value={newCategoryTitle}
                            onChange={(e) =>
                              setNewCategoryTitle(e.target.value)
                            }
                            placeholder="예: 쇼핑몰 웹사이트, 모바일 앱 등"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 text-lg"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                onCreateCategory();
                              }
                            }}
                            disabled={isCreatingCategory}
                          />
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={onCreateCategory}
                            disabled={
                              isCreatingCategory || !newCategoryTitle.trim()
                            }
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                          >
                            {isCreatingCategory ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                생성 중...
                              </>
                            ) : (
                              <>
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                생성하기
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setShowCreateForm(false);
                              setNewCategoryTitle("");
                            }}
                            disabled={isCreatingCategory}
                            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all duration-300"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!canEdit && (
                <p className="text-gray-500 text-sm mt-6">
                  이 사용자는 아직 프로젝트를 추가하지 않았습니다.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 페이징 컨트롤 */}
        {categories.length > itemsPerPage && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={onGoToPreviousPage}
              disabled={currentPage === 0}
              className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-200"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md">
              <span className="text-sm text-gray-700 font-medium">
                {currentPage + 1} / {totalPages}
              </span>
            </div>

            <button
              onClick={onGoToNextPage}
              disabled={currentPage === totalPages - 1}
              className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-200"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
