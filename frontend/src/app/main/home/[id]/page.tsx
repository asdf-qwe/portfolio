"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import SkillsTabs from "@/components/SkillsTabs";
import { WorkHistory } from "@/features/main/type/main";
import { MAIN_PAGE_CONSTANTS, KakaoPlace } from "@/constants/mainPageConstants";

// 새로운 컴포넌트들 import
import { NavigationBar } from "@/components/NavigationBar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";

// 핸들러 import
import {
  createHomePageActions,
  HomePageState,
} from "@/handlers/homePageHandlers";

interface HomePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function HomePage({ params }: HomePageProps) {
  const resolvedParams = React.use(params);
  const { isLoggedIn, user, logout } = useAuth();
  const userId = resolvedParams.id;

  // HomePageState로 상태 관리
  const [state, setState] = useState<HomePageState>({
    // 카테고리 상태
    categories: [],
    categoriesLoading: true,
    currentPage: 0,
    totalPages: 0,
    itemsPerPage: 3, // 한 페이지에 3개의 프로젝트 표시
    isCreatingCategory: false,
    newCategoryTitle: "",
    showCreateForm: false,

    // 프로필 이미지 상태
    profileImageUrl: MAIN_PAGE_CONSTANTS.IMAGES.DEFAULT_PROFILE,
    isUploadingProfile: false,
    profileImageLoading: true,

    // 메인 데이터 상태
    mainData: null,
    mainDataLoading: true,
    isEditingMain: false,
    editMainData: {
      greeting: "",
      smallGreeting: "",
      name: "",
      introduce: "",
      job: "",
      workHistory: WorkHistory.ZERO,
    },
    isSavingMain: false,

    // 전역 편집 모드
    isGlobalEditMode: false,

    // Kakao Maps 상태
    isKakaoMapsLoaded: false,

    // 위치 정보 상태
    currentLocation: {
      lat: 0,
      lng: 0,
      address: "",
      email: "",
      phoneNumber: "",
    },
    locationLoading: true,

    // 모달 상태
    isMapSearchModalOpen: false,
    searchKeyword: "",
    searchResults: [],
    isSearching: false,
    selectedPlace: null,
    isEmailEditModalOpen: false,
    isPhoneEditModalOpen: false,
    editEmail: "",
    editPhoneNumber: "",
    isUpdatingContact: false,
  });

  // 핸들러 생성
  const actions = createHomePageActions(state, setState, userId);

  // 프로필 이미지 가져오기
  useEffect(() => {
    actions.fetchProfileImage(userId);
  }, [userId]);

  // 메인 데이터 가져오기
  useEffect(() => {
    actions.fetchMainData(userId);
  }, [userId]);

  // 위치 데이터 가져오기
  useEffect(() => {
    actions.fetchLocationData(userId);
  }, [userId]);

  // 카테고리 데이터 가져오기
  useEffect(() => {
    actions.fetchCategories(userId);
  }, [userId]);

