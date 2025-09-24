import React from "react";
import { CategoryResponse } from "@/features/category/types/category";
import { categoryService } from "@/features/category/service/categoryService";
import { uploadProfileImage, getUserProfileImage } from "@/features/upload/service/uploadService";
import { getUserLocation, updateUserLocation } from "@/features/main/service/locationService";
import { mainService } from "@/features/main/service/mainService";
import { MainResponse } from "@/features/main/type/main";
import { WorkHistory } from "@/features/main/type/main";
import { KakaoPlace } from "@/constants/mainPageConstants";
import { LocationResponse } from "@/types/location";

export interface HomePageState {
  // 카테고리 관련 상태
  categories: CategoryResponse[];
  categoriesLoading: boolean;

  // 페이징 관련 상태
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;

  // 카테고리 생성 관련 상태
  isCreatingCategory: boolean;
  newCategoryTitle: string;
  showCreateForm: boolean;

  // 프로필 이미지 상태
  profileImageUrl: string;
  isUploadingProfile: boolean;
  profileImageLoading: boolean;

  // 메인 데이터 상태
  mainData: MainResponse | null;
  mainDataLoading: boolean;

  // 메인 데이터 편집 상태
  isEditingMain: boolean;
  editMainData: {
    greeting: string;
    smallGreeting: string;
    name: string;
    introduce: string;
    job: string;
    workHistory: WorkHistory;
  };
  isSavingMain: boolean;

  // 전역 편집 모드 상태
  isGlobalEditMode: boolean;

  // 위치 정보 상태
  currentLocation: LocationResponse;
  locationLoading: boolean;

  // 지도 검색 모달 상태
  isMapSearchModalOpen: boolean;
  searchKeyword: string;
  searchResults: KakaoPlace[];
  isSearching: boolean;
  selectedPlace: KakaoPlace | null;

  // 이메일/전화번호 편집 모달 상태
  isEmailEditModalOpen: boolean;
  isPhoneEditModalOpen: boolean;
  editEmail: string;
  editPhoneNumber: string;
  isUpdatingContact: boolean;

  // Kakao Maps 상태
  isKakaoMapsLoaded: boolean;
}

export interface HomePageActions {
  // 데이터 로딩 함수들
  fetchCategories: (userId: string) => Promise<void>;
  fetchProfileImage: (userId: string) => Promise<void>;
  fetchMainData: (userId: string) => Promise<void>;
  fetchLocationData: (userId: string) => Promise<void>;

  // 이벤트 핸들러들
  handleLogout: () => Promise<void>;
  handleProfileImageUpload: (event: React.ChangeEvent<HTMLInputElement>, userId: string, canEdit: boolean) => Promise<void>;
  handleCreateCategory: (userId: string, canEdit: boolean) => Promise<void>;
  scrollToProjects: (e: React.MouseEvent) => void;
  saveMainData: (userId: string, canEdit: boolean) => Promise<void>;
  toggleGlobalEditMode: (canEdit: boolean) => void;

  // 지도 검색 관련 핸들러들
  searchPlaces: (keyword: string, isKakaoMapsLoaded: boolean) => Promise<void>;
  selectPlace: (place: KakaoPlace, userId: string, canEdit: boolean) => Promise<void>;
  updateEmail: (userId: string, canEdit: boolean) => Promise<void>;
  updatePhoneNumber: (userId: string, canEdit: boolean) => Promise<void>;
  handleSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;

