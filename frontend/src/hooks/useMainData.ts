import { useState, useEffect } from "react";
import { mainService } from "@/features/main/service/mainService";
import { MainResponse } from "@/features/main/type/main";
import { WorkHistory } from "@/features/main/type/main";

export const useMainData = (userId: string) => {
  const [mainData, setMainData] = useState<MainResponse | null>(null);
  const [mainDataLoading, setMainDataLoading] = useState(true);

  // 메인 데이터 편집 상태 관리
  const [isEditingMain, setIsEditingMain] = useState(false);
  const [editMainData, setEditMainData] = useState({
    greeting: "",
    smallGreeting: "",
    name: "",
    introduce: "",
    job: "",
    workHistory: WorkHistory.ZERO,
  });
  const [isSavingMain, setIsSavingMain] = useState(false);

  // 메인 데이터 가져오기
  useEffect(() => {
    const fetchMainData = async () => {
      try {
        setMainDataLoading(true);
        const data = await mainService.getMain(parseInt(userId));
        setMainData(data);
      } catch (error) {
        console.error("메인 데이터 조회 실패:", error);
        // 에러 시 기본값 설정
        setMainData({
          greeting: "안녕하세요!",
          smallGreeting: "열정과 책임감이 있는 개발자입니다.",
          name: "사용자",
          introduce:
            "새로운 기술을 배우고 적용할 때 신기해 하고 좋아하며, 사용자 경험을 개선하는 데 열정을 가지고 있습니다.",
          job: "",
          workHistory: WorkHistory.ZERO,
        });
      } finally {
        setMainDataLoading(false);
      }
    };

    fetchMainData();
  }, [userId]);

  // 메인 데이터 저장
  const saveMainData = async () => {
    if (!mainData) return;

    try {
      setIsSavingMain(true);

      await mainService.updateMain(editMainData, parseInt(userId));

      // 저장 후 데이터 새로고침
      const updatedData = await mainService.getMain(parseInt(userId));
      setMainData(updatedData);

      setIsEditingMain(false);
    } catch (error) {
      console.error("메인 정보 저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSavingMain(false);
    }
  };

  // 편집 모드 토글
  const toggleEditMode = () => {
    if (!isEditingMain) {
      // 편집 모드 진입
      if (mainData) {
        setEditMainData({
          greeting: mainData.greeting,
          smallGreeting: mainData.smallGreeting,
          name: mainData.name,
          introduce: mainData.introduce,
          job: mainData.job || "",
          workHistory: mainData.workHistory || WorkHistory.ZERO,
        });
        setIsEditingMain(true);
      }
    } else {
      // 편집 모드 종료
      setIsEditingMain(false);
      setEditMainData({
        greeting: "",
        smallGreeting: "",
        name: "",
        introduce: "",
        job: "",
        workHistory: WorkHistory.ZERO,
      });
    }
  };

  return {
    mainData,
    mainDataLoading,
    isEditingMain,
    setIsEditingMain,
    editMainData,
    setEditMainData,
    isSavingMain,
    saveMainData,
    toggleEditMode,
  };
};
