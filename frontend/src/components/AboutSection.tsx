import React from "react";
import Image from "next/image";
import { MainResponse } from "@/features/main/type/main";
import { WorkHistory } from "@/features/main/type/main";

interface AboutSectionProps {
  mainData: MainResponse | null;
  mainDataLoading: boolean;
  isEditingMain: boolean;
  editMainData: {
    name: string;
    job: string;
    workHistory: WorkHistory;
    introduce: string;
  };
  setEditMainData: React.Dispatch<
    React.SetStateAction<{
      greeting: string;
      smallGreeting: string;
      name: string;
      introduce: string;
      job: string;
      workHistory: WorkHistory;
    }>
  >;
  profileImageUrl: string;
  profileImageLoading: boolean;
  canEdit: boolean;
  isUploadingProfile: boolean;
  onProfileImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  mainData,
  mainDataLoading,
  isEditingMain,
  editMainData,
  setEditMainData,
  profileImageUrl,
  profileImageLoading,
  canEdit,
  isUploadingProfile,
  onProfileImageUpload,
}) => {
  return (
    <section
      id="about"
      className="py-24 px-6 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {mainDataLoading ? (
              // 로딩 중
              <div className="space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ) : isEditingMain ? (
              // 편집 모드
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-800">
                    이름
                  </label>
                  <input
                    type="text"
                    value={editMainData.name}
                    onChange={(e) =>
                      setEditMainData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-xl font-bold focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 shadow-sm"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-800">
                    직무
                  </label>
                  <input
                    type="text"
                    value={editMainData.job}
                    onChange={(e) =>
                      setEditMainData((prev) => ({
                        ...prev,
                        job: e.target.value,
                      }))
                    }
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 shadow-sm"
                    placeholder="직무를 입력하세요 (예: 프론트엔드 개발자)"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-800">
                    경력
                  </label>
                  <select
                    value={editMainData.workHistory}
                    onChange={(e) =>
                      setEditMainData((prev) => ({
                        ...prev,
                        workHistory: e.target.value as WorkHistory,
                      }))
                    }
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 shadow-sm"
                  >
                    <option value={WorkHistory.ZERO}>신입 (0년)</option>
                    <option value={WorkHistory.ONE}>1년</option>
                    <option value={WorkHistory.TWO}>2년</option>
                    <option value={WorkHistory.THREE}>3년</option>
                    <option value={WorkHistory.FOUR}>4년</option>
                    <option value={WorkHistory.FIVE}>5년</option>
                    <option value={WorkHistory.SIX}>6년</option>
                    <option value={WorkHistory.SEVEN}>7년</option>
                    <option value={WorkHistory.EIGHT}>8년</option>
                    <option value={WorkHistory.NINE}>9년</option>
                    <option value={WorkHistory.TEN}>10년 이상</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-800">
                    소개글
                  </label>
                  <textarea
                    value={editMainData.introduce}
                    onChange={(e) =>
                      setEditMainData((prev) => ({
                        ...prev,
                        introduce: e.target.value,
                      }))
                    }
                    rows={6}
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 shadow-sm resize-none"
                    placeholder="자기소개를 입력하세요"
                  />
                </div>
              </div>
            ) : (
              // 실제 데이터
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    {mainData?.name || "사용자"}
                  </h3>

                  {/* Stats */}
                  <div className="flex flex-wrap justify-start gap-4 mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-sky-100 border border-sky-200 rounded-full shadow-sm">
                      <svg
                        className="w-4 h-4 text-sky-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4"
                        />
                      </svg>
                      <span className="text-sky-700 font-semibold text-sm">
                        직무
                      </span>
                      <span className="text-sky-600 text-sm bg-sky-200 px-3 py-1 rounded-full whitespace-nowrap">
                        {mainData?.job || "정보 없음"}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-50 to-cyan-100 border border-cyan-200 rounded-full shadow-sm">
                      <svg
                        className="w-4 h-4 text-cyan-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-cyan-700 font-semibold text-sm">
                        경력
                      </span>
                      <span className="text-cyan-600 text-sm bg-cyan-200 px-3 py-1 rounded-full whitespace-nowrap">
                        {mainData?.workHistory
                          ? (() => {
                              switch (mainData.workHistory) {
                                case WorkHistory.ZERO:
                                  return "신입 (0년)";
                                case WorkHistory.ONE:
                                  return "1년";
                                case WorkHistory.TWO:
                                  return "2년";
                                case WorkHistory.THREE:
                                  return "3년";
                                case WorkHistory.FOUR:
                                  return "4년";
                                case WorkHistory.FIVE:
                                  return "5년";
                                case WorkHistory.SIX:
                                  return "6년";
                                case WorkHistory.SEVEN:
                                  return "7년";
                                case WorkHistory.EIGHT:
                                  return "8년";
                                case WorkHistory.NINE:
                                  return "9년";
                                case WorkHistory.TEN:
                                  return "10년 이상";
                                default:
                                  return "정보 없음";
                              }
                            })()
                          : "정보 없음"}
                      </span>
                    </div>
                  </div>

                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    {mainData?.introduce ||
                      "새로운 기술을 배우고 적용할 때 신기해 하고 좋아하며, 사용자 경험을 개선하는 데 열정을 가지고 있습니다."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-96 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
                {profileImageLoading ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <Image
                    src={profileImageUrl}
                    alt="Profile"
                    fill
                    sizes="(max-width: 320px) 100vw"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center top",
                    }}
                    className="rounded-3xl"
                    priority
                  />
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-2xl opacity-20 animate-pulse"></div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-xl opacity-30 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>

              {/* 편집 가능한 경우 업로드 버튼 표시 */}
              {canEdit && (
                <div className="absolute bottom-6 right-6">
                  <label
                    htmlFor="profile-image-upload"
                    className="cursor-pointer group"
                  >
                    <div className="bg-white text-sky-600 p-3 rounded-2xl shadow-xl hover:bg-sky-50 transition-all duration-300 group-hover:scale-110">
                      {isUploadingProfile ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-sky-500 border-t-transparent"></div>
                      ) : (
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
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </label>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={onProfileImageUpload}
                    className="hidden"
                    disabled={isUploadingProfile}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
