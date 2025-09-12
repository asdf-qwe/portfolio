const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * 전역 API 클라이언트 (자동 토큰 갱신 포함)
 */
export class ApiClient {
  private static instance: ApiClient;
  private isRefreshing = false;
  private refreshPromise: Promise<any> | null = null;

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async request(url: string, options: RequestInit = {}): Promise<Response> {
    const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

    let response = await fetch(fullUrl, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // 401 에러 시 토큰 갱신 시도
    if (
      response.status === 401 &&
      !url.includes("/refresh") &&
      !url.includes("/login")
    ) {
      try {
        await this.refreshToken();

        // 갱신 성공 시 원래 요청 재시도
        response = await fetch(fullUrl, {
          ...options,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
        });
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        // 로그인 페이지로 리다이렉트 또는 로그아웃 처리
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("인증이 만료되었습니다. 다시 로그인해주세요");
      }
    }

    return response;
  }

  private async refreshToken(): Promise<void> {
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = fetch(`${API_URL}/api/v1/users/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("토큰 갱신에 실패했습니다");
        }
        return response.json();
      })
      .finally(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  async get(
    url: string,
    options: { params?: Record<string, any> } & RequestInit = {}
  ): Promise<any> {
    const { params, ...requestOptions } = options;

    // 쿼리 매개변수 처리
    let finalUrl = url;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        finalUrl += (url.includes("?") ? "&" : "?") + queryString;
      }
    }

    const response = await this.request(finalUrl, {
      ...requestOptions,
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`GET ${finalUrl} failed: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async post(url: string, data?: any, options: RequestInit = {}): Promise<any> {
    const response = await this.request(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`POST ${url} failed: ${response.status}`);
    }

    // 응답이 비어있을 수 있으므로 체크
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async put(url: string, data?: any, options: RequestInit = {}): Promise<any> {
    const response = await this.request(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`PUT ${url} failed: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async delete(url: string, options: RequestInit = {}): Promise<any> {
    const response = await this.request(url, {
      ...options,
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`DELETE ${url} failed: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
}

export const apiClient = ApiClient.getInstance();

// 편의를 위한 alias
export const api = apiClient;