  // Kakao Maps SDK 로드 확인
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || "",
    libraries: ["services", "clusterer", "drawing"],
  });

  useEffect(() => {
    if (!loading && !error) {
      setState((prev) => ({ ...prev, isKakaoMapsLoaded: true }));
    } else if (error) {
      console.error("❌ Kakao Maps SDK 로드 실패:", error);
    }
  }, [loading, error]);

  // 모달 ESC 키 핸들러
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (state.isMapSearchModalOpen) {
          setState((prev) => ({
            ...prev,
            isMapSearchModalOpen: false,
            searchKeyword: "",
            searchResults: [],
          }));
        }
        if (state.isEmailEditModalOpen) {
          setState((prev) => ({
            ...prev,
            isEmailEditModalOpen: false,
            editEmail: "",
          }));
        }
        if (state.isPhoneEditModalOpen) {
          setState((prev) => ({
            ...prev,
            isPhoneEditModalOpen: false,
            editPhoneNumber: "",
          }));
        }
      }
    };

    if (
      state.isMapSearchModalOpen ||
      state.isEmailEditModalOpen ||
      state.isPhoneEditModalOpen
    ) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // 스크롤 막기
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset"; // 스크롤 복원
    };
  }, [
    state.isMapSearchModalOpen,
    state.isEmailEditModalOpen,
    state.isPhoneEditModalOpen,
  ]);

  // 검색 결과 선택 함수
  const selectPlace = async (place: KakaoPlace) => {
    await actions.selectPlace(place, userId, !!canEdit);
  };

  // 이메일 업데이트 함수
  const updateEmail = async () => {
    await actions.updateEmail(userId, !!canEdit);
  };

  // 전화번호 업데이트 함수
  const updatePhoneNumber = async () => {
    await actions.updatePhoneNumber(userId, !!canEdit);
  };

  // 프로필 이미지 업로드 처리
  const handleProfileImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await actions.handleProfileImageUpload(event, userId, !!canEdit);
  };

  // 카테고리 생성 함수
  const handleCreateCategory = async () => {
    await actions.handleCreateCategory(userId, !!canEdit);
  };

  // 접근 권한 체크
  const isOwner = isLoggedIn && user && user.id?.toString() === userId;
  const canEdit = isOwner;

  // 전역 편집 모드 토글
  const toggleGlobalEditMode = () => {
    actions.toggleGlobalEditMode(!!canEdit);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <NavigationBar
        userId={userId}
        canEdit={!!canEdit}
        isGlobalEditMode={state.isGlobalEditMode}
        isSavingMain={state.isSavingMain}
        onToggleEditMode={toggleGlobalEditMode}
        onLogout={logout}
      />

      {/* Hero Section */}
      <HeroSection
        mainData={state.mainData}
        mainDataLoading={state.mainDataLoading}
        isEditingMain={state.isEditingMain}
        editMainData={state.editMainData}
        setEditMainData={(data) =>
          setState((prev) => ({
            ...prev,
            editMainData:
              typeof data === "function" ? data(prev.editMainData) : data,
          }))
        }
        isGlobalEditMode={state.isGlobalEditMode}
        onScrollToProjects={actions.scrollToProjects}
      />

      {/* About Section */}
      <AboutSection
        mainData={state.mainData}
        mainDataLoading={state.mainDataLoading}
        isEditingMain={state.isEditingMain}
        editMainData={state.editMainData}
        setEditMainData={(data) =>
          setState((prev) => ({
            ...prev,
            editMainData:
              typeof data === "function" ? data(prev.editMainData) : data,
          }))
        }
        profileImageUrl={state.profileImageUrl}
        profileImageLoading={state.profileImageLoading}
        canEdit={!!canEdit}
        isUploadingProfile={state.isUploadingProfile}
        onProfileImageUpload={handleProfileImageUpload}
      />

      {/* Skills Tabs Section */}
      <SkillsTabs
        canEdit={!!canEdit}
        isEditMode={state.isGlobalEditMode}
        userId={parseInt(userId)}
      />

      {/* Featured Projects Section */}
      <ProjectsSection
        categories={state.categories}
        categoriesLoading={state.categoriesLoading}
        currentPage={state.currentPage}
        totalPages={Math.ceil(state.categories.length / state.itemsPerPage)}
        itemsPerPage={state.itemsPerPage}
        canEdit={!!canEdit}
        userId={userId}
        showCreateForm={state.showCreateForm}
        setShowCreateForm={(show) =>
          setState((prev) => ({ ...prev, showCreateForm: show }))
        }
        newCategoryTitle={state.newCategoryTitle}
        setNewCategoryTitle={(title) =>
          setState((prev) => ({ ...prev, newCategoryTitle: title }))
        }
        isCreatingCategory={state.isCreatingCategory}
        onCreateCategory={handleCreateCategory}
        onGoToPreviousPage={actions.goToPreviousPage}
        onGoToNextPage={actions.goToNextPage}
      />

      {/* Contact Section */}
      <ContactSection
        currentLocation={state.currentLocation}
        locationLoading={state.locationLoading}
        isGlobalEditMode={state.isGlobalEditMode}
        isEmailEditModalOpen={state.isEmailEditModalOpen}
        isPhoneEditModalOpen={state.isPhoneEditModalOpen}
        isMapSearchModalOpen={state.isMapSearchModalOpen}
        editEmail={state.editEmail}
        editPhoneNumber={state.editPhoneNumber}
        isUpdatingContact={state.isUpdatingContact}
        searchKeyword={state.searchKeyword}
        searchResults={state.searchResults}
        isSearching={state.isSearching}
        onEmailIconClick={() => {
          setState((prev) => ({
            ...prev,
            editEmail: state.currentLocation.email || "",
            isEmailEditModalOpen: true,
          }));
        }}
        onPhoneIconClick={() => {
          setState((prev) => ({
            ...prev,
            editPhoneNumber: state.currentLocation.phoneNumber || "",
            isPhoneEditModalOpen: true,
          }));
        }}
        onLocationIconClick={() =>
          setState((prev) => ({ ...prev, isMapSearchModalOpen: true }))
        }
        onEmailModalClose={() => {
          setState((prev) => ({
            ...prev,
            isEmailEditModalOpen: false,
            editEmail: "",
          }));
        }}
        onPhoneModalClose={() => {
          setState((prev) => ({
            ...prev,
            isPhoneEditModalOpen: false,
            editPhoneNumber: "",
          }));
        }}
        onLocationModalClose={() => {
          setState((prev) => ({
            ...prev,
            isMapSearchModalOpen: false,
            searchKeyword: "",
            searchResults: [],
          }));
        }}
        onEmailChange={(email) =>
          setState((prev) => ({ ...prev, editEmail: email }))
        }
        onPhoneChange={(phone) =>
          setState((prev) => ({ ...prev, editPhoneNumber: phone }))
        }
        onEmailUpdate={updateEmail}
        onPhoneUpdate={updatePhoneNumber}
        onSearchInput={actions.handleSearchInput}
        onPlaceSelect={selectPlace}
      />
    </main>
  );
}
