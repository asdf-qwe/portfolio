import { LocationData, LocationResponse } from "@/types/location";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const updateUserLocation = async (
  userId: number,
  locationData: LocationData
): Promise<LocationResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/location`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
    body: JSON.stringify(locationData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`위치 업데이트 실패: ${error}`);
  }

  return response.json();
};

export const getUserLocation = async (
  userId: number
): Promise<LocationResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/location`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`위치 조회 실패: ${error}`);
  }

  return response.json();
};
