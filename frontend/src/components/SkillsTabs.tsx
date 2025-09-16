"use client";

import { useState, useRef, useEffect } from "react";
import {
  BoltIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  BookOpenIcon,
  HeartIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  BeakerIcon,
  StarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { skillCategoryService } from "@/features/main/service/skillCategoryService";
import {
  CategoryName,
  SkillCategoryRequest,
} from "@/features/main/type/skillCategory";

interface SkillsTabsProps {
  canEdit: boolean;
  isEditMode?: boolean;
  userId: number; // 사용자 ID 추가
}

export default function SkillsTabs({
  canEdit,
  isEditMode = false,
  userId,
}: SkillsTabsProps) {
  const [activeTab, setActiveTab] = useState("skills");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 탭 데이터
  const tabsData = {
    skills: {
      label: "기술 스택",
      icon: <BoltIcon className="w-5 h-5" />,
      content: "skills",
      categoryName: CategoryName.SKILLS,
    },
    personality: {
      label: "성격 & 가치관",
      icon: <BeakerIcon className="w-5 h-5" />,
      content: "personality",
      categoryName: CategoryName.PERSONALITY,
    },
    interests: {
      label: "취미 & 관심사",
      icon: <StarIcon className="w-5 h-5" />,
      content: "interests",
      categoryName: CategoryName.INTERESTS,
    },
    experience: {
      label: "경험 & 성취",
      icon: <ChartBarIcon className="w-5 h-5" />,
      content: "experience",
      categoryName: CategoryName.EXPERIENCE,
    },
  };

  // 카테고리명을 탭 키로 변환하는 함수
  const categoryNameToTabKey = (categoryName: CategoryName): string => {
    switch (categoryName) {
      case CategoryName.SKILLS:
        return "skills";
      case CategoryName.PERSONALITY:
        return "personality";
      case CategoryName.INTERESTS:
        return "interests";
      case CategoryName.EXPERIENCE:
        return "experience";
      default:
        return "skills";
    }
  };

  // 서버에서 스킬 카테고리 가져오기
  useEffect(() => {
    const fetchSkillCategory = async () => {
      try {
        setIsLoading(true);
        const response = await skillCategoryService.getSkillCategory(userId);
        console.log("서버 응답 전체:", response); // 디버깅용
        console.log("응답 타입:", typeof response); // 디버깅용

        // 응답 데이터 안전하게 처리
        if (response && response.name) {
          console.log("카테고리 이름:", response.name); // 디버깅용
          const tabKey = categoryNameToTabKey(response.name);
          setActiveTab(tabKey);
        } else {
          console.warn("응답 데이터가 예상과 다릅니다:", response);
          setActiveTab("skills"); // 기본값 설정
        }
      } catch (error) {
        console.error("스킬 카테고리 조회 실패:", error);
        // 에러 시 기본값 사용
        setActiveTab("skills");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchSkillCategory();
    }
  }, [userId]);

  // 카테고리 변경 함수
  const handleCategoryChange = async (newTabKey: string) => {
    if (!canEdit || !isEditMode) return;

    try {
      setIsSaving(true);
      const tabData = tabsData[newTabKey as keyof typeof tabsData];
      const request: SkillCategoryRequest = {
        name: tabData.categoryName,
      };

      await skillCategoryService.changeCategory(request, userId);
      setActiveTab(newTabKey);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("스킬 카테고리 변경 실패:", error);
      // 에러 발생 시 사용자에게 알림 (선택사항)
      alert("카테고리 변경에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  // 기술 스택 데이터
  const coreCompetencies = {
    "기술적 전문성": {
      icon: <BoltIcon className="w-8 h-8 text-blue-500" />,
      description: "다양한 기술 스택을 활용한 개발 역량",
      content:
        "풀스택 개발부터 시스템 설계까지 다양한 기술 영역에서 전문성을 발휘합니다. 성능 최적화와 보안 구현을 통해 안정적이고 효율적인 시스템을 구축하며, 최신 기술 트렌드를 지속적으로 학습하여 프로젝트에 적용합니다.",
    },
    "문제 해결": {
      icon: <WrenchScrewdriverIcon className="w-8 h-8 text-blue-500" />,
      description: "복잡한 문제를 체계적으로 분석하고 해결",
      content:
        "논리적 사고를 바탕으로 복잡한 문제를 단계별로 분석하고 해결책을 도출합니다. 효과적인 디버깅과 알고리즘 설계를 통해 최적의 솔루션을 제시하며, 문제 해결 과정에서 체계적인 접근 방식을 활용합니다.",
    },
  };

  // 성격 & 가치관 데이터
  const personalityTraits = {
    "창의적 사고": {
      icon: <LightBulbIcon className="w-8 h-8 text-blue-500" />,
      description: "새로운 아이디어와 독창적인 접근 방식",
      content:
        "혁신적인 사고를 통해 기존의 틀을 벗어난 새로운 해결책을 제시합니다. 다양한 관점에서 문제를 바라보며 아이디어를 발굴하고, 창의적인 접근 방식으로 독창적인 결과물을 만들어냅니다.",
    },
    "소통 & 협업": {
      icon: <UserGroupIcon className="w-8 h-8 text-blue-500" />,
      description: "원활한 커뮤니케이션과 팀워크 능력",
      content:
        "적극적인 소통으로 팀원들과 효과적으로 협업합니다. 경청 능력을 바탕으로 상대방의 의견을 존중하며, 팀워크를 통해 시너지 효과를 창출하고 필요시 리더십을 발휘하여 팀을 이끕니다.",
    },
  };

  // 취미 & 관심사 데이터
  const interests = {
    "독서 & 학습": {
      icon: <BookOpenIcon className="w-8 h-8 text-blue-500" />,
      description: "새로운 지식 습득과 인사이트 탐구",
      content:
        "전문서적을 통한 깊이 있는 학습과 온라인 강의를 활용한 지속적인 성장을 추구합니다. 세미나 참석과 독서 모임을 통해 다양한 관점을 접하며, 새로운 인사이트를 얻고 지식을 확장해 나갑니다.",
    },
    "운동 & 건강": {
      icon: <HeartIcon className="w-8 h-8 text-blue-500" />,
      description: "건강한 라이프스타일과 체력 관리",
      content:
        "규칙적인 헬스와 러닝을 통해 체력을 관리하고, 요가로 몸과 마음의 균형을 유지합니다. 아웃도어 활동을 즐기며 자연과 함께하는 건강한 라이프스타일을 실천하고 있습니다.",
    },
  };

  // 경험 & 성취 데이터
  const experiences = {
    "프로젝트 경험": {
      icon: <BriefcaseIcon className="w-8 h-8 text-blue-500" />,
      description: "다양한 프로젝트를 통한 실무 경험",
      content:
        "다양한 프로젝트를 성공적으로 완수하며 실무 경험을 쌓았습니다. 팀 리딩 역할을 통해 리더십을 발휘하고, 복잡한 문제 상황에서도 체계적인 해결책을 제시하여 목표 성과를 달성했습니다.",
    },
    "학습 & 자격": {
      icon: <AcademicCapIcon className="w-8 h-8 text-blue-500" />,
      description: "전문성 향상을 위한 지속적 학습",
      content:
        "전문성 향상을 위해 관련 자격증을 취득하고 다양한 교육과정을 수료했습니다. 지속적인 스킬 향상을 통해 지식의 폭과 깊이를 확장하며, 변화하는 기술 트렌드에 발맞춰 성장하고 있습니다.",
    },
  };

  return (
    <section className="pt-14 pb-8 px-6 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            {isLoading
              ? "로딩 중..."
              : tabsData[activeTab as keyof typeof tabsData].label}
          </h2>

          {/* 드롭다운 (아이디 주인이면서 편집 모드일 때만 보임, 로딩 중에는 숨김) */}
          {!isLoading && canEdit && isEditMode && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSaving}
              >
                {tabsData[activeTab as keyof typeof tabsData].icon}
                <span className="font-medium">
                  {isSaving
                    ? "저장 중..."
                    : tabsData[activeTab as keyof typeof tabsData].label}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {Object.entries(tabsData).map(([key, tab]) => (
                    <button
                      key={key}
                      onClick={() => handleCategoryChange(key)}
                      disabled={isSaving}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        activeTab === key
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {tab.icon}
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 일반 사용자용 현재 선택된 탭 표시 (편집 모드가 아니거나 일반 사용자, 로딩 중에는 숨김) */}
          {!isLoading && (!canEdit || !isEditMode) && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm">
              {tabsData[activeTab as keyof typeof tabsData].icon}
              <span className="font-medium">
                {tabsData[activeTab as keyof typeof tabsData].label}
              </span>
            </div>
          )}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="min-h-[400px] flex justify-center items-center">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">
                카테고리를 불러오는 중...
              </span>
            </div>
          ) : (
            <div className="w-full max-w-6xl">
              {/* 기술 스택 탭 */}
              {activeTab === "skills" && (
                <div className="grid md:grid-cols-2 gap-8 justify-items-center">
                  {Object.entries(coreCompetencies).map(
                    ([category, competency]) => (
                      <div
                        key={category}
                        className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 w-full max-w-lg"
                      >
                        <div className="flex items-center mb-6">
                          <div className="mr-3">{competency.icon}</div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {category}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                          {competency.description}
                        </p>
                        <div className="text-gray-700 text-sm leading-relaxed">
                          {competency.content}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* 성격 & 가치관 탭 */}
              {activeTab === "personality" && (
                <div className="grid md:grid-cols-2 gap-8 justify-items-center">
                  {Object.entries(personalityTraits).map(
                    ([category, trait]) => (
                      <div
                        key={category}
                        className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 w-full max-w-lg"
                      >
                        <div className="flex items-center mb-6">
                          <div className="mr-3">{trait.icon}</div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {category}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                          {trait.description}
                        </p>
                        <div className="text-gray-700 text-sm leading-relaxed">
                          {trait.content}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* 취미 & 관심사 탭 */}
              {activeTab === "interests" && (
                <div className="grid md:grid-cols-2 gap-8 justify-items-center">
                  {Object.entries(interests).map(([category, interest]) => (
                    <div
                      key={category}
                      className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 w-full max-w-lg"
                    >
                      <div className="flex items-center mb-6">
                        <div className="mr-3">{interest.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {category}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                        {interest.description}
                      </p>
                      <div className="text-gray-700 text-sm leading-relaxed">
                        {interest.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 경험 & 성취 탭 */}
              {activeTab === "experience" && (
                <div className="grid md:grid-cols-2 gap-8 justify-items-center">
                  {Object.entries(experiences).map(([category, experience]) => (
                    <div
                      key={category}
                      className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 w-full max-w-lg"
                    >
                      <div className="flex items-center mb-6">
                        <div className="mr-3">{experience.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {category}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                        {experience.description}
                      </p>
                      <div className="text-gray-700 text-sm leading-relaxed">
                        {experience.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