  // 페이지 이동 함수들
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

export const createHomePageActions = (
  state: HomePageState,
  setState: React.Dispatch<React.SetStateAction<HomePageState>>,
  userId: string
): HomePageActions => {
  // 검색 디바운싱을 위한 변수
  let searchTimeout: NodeJS.Timeout | null = null;

  // 데이터 로딩 함수들
  const fetchCategories = async (userId: string) => {
    try {
      setState(prev => ({ ...prev, categoriesLoading: true }));
      const categoriesData = await categoryService.getCategories(parseInt(userId));
      setState(prev => ({ ...prev, categories: categoriesData }));
    } catch (error) {
      console.error("카테고리 조회 실패:", error);
      setState(prev => ({ ...prev, categories: [] }));
    } finally {
      setState(prev => ({ ...prev, categoriesLoading: false }));
    }
  };

  const fetchProfileImage = async (userId: string) => {
    try {
      setState(prev => ({ ...prev, profileImageLoading: true }));
      const imageUrl = await getUserProfileImage(parseInt(userId));
      if (imageUrl) {
        setState(prev => ({ ...prev, profileImageUrl: imageUrl }));
      }
    } catch (error) {
      console.error("프로필 이미지 조회 실패:", error);
    } finally {
      setState(prev => ({ ...prev, profileImageLoading: false }));
    }
  };

  const fetchMainData = async (userId: string) => {
    try {
      setState(prev => ({ ...prev, mainDataLoading: true }));
      const data = await mainService.getMain(parseInt(userId));
      setState(prev => ({ ...prev, mainData: data }));
    } catch (error) {
      console.error("메인 데이터 조회 실패:", error);
      setState(prev => ({
        ...prev,
        mainData: {
          greeting: "안녕하세요!",
          smallGreeting: "열정과 책임감이 있는 개발자입니다.",
          name: "사용자",
          introduce: "새로운 기술을 배우고 적용할 때 신기해 하고 좋아하며, 사용자 경험을 개선하는 데 열정을 가지고 있습니다.",
          job: "",
          workHistory: WorkHistory.ZERO,
        }
      }));
    } finally {
      setState(prev => ({ ...prev, mainDataLoading: false }));
    }
  };

  const fetchLocationData = async (userId: string) => {
    try {
      setState(prev => ({ ...prev, locationLoading: true }));
      const locationData = await getUserLocation(parseInt(userId));
      setState(prev => ({ ...prev, currentLocation: locationData }));
    } catch (error) {
      console.error("위치 데이터 조회 실패:", error);
    } finally {
      setState(prev => ({ ...prev, locationLoading: false }));
    }
  };

  // 이벤트 핸들러들
  const handleLogout = async () => {
    // 실제 logout 로직은 컴포넌트에서 처리
    console.log("로그아웃 처리");
  };

  const handleProfileImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    userId: string,
    canEdit: boolean
  ) => {
    const file = event.target.files?.[0];
    if (!file || !canEdit) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    try {
      setState(prev => ({ ...prev, isUploadingProfile: true }));
      const imageUrl = await uploadProfileImage(file, parseInt(userId));
      setState(prev => ({ ...prev, profileImageUrl: imageUrl }));
      alert("프로필 이미지가 성공적으로 업로드되었습니다!");
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      alert("프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setState(prev => ({ ...prev, isUploadingProfile: false }));
    }
  };

  const handleCreateCategory = async (userId: string, canEdit: boolean) => {
    if (!state.newCategoryTitle.trim()) {
      alert("카테고리 제목을 입력해주세요.");
      return;
    }

    if (!canEdit) {
      alert("카테고리 생성 권한이 없습니다.");
      return;
    }

    try {
      setState(prev => ({ ...prev, isCreatingCategory: true }));
      await categoryService.createCategory(
        { categoryTitle: state.newCategoryTitle.trim() },
        parseInt(userId)
      );

      const categoriesData = await categoryService.getCategories(parseInt(userId));
      setState(prev => ({
        ...prev,
        categories: categoriesData,
        newCategoryTitle: "",
        showCreateForm: false
      }));
    } catch (error) {
      console.error("카테고리 생성 실패:", error);
      alert("프로젝트 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setState(prev => ({ ...prev, isCreatingCategory: false }));
    }
  };

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const projectsSection = document.getElementById("projects");
    projectsSection?.scrollIntoView({ behavior: "smooth" });
  };

  const saveMainData = async (userId: string, canEdit: boolean) => {
    if (!canEdit) return;

    try {
      setState(prev => ({ ...prev, isSavingMain: true }));
      await mainService.updateMain(state.editMainData, parseInt(userId));
      const updatedData = await mainService.getMain(parseInt(userId));
      setState(prev => ({
        ...prev,
        mainData: updatedData,
        isEditingMain: false,
        isGlobalEditMode: false
      }));
    } catch (error) {
      console.error("메인 정보 저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setState(prev => ({ ...prev, isSavingMain: false }));
    }
  };

  const toggleGlobalEditMode = (canEdit: boolean) => {
    if (!canEdit) return;

    if (!state.isGlobalEditMode) {
      setState(prev => ({ ...prev, isGlobalEditMode: true }));
      if (state.mainData) {
        setState(prev => ({
          ...prev,
          editMainData: {
            greeting: state.mainData!.greeting,
            smallGreeting: state.mainData!.smallGreeting,
            name: state.mainData!.name,
            introduce: state.mainData!.introduce,
            job: state.mainData!.job || "",
            workHistory: state.mainData!.workHistory || WorkHistory.ZERO,
          },
          isEditingMain: true
        }));
      }
    } else {
      setState(prev => ({
        ...prev,
        isGlobalEditMode: false,
        isEditingMain: false,
        editMainData: {
          greeting: "",
          smallGreeting: "",
          name: "",
          introduce: "",
          job: "",
          workHistory: WorkHistory.ZERO,
        }
      }));
    }
  };

  // 지도 검색 관련 핸들러들
  const searchPlaces = async (keyword: string, isKakaoMapsLoaded: boolean) => {
    if (!keyword.trim()) return;

    if (!isKakaoMapsLoaded) {
      console.error("❌ Kakao Maps SDK가 아직 로드되지 않음");
      setState(prev => ({ ...prev, searchResults: [], isSearching: false }));
      return;
    }

    setState(prev => ({ ...prev, isSearching: true }));
    try {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(keyword, (data: KakaoPlace[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setState(prev => ({ ...prev, searchResults: data }));
        } else {
          setState(prev => ({ ...prev, searchResults: [] }));
        }
        setState(prev => ({ ...prev, isSearching: false }));
      });
    } catch (error) {
      console.error("💥 장소 검색 에러:", error);
      setState(prev => ({ ...prev, searchResults: [], isSearching: false }));
    }
  };

  const selectPlace = async (place: KakaoPlace, userId: string, canEdit: boolean) => {
    if (!canEdit) return;

    try {
      const locationData = {
        lat: parseFloat(place.y),
        lng: parseFloat(place.x),
        address: place.place_name,
        email: state.currentLocation.email || "",
        phoneNumber: state.currentLocation.phoneNumber || "",
      };

      await updateUserLocation(parseInt(userId), locationData);
      setState(prev => ({
        ...prev,
        currentLocation: locationData,
        isMapSearchModalOpen: false,
        searchKeyword: "",
        searchResults: []
      }));
    } catch (error) {
      console.error("위치 저장 실패:", error);
      alert("위치 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const updateEmail = async (userId: string, canEdit: boolean) => {
    if (!canEdit || !state.editEmail.trim()) return;

    try {
      setState(prev => ({ ...prev, isUpdatingContact: true }));
      const locationData = {
        lat: state.currentLocation.lat,
        lng: state.currentLocation.lng,
        address: state.currentLocation.address,
        email: state.editEmail.trim(),
        phoneNumber: state.currentLocation.phoneNumber || "",
      };

      await updateUserLocation(parseInt(userId), locationData);
      setState(prev => ({
        ...prev,
        currentLocation: locationData,
        isEmailEditModalOpen: false,
        editEmail: ""
      }));
    } catch (error) {
      console.error("이메일 업데이트 실패:", error);
      alert("이메일 업데이트에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setState(prev => ({ ...prev, isUpdatingContact: false }));
    }
  };

  const updatePhoneNumber = async (userId: string, canEdit: boolean) => {
    if (!canEdit || !state.editPhoneNumber.trim()) return;

    try {
      setState(prev => ({ ...prev, isUpdatingContact: true }));
      const locationData = {
        lat: state.currentLocation.lat,
        lng: state.currentLocation.lng,
        address: state.currentLocation.address,
        email: state.currentLocation.email || "",
        phoneNumber: state.editPhoneNumber.trim(),
      };

      await updateUserLocation(parseInt(userId), locationData);
      setState(prev => ({
        ...prev,
        currentLocation: locationData,
        isPhoneEditModalOpen: false,
        editPhoneNumber: ""
      }));
    } catch (error) {
      console.error("전화번호 업데이트 실패:", error);
      alert("전화번호 업데이트에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setState(prev => ({ ...prev, isUpdatingContact: false }));
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState(prev => ({ ...prev, searchKeyword: value }));

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (value.trim()) {
      searchTimeout = setTimeout(() => {
        searchPlaces(value, state.isKakaoMapsLoaded);
      }, 300);
    } else {
      setState(prev => ({ ...prev, searchResults: [] }));
    }
  };

  const handleSearch = () => {
    if (state.searchKeyword.trim()) {
      searchPlaces(state.searchKeyword, state.isKakaoMapsLoaded);
    }
  };

  // 페이지 이동 함수들
  const goToPreviousPage = () => {
    setState(prev => ({ ...prev, currentPage: Math.max(0, prev.currentPage - 1) }));
  };

  const goToNextPage = () => {
    setState(prev => ({ ...prev, currentPage: Math.min(prev.totalPages - 1, prev.currentPage + 1) }));
  };

  return {
    fetchCategories,
    fetchProfileImage,
    fetchMainData,
    fetchLocationData,
    handleLogout,
    handleProfileImageUpload,
    handleCreateCategory,
    scrollToProjects,
    saveMainData,
    toggleGlobalEditMode,
    searchPlaces,
    selectPlace,
    updateEmail,
    updatePhoneNumber,
    handleSearchInput,
    handleSearch,
    goToPreviousPage,
    goToNextPage,
  };
};
