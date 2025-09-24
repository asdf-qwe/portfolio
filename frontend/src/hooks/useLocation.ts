import { useState, useEffect } from "react";
import { LocationResponse } from "@/types/location";
import {
  getUserLocation,
  updateUserLocation,
} from "@/features/main/service/locationService";

export const useLocation = (userId: string, canEdit: boolean) => {
  const [currentLocation, setCurrentLocation] = useState<LocationResponse>({
    lat: 0,
    lng: 0,
    address: "",
    email: "",
    phoneNumber: "",
  });
  const [locationLoading, setLocationLoading] = useState(true);

  // 이메일/전화번호 편집 모달 상태
  const [isEmailEditModalOpen, setIsEmailEditModalOpen] = useState(false);
  const [isPhoneEditModalOpen, setIsPhoneEditModalOpen] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);

  // 위치 데이터 가져오기
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLocationLoading(true);
        const locationData = await getUserLocation(parseInt(userId));
        setCurrentLocation(locationData);
      } catch (error) {
        console.error("위치 데이터 조회 실패:", error);
        // 에러 시 기본값 유지
      } finally {
        setLocationLoading(false);
      }
    };

    fetchLocationData();
  }, [userId]);

  // 이메일 업데이트 함수
  const updateEmail = async () => {
    if (!canEdit || !editEmail.trim()) return;

    try {
      setIsUpdatingContact(true);
      const locationData = {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        address: currentLocation.address,
        email: editEmail.trim(),
        phoneNumber: currentLocation.phoneNumber || "",
      };

      await updateUserLocation(parseInt(userId), locationData);
      setCurrentLocation(locationData);
      setIsEmailEditModalOpen(false);
      setEditEmail("");
    } catch (error) {
      console.error("이메일 업데이트 실패:", error);
      alert("이메일 업데이트에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUpdatingContact(false);
    }
  };

  // 전화번호 업데이트 함수
  const updatePhoneNumber = async () => {
    if (!canEdit || !editPhoneNumber.trim()) return;

    try {
      setIsUpdatingContact(true);
      const locationData = {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        address: currentLocation.address,
        email: currentLocation.email || "",
        phoneNumber: editPhoneNumber.trim(),
      };

      await updateUserLocation(parseInt(userId), locationData);
      setCurrentLocation(locationData);
      setIsPhoneEditModalOpen(false);
      setEditPhoneNumber("");
    } catch (error) {
      console.error("전화번호 업데이트 실패:", error);
      alert("전화번호 업데이트에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUpdatingContact(false);
    }
  };

  return {
    currentLocation,
    locationLoading,
    isEmailEditModalOpen,
    setIsEmailEditModalOpen,
    isPhoneEditModalOpen,
    setIsPhoneEditModalOpen,
    editEmail,
    setEditEmail,
    editPhoneNumber,
    setEditPhoneNumber,
    isUpdatingContact,
    updateEmail,
    updatePhoneNumber,
    setCurrentLocation,
  };
};
