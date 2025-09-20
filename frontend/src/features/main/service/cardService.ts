import { CardDto, CardResponse } from "../type/card";
import { CategoryName } from "../type/skillCategory";

class CardService {
  private readonly baseUrl = `${
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
  }`;

  // 1번 카드 생성
  async createFirst(
    req: CardDto,
    categoryName: CategoryName,
    skillId: number
  ): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/api/card?skillId=${skillId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(req),
      }
    );
    if (!response.ok) {
      throw new Error(
        `1번 카드 생성 실패: ${response.status} ${response.statusText}`
      );
    }
    return (await response.text()) || "생성 완료";
  }

  // 1번 카드 수정
  async updateFirst(
    req: CardDto,
    categoryName: CategoryName,
    skillId: number
  ): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/api/card?categoryName=${categoryName}&skillId=${skillId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(req),
      }
    );
    if (!response.ok) {
      throw new Error(
        `1번 카드 수정 실패: ${response.status} ${response.statusText}`
      );
    }
    return (await response.text()) || "수정 완료";
  }

  // 1번 카드 조회
  async getFirst(
    categoryName: CategoryName,
    skillId: number
  ): Promise<CardResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/card?categoryName=${categoryName}&skillId=${skillId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
        }
      );

      if (!response.ok) {
        console.log(
          `getFirst: ${categoryName} 카테고리에 데이터가 없습니다 (${response.status})`
        );
        return null as any;
      }

      const data = await response.json();
      console.log("getFirst 조회 성공:", data);
      return data;
    } catch (error) {
      console.log(
        `getFirst: ${categoryName} 카테고리 데이터 조회 중 네트워크 오류 - 더미 데이터 사용`
      );
      // 네트워크 에러 등 발생 시 null 반환 (정상적인 상황으로 처리)
      return null as any;
    }
  } // 2번 카드 생성
  async createSecond(
    req: CardDto,
    categoryName: CategoryName,
    skillId: number
  ): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/api/card/second?categoryName=${categoryName}&skillId=${skillId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(req),
      }
    );
    if (!response.ok) {
      throw new Error(
        `2번 카드 생성 실패: ${response.status} ${response.statusText}`
      );
    }
    return (await response.text()) || "생성 완료";
  }

  // 2번 카드 수정
  async updateSecond(
    req: CardDto,
    categoryName: CategoryName,
    skillId: number
  ): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/api/card/second?categoryName=${categoryName}&skillId=${skillId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(req),
      }
    );
    if (!response.ok) {
      throw new Error(
        `2번 카드 수정 실패: ${response.status} ${response.statusText}`
      );
    }
    return (await response.text()) || "수정 완료";
  }

  // 2번 카드 조회
  async getSecond(
    categoryName: CategoryName,
    skillId: number
  ): Promise<CardResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/card/second?categoryName=${categoryName}&skillId=${skillId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
        }
      );

      if (!response.ok) {
        console.log(
          `getSecond: ${categoryName} 카테고리에 데이터가 없습니다 (${response.status})`
        );
        return null as any;
      }

      const data = await response.json();
      console.log("getSecond 조회 성공:", data);
      return data;
    } catch (error) {
      console.log(
        `getSecond: ${categoryName} 카테고리 데이터 조회 중 네트워크 오류 - 더미 데이터 사용`
      );
      // 네트워크 에러 등 발생 시 null 반환 (정상적인 상황으로 처리)
      return null as any;
    }
  }
}

export const cardService = new CardService();
