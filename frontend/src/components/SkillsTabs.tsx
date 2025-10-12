"use client";

import { useState, useRef, useEffect } from "react";
import {
  BoltIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  BookOpenIcon,
  HeartIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  BeakerIcon,
  StarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { skillCategoryService } from "@/features/main/service/skillCategoryService";
import { cardService } from "@/features/main/service/cardService";
import {
  CategoryName,
  SkillCategoryRequest,
} from "@/features/main/type/skillCategory";
import { CardDto } from "@/features/main/type/card";

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

  // 카드 데이터 상태
  const [cardData, setCardData] = useState<{
    first: CardDto | null;
    second: CardDto | null;
  }>({
    first: null,
    second: null,
  });
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [isCardEditing, setIsCardEditing] = useState<{
    first: boolean;
    second: boolean;
  }>({
    first: false,
    second: false,
  });
  const [editCardData, setEditCardData] = useState<{
    first: CardDto;
    second: CardDto;
  }>({
    first: { title: "", subTitle: "", content: "" },
    second: { title: "", subTitle: "", content: "" },
  });

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

        // 응답 데이터 안전하게 처리
        if (response && response.name) {
          const tabKey = categoryNameToTabKey(response.name);
          setActiveTab(tabKey);
        } else {
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

  // 카드 데이터 조회
  useEffect(() => {
    const fetchCardData = async () => {
      if (!userId || isLoading) return; // 로딩 중이거나 userId가 없으면 조회하지 않음

      try {
        setIsCardLoading(true);

        const [firstCard, secondCard] = await Promise.all([
          cardService
            .getFirst(getCurrentTabCategory(), userId)
            .catch((error) => {
              return null;
            }),
          cardService
            .getSecond(getCurrentTabCategory(), userId)
            .catch((error) => {
              return null;
            }),
        ]);

        setCardData({
          first: firstCard,
          second: secondCard,
        });
      } catch (error) {
        // 조회 실패 시 null 유지 (더미 데이터 사용)
        setCardData({
          first: null,
          second: null,
        });
      } finally {
        setIsCardLoading(false);
      }
    };

    fetchCardData();
  }, [userId, activeTab, isLoading]); // isLoading도 의존성에 추가

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

      // 카테고리 변경 후 새로운 카테고리의 카드 데이터 불러오기
      console.log(
        `카테고리 변경: ${activeTab} -> ${newTabKey}, 새로운 카테고리: ${tabData.categoryName}`
      );
      const [firstCard, secondCard] = await Promise.all([
        cardService.getFirst(tabData.categoryName, userId).catch((error) => {
          return null;
        }),
        cardService.getSecond(tabData.categoryName, userId).catch((error) => {
          return null;
        }),
      ]);

      // 카드 데이터 업데이트
      setCardData({
        first: firstCard,
        second: secondCard,
      });

      // 편집 상태 초기화
      setIsCardEditing({
        first: false,
        second: false,
      });

      // 편집 데이터 초기화
      setEditCardData({
        first: firstCard || getDummyData(newTabKey).first,
        second: secondCard || getDummyData(newTabKey).second,
      });

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

  // 더미 데이터 가져오기
  const getDummyData = (tabKey: string) => {
    switch (tabKey) {
      case "skills":
        return {
          first: {
            title: "기술적 전문성",
            subTitle: "다양한 기술 스택을 활용한 개발 역량",
            content:
              "풀스택 개발부터 시스템 설계까지 다양한 기술 영역에서 전문성을 발휘합니다. 성능 최적화와 보안 구현을 통해 안정적이고 효율적인 시스템을 구축하며, 최신 기술 트렌드를 지속적으로 학습하여 프로젝트에 적용합니다.",
          },
          second: {
            title: "문제 해결",
            subTitle: "복잡한 문제를 체계적으로 분석하고 해결",
            content:
              "논리적 사고를 바탕으로 복잡한 문제를 단계별로 분석하고 해결책을 도출합니다. 효과적인 디버깅과 알고리즘 설계를 통해 최적의 솔루션을 제시하며, 문제 해결 과정에서 체계적인 접근 방식을 활용합니다.",
          },
        };
      case "personality":
        return {
          first: {
            title: "창의적 사고",
            subTitle: "새로운 아이디어와 독창적인 접근 방식",
            content:
              "혁신적인 사고를 통해 기존의 틀을 벗어난 새로운 해결책을 제시합니다. 다양한 관점에서 문제를 바라보며 아이디어를 발굴하고, 창의적인 접근 방식으로 독창적인 결과물을 만들어냅니다.",
          },
          second: {
            title: "소통 & 협업",
            subTitle: "원활한 커뮤니케이션과 팀워크 능력",
            content:
              "적극적인 소통으로 팀원들과 효과적으로 협업합니다. 경청 능력을 바탕으로 상대방의 의견을 존중하며, 팀워크를 통해 시너지 효과를 창출하고 필요시 리더십을 발휘하여 팀을 이끕니다.",
          },
        };
      case "interests":
        return {
          first: {
            title: "독서 & 학습",
            subTitle: "새로운 지식 습득과 인사이트 탐구",
            content:
              "전문서적을 통한 깊이 있는 학습과 온라인 강의를 활용한 지속적인 성장을 추구합니다. 세미나 참석과 독서 모임을 통해 다양한 관점을 접하며, 새로운 인사이트를 얻고 지식을 확장해 나갑니다.",
          },
          second: {
            title: "운동 & 건강",
            subTitle: "건강한 라이프스타일과 체력 관리",
            content:
              "규칙적인 헬스와 러닝을 통해 체력을 관리하고, 요가로 몸과 마음의 균형을 유지합니다. 아웃도어 활동을 즐기며 자연과 함께하는 건강한 라이프스타일을 실천하고 있습니다.",
          },
        };
      case "experience":
        return {
          first: {
            title: "프로젝트 경험",
            subTitle: "다양한 프로젝트를 통한 실무 경험",
            content:
              "다양한 프로젝트를 성공적으로 완수하며 실무 경험을 쌓았습니다. 팀 리딩 역할을 통해 리더십을 발휘하고, 복잡한 문제 상황에서도 체계적인 해결책을 제시하여 목표 성과를 달성했습니다.",
          },
          second: {
            title: "학습 & 자격",
            subTitle: "전문성 향상을 위한 지속적 학습",
            content:
              "전문성 향상을 위해 관련 자격증을 취득하고 다양한 교육과정을 수료했습니다. 지속적인 스킬 향상을 통해 지식의 폭과 깊이를 확장하며, 변화하는 기술 트렌드에 발맞춰 성장하고 있습니다.",
          },
        };
      default:
        return {
          first: { title: "", subTitle: "", content: "" },
          second: { title: "", subTitle: "", content: "" },
        };
    }
  };

  // 현재 탭의 카테고리 가져오기
  const getCurrentTabCategory = (): CategoryName => {
    return tabsData[activeTab as keyof typeof tabsData].categoryName;
  };

  // 카드 데이터 가져오기 (서버 데이터 우선, 없으면 더미 데이터)
  const getCardData = (position: "first" | "second") => {
    const serverData = cardData[position];
    if (serverData) {
      return serverData;
    }
    return getDummyData(activeTab)[position];
  };

  // 카드 아이콘 가져오기
  const getCardIcon = (position: "first" | "second") => {
    const dummyData = getDummyData(activeTab)[position];
    switch (activeTab) {
      case "skills":
        return position === "first" ? (
          <BoltIcon className="w-8 h-8 text-blue-500" />
        ) : (
          <WrenchScrewdriverIcon className="w-8 h-8 text-blue-500" />
        );
      case "personality":
        return position === "first" ? (
          <LightBulbIcon className="w-8 h-8 text-blue-500" />
        ) : (
          <UserGroupIcon className="w-8 h-8 text-blue-500" />
        );
      case "interests":
        return position === "first" ? (
          <BookOpenIcon className="w-8 h-8 text-blue-500" />
        ) : (
          <HeartIcon className="w-8 h-8 text-blue-500" />
        );
      case "experience":
        return position === "first" ? (
          <BriefcaseIcon className="w-8 h-8 text-blue-500" />
        ) : (
          <AcademicCapIcon className="w-8 h-8 text-blue-500" />
        );
      default:
        return <BoltIcon className="w-8 h-8 text-blue-500" />;
    }
  };

  // 카드 저장 함수
  const saveCard = async (position: "first" | "second") => {
    if (!canEdit || !isEditMode) return;

    try {
      setIsCardLoading(true);
      const cardDataToSave = editCardData[position];
      if (position === "first") {
        if (cardData.first) {
          // 수정
          await cardService.updateFirst(
            cardDataToSave,
            getCurrentTabCategory(),
            userId
          );
        } else {
          // 생성
          await cardService.createFirst(
            cardDataToSave,
            getCurrentTabCategory(),
            userId
          );
        }
      } else {
        if (cardData.second) {
          // 수정
          await cardService.updateSecond(
            cardDataToSave,
            getCurrentTabCategory(),
            userId
          );
        } else {
          // 생성
          await cardService.createSecond(cardDataToSave, userId);
        }
      }

      // 저장 후 데이터 새로고침
      console.log("저장 후 데이터 새로고침 시작");
      const [firstCard, secondCard] = await Promise.all([
        cardService.getFirst(getCurrentTabCategory(), userId).catch((error) => {
          console.log("저장 후 getFirst: 데이터 없음 - 더미 데이터 사용");
          return null;
        }),
        cardService
          .getSecond(getCurrentTabCategory(), userId)
          .catch((error) => {
            console.log("저장 후 getSecond: 데이터 없음 - 더미 데이터 사용");
            return null;
          }),
      ]);

      console.log("저장 후 데이터 새로고침 완료:", { firstCard, secondCard });

      setCardData({
        first: firstCard,
        second: secondCard,
      });

      // 편집 모드 종료
      setIsCardEditing({
        ...isCardEditing,
        [position]: false,
      });

      console.log("카드 저장 완료");
    } catch (error) {
      console.error("카드 저장 중 예상치 못한 오류 발생:", error);
      alert("카드 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsCardLoading(false);
    }
  };

  // 카드 편집 시작 함수
  const startEditingCard = (position: "first" | "second") => {
    const card = getCardData(position);
    setEditCardData({
      ...editCardData,
      [position]: {
        title: card.title || "",
        subTitle: card.subTitle || "",
        content: card.content || "",
      },
    });
    setIsCardEditing({
      ...isCardEditing,
      [position]: true,
    });
  };

  // 카드 편집 취소 함수
  const cancelEditingCard = (position: "first" | "second") => {
    setIsCardEditing({
      ...isCardEditing,
      [position]: false,
    });
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
        <div className="flex justify-center items-center mb-8 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            {isLoading
              ? "로딩 중..."
              : tabsData[activeTab as keyof typeof tabsData].label}
          </h2>

          {/* 드롭다운을 절대 위치로 배치 */}
          {!isLoading && canEdit && isEditMode && (
            <div className="absolute right-0" ref={dropdownRef}>
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
            <div className="absolute right-0 flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm">
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
                  {["first", "second"].map((position) => {
                    const card = getCardData(position as "first" | "second");
                    const icon = getCardIcon(position as "first" | "second");
                    const isEditing =
                      isCardEditing[position as "first" | "second"];

                    return (
                      <div
                        key={position}
                        className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 w-full max-w-lg"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            <div className="mr-3">{icon}</div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={
                                  editCardData[position as "first" | "second"]
                                    .title
                                }
                                onChange={(e) =>
                                  setEditCardData({
                                    ...editCardData,
                                    [position]: {
                                      ...editCardData[
                                        position as "first" | "second"
                                      ],
                                      title: e.target.value,
                                    },
                                  })
                                }
                                className="text-xl font-semibold text-gray-800 border-b border-gray-300 focus:border-blue-500 outline-none"
                                placeholder="제목을 입력하세요"
                              />
                            ) : (
                              <h3 className="text-xl font-semibold text-gray-800">
                                {card.title}
                              </h3>
                            )}
                          </div>
                          {canEdit && isEditMode && (
                            <div className="flex gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() =>
                                      saveCard(position as "first" | "second")
                                    }
                                    disabled={isCardLoading}
                                    className="text-green-500 hover:text-green-700 p-1 disabled:opacity-50"
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
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() =>
                                      cancelEditingCard(
                                        position as "first" | "second"
                                      )
                                    }
                                    disabled={isCardLoading}
                                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
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
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() =>
                                    startEditingCard(
                                      position as "first" | "second"
                                    )
                                  }
                                  className="text-blue-500 hover:text-blue-700 p-1"
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                부제목
                              </label>
                              <input
                                type="text"
                                value={
                                  editCardData[position as "first" | "second"]
                                    .subTitle
                                }
                                onChange={(e) =>
                                  setEditCardData({
                                    ...editCardData,
                                    [position]: {
                                      ...editCardData[
                                        position as "first" | "second"
                                      ],
                                      subTitle: e.target.value,
                                    },
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="부제목을 입력하세요"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                내용
                              </label>
                              <textarea
                                value={
                                  editCardData[position as "first" | "second"]
                                    .content
                                }
                                onChange={(e) =>
                                  setEditCardData({
                                    ...editCardData,
                                    [position]: {
                                      ...editCardData[
                                        position as "first" | "second"
                                      ],
                                      content: e.target.value,
                                    },
                                  })
                                }
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="내용을 입력하세요"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                              {card.subTitle}
                            </p>
                            <div className="text-gray-700 text-sm leading-relaxed">
                              {card.content}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 성격 & 가치관 탭 */}
              {activeTab === "personality" && (
                <div className="grid md:grid-cols-2 gap-8 justify-items-center">
                  {["first", "second"].map((position) => {
                    const card = getCardData(position as "first" | "second");
                    const icon = getCardIcon(position as "first" | "second");
                    const isEditing =
                      isCardEditing[position as "first" | "second"];

                    return (
                      <div
                        key={position}
                        className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 w-full max-w-lg"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            <div className="mr-3">{icon}</div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={
                                  editCardData[position as "first" | "second"]
                                    .title
                                }
                                onChange={(e) =>
                                  setEditCardData({
                                    ...editCardData,
                                    [position]: {
                                      ...editCardData[
                                        position as "first" | "second"
                                      ],
                                      title: e.target.value,
                                    },
                                  })
                                }
                                className="text-xl font-semibold text-gray-800 border-b border-gray-300 focus:border-blue-500 outline-none"
                                placeholder="제목을 입력하세요"
                              />
                            ) : (
                              <h3 className="text-xl font-semibold text-gray-800">
                                {card.title}
                              </h3>
                            )}
                          </div>
                          {canEdit && isEditMode && (
                            <div className="flex gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() =>
                                      saveCard(position as "first" | "second")
                                    }
                                    disabled={isCardLoading}
                                    className="text-green-500 hover:text-green-700 p-1 disabled:opacity-50"
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
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() =>
                                      cancelEditingCard(
                                        position as "first" | "second"
                                      )
                                    }
                                    disabled={isCardLoading}
                                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
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
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() =>
                                    startEditingCard(
                                      position as "first" | "second"
                                    )
                                  }
                                  className="text-blue-500 hover:text-blue-700 p-1"
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                부제목
                              </label>
                              <input
                                type="text"
                                value={
                                  editCardData[position as "first" | "second"]
                                    .subTitle
                                }
                                onChange={(e) =>
                                  setEditCardData({
                                    ...editCardData,
                                    [position]: {
                                      ...editCardData[
                                        position as "first" | "second"
                                      ],
                                      subTitle: e.target.value,
                                    },
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="부제목을 입력하세요"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                내용
                              </label>
                              <textarea
                                value={
                                  editCardData[position as "first" | "second"]
                                    .content
                                }
                                onChange={(e) =>
                                  setEditCardData({
                                    ...editCardData,
                                    [position]: {
                                      ...editCardData[
                                        position as "first" | "second"
                                      ],
                                      content: e.target.value,
                                    },
                                  })
                                }
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="내용을 입력하세요"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                              {card.subTitle}
                            </p>
                            <div className="text-gray-700 text-sm leading-relaxed">
                              {card.content}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 취미 & 관심사 탭 */}
              {activeTab === "interests" && (
                <div className="grid md:grid-cols-2 gap-8 justify-items-center">
                  {["first", "second"].map((position) => {
                    const card = getCardData(position as "first" | "second");
                    const icon = getCardIcon(position as "first" | "second");
                    const isEditing =
                      isCardEditing[position as "first" | "second"];

                    return (
                      <div
                        key={position}
                        className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 w-full max-w-lg"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            <div className="mr-3">{icon}</div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={
                                  editCardData[position as "first" | "second"]
                                    .title
                                }
                                onChange={(e) =>
                                  setEditCardData({
                                    ...editCardData,
                                    [position]: {
                                      ...editCardData[
                                        position as "first" | "second"
                                      ],
                                      title: e.target.value,
                                    },
                                  })
                                }
                                className="text-xl font-semibold text-gray-800 border-b border-gray-300 focus:border-blue-500 outline-none"
                                placeholder="제목을 입력하세요"
                              />
                            ) : (
                              <h3 className="text-xl font-semibold text-gray-800">
                                {card.title}
                              </h3>
                            )}
                          </div>
                          {canEdit && isEditMode && (
                            <div className="flex gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() =>
                                      saveCard(position as "first" | "second")
                                    }
                                    disabled={isCardLoading}
                                    className="text-green-500 hover:text-green-700 p-1 disabled:opacity-50"
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
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() =>
                                      cancelEditingCard(
                                        position as "first" | "second"
                                      )
                                    }
                                    disabled={isCardLoading}
                                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
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
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() =>
                                    startEditingCard(
                                      position as "first" | "second"
                                    )
                                  }
                                  className="text-blue-500 hover:text-blue-700 p-1"
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                부제목
                              </label>
                              <input
                                type="text"
                                value={
                                  editCardData[position as "first" | "second"]
                                    .subTitle
                                }
                                onChange={(e) =>
                                  setEditCardData({
                                    ...editCardData,
                                    [position]: {
                                      ...editCardData[
                                        position as "first" | "second"
                                      ],
                                      subTitle: e.target.value,
                                    },
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="부제목을 입력하세요"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                내용
                              </label>
                              <textarea
                                value={
                                  editCardData[position as "first" | "second"]
                                    .content
                                }
                                onChange={(e) =>
                                  setEditCardData({
                                    ...editCardData,
                                    [position]: {
                                      ...editCardData[
                                        position as "first" | "second"
                                      ],
                                      content: e.target.value,
                                    },
                                  })
                                }
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="내용을 입력하세요"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                              {card.subTitle}
                            </p>
                            <div className="text-gray-700 text-sm leading-relaxed">
                              {card.content}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 경험 & 성취 탭 */}
              {activeTab === "experience" && (
                <div className="grid md:grid-cols-2 gap-8 justify-items-center">
                  {["first", "second"].map((position) => {
                    const card = getCardData(position as "first" | "second");
                    const icon = getCardIcon(position as "first" | "second");
                    const isEditing =
                      isCardEditing[position as "first" | "second"];

                    return (
                      <div
                        key={position}
                        className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 w-full max-w-lg"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            <div className="mr-3">{icon}</div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={
                                  editCardData[position as "first" | "second"]
                                    .title
                                }
                                onChange={(e) =>
                                  setEditCardData({
                                    ...editCardData,
                                    [position]: {
                                      ...editCardData[
                                        position as "first" | "second"
                                      ],
                                      title: e.target.value,
                                    },
                                  })
                                }
                                className="text-xl font-semibold text-gray-800 border-b border-gray-300 focus:border-blue-500 outline-none"
                                placeholder="제목을 입력하세요"
                              />
                            ) : (
                              <h3 className="text-xl font-semibold text-gray-800">
                                {card.title}
                              </h3>
                            )}
                          </div>
                          {canEdit && isEditMode && (
                            <div className="flex gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() =>
                                      saveCard(position as "first" | "second")
                                    }
                                    disabled={isCardLoading}
                                    className="text-green-500 hover:text-green-700 p-1 disabled:opacity-50"
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
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() =>
                                      cancelEditingCard(
                                        position as "first" | "second"
                                      )
                                    }
                                    disabled={isCardLoading}
                                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
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
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() =>
                                    startEditingCard(
                                      position as "first" | "second"
                                    )
                                  }
                                  className="text-blue-500 hover:text-blue-700 p-1"
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                부제목
                              </label>
                              <input
                                type="text"
                                value={
                                  editCardData[position as "first" | "second"]
                                    .subTitle
                                }
                                onChange={(e) =>
                                  setEditCardData({
                                    ...editCardData,
                                    [position]: {
                                      ...editCardData[
                                        position as "first" | "second"
                                      ],
                                      subTitle: e.target.value,
                                    },
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="부제목을 입력하세요"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                내용
                              </label>
                              <textarea
                                value={
                                  editCardData[position as "first" | "second"]
                                    .content
                                }
                                onChange={(e) =>
                                  setEditCardData({
                                    ...editCardData,
                                    [position]: {
                                      ...editCardData[
                                        position as "first" | "second"
                                      ],
                                      content: e.target.value,
                                    },
                                  })
                                }
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="내용을 입력하세요"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                              {card.subTitle}
                            </p>
                            <div className="text-gray-700 text-sm leading-relaxed">
                              {card.content}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
