import { CardDto, CardResponse, CardResponseOrNull } from "../type/card";
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
  ): Promise<CardResponseOrNull> {
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
        // 500 에러는 데이터가 없는 정상적인 상황으로 처리
        if (response.status === 500) {
          return null;
        }
        return null;
      }

      const data = await response.json();
      return data;
    } catch {
      // 네트워크 에러 등 발생 시 null 반환 (정상적인 상황으로 처리)
      return null;
    }
  } // 2번 카드 생성
  async createSecond(req: CardDto, skillId: number): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/api/card/second?skillId=${skillId}`,
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
  ): Promise<CardResponseOrNull> {
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
        // 500 에러는 데이터가 없는 정상적인 상황으로 처리
        if (response.status === 500) {
          return null;
        }
        return null;
      }

      const data = await response.json();
      return data;
    } catch {
      // 네트워크 에러 등 발생 시 null 반환
      return null;
    }
  }
}

export const cardService = new CardService();
