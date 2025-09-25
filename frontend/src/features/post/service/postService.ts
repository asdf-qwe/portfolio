import {
  CreatePostDto,
  PostListDto,
  PostResponse,
  BasicTabDto,
  BasicTabUpdateReq,
} from "../types/post";
import { CreateIntroduce, IntroduceResponse } from "../../main/type/introduce";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// 게시글 생성
export async function createPost(
  dto: CreatePostDto,
  categoryId: number,
  tabId: number
): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/posts?categoryId=${categoryId}&tabId=${tabId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dto),
    }
  );

  if (!response.ok) {
    throw new Error(
      `게시글 생성 실패: ${response.status} ${response.statusText}`
    );
  }

  return await response.text();
}

// 게시글 수정
export async function updatePost(
  dto: CreatePostDto,
  tabId: number
): Promise<string> {
  try {
    console.log(`게시글 수정 시작 - tabId: ${tabId}`);
    const response = await fetch(`${API_BASE_URL}/api/posts?tabId=${tabId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error(
        `게시글 수정 실패: ${response.status} ${response.statusText}`
      );
    }

    console.log(`게시글 수정 성공 - tabId: ${tabId}`);
    return await response.text();
  } catch (error) {
    console.error(`게시글 수정 실패 - tabId: ${tabId}`, error);
    throw error;
  }
}

// 카테고리별 게시글 목록 조회
export async function getPosts(categoryId: number): Promise<PostListDto[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/posts/list?categoryId=${categoryId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "omit",
    }
  );

  if (!response.ok) {
    throw new Error(
      `게시글 목록 조회 실패: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

// 게시글 상세 조회
export async function getPost(postId: number): Promise<PostResponse> {
  const response = await fetch(`${API_BASE_URL}/api/posts?postId=${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "omit",
  });

  if (!response.ok) {
    throw new Error(
      `게시글 조회 실패: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

// 탭별 게시글 조회
export async function getPostByTab(
  tabId: number
): Promise<PostResponse | null> {
  try {
    console.log(`탭 게시글 조회 시작 - tabId: ${tabId}`);
    const response = await fetch(`${API_BASE_URL}/api/posts?tabId=${tabId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "omit",
    });

    console.log(`탭 게시글 조회 성공 - tabId: ${tabId}`);

    if (response.status === 404) {
      console.log(`탭 ${tabId}에 게시글이 없습니다.`);
      return null;
    }

    if (response.status === 500) {
      console.warn(
        `서버 에러로 인해 탭 ${tabId}의 게시글을 불러올 수 없습니다.`
      );
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `탭 게시글 조회 실패: ${response.status} ${response.statusText}`
      );
    }

    const post = await response.json();

    // 백엔드에서 게시글이 없을 때 new PostResponse(null, null)을 반환하므로
    // content와 imageUrl이 모두 null인 경우에만 게시글이 없는 것으로 처리
    // 빈 문자열인 경우에는 게시글이 존재한다고 간주
    if (post.content === null && post.imageUrl === null) {
      console.log(`탭 ${tabId}에 게시글이 없습니다.`);
      return null;
    }

    // 유효한 게시글이 있으면 반환
    return post;
  } catch (error) {
    console.error(`탭 게시글 조회 실패 - tabId: ${tabId}`, error);

    // 네트워크 에러인 경우
    if (error instanceof TypeError) {
      console.warn(
        `네트워크 에러로 인해 탭 ${tabId}의 게시글을 불러올 수 없습니다.`
      );
      return null;
    }

    // 예상치 못한 에러는 다시 throw
    throw error;
  }
}

// 기본 탭 조회 (프로젝트 소개, 자료)
export async function getBasicTabs(categoryId: number): Promise<BasicTabDto> {
  try {
    console.log(`기본 탭 조회 시작 - categoryId: ${categoryId}`);
    const response = await fetch(
      `${API_BASE_URL}/api/v1/tab/basic?categoryId=${categoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit",
      }
    );

    if (!response.ok) {
      throw new Error(
        `기본 탭 조회 실패: ${response.status} ${response.statusText}`
      );
    }

    console.log(`기본 탭 조회 성공 - categoryId: ${categoryId}`);
    return await response.json();
  } catch (error) {
    console.error(`기본 탭 조회 실패 - categoryId: ${categoryId}`, error);
    throw error;
  }
}

// 기본 탭 내용 업데이트 (프로젝트 소개)
export async function updateBasicTabContent(
  categoryId: number,
  basicContent1: string
): Promise<string> {
  try {
    console.log(`기본 탭 업데이트 시작 - categoryId: ${categoryId}`);
    const req: BasicTabUpdateReq = { basicContent1 };
    const response = await fetch(
      `${API_BASE_URL}/api/v1/tab/basic?categoryId=${categoryId}`,
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
        `기본 탭 업데이트 실패: ${response.status} ${response.statusText}`
      );
    }

    console.log(`기본 탭 업데이트 성공 - categoryId: ${categoryId}`);
    return await response.text();
  } catch (error) {
    console.error(`기본 탭 업데이트 실패 - categoryId: ${categoryId}`, error);
    throw error;
  }
}

// 프로젝트 소개 생성
export async function createIntroduce(
  req: CreateIntroduce,
  categoryId: number
): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/posts/introduce?categoryId=${categoryId}`,
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
      `프로젝트 소개 생성 실패: ${response.status} ${response.statusText}`
    );
  }

  return await response.text();
}

// 프로젝트 소개 조회
export async function getIntroduce(
  categoryId: number
): Promise<IntroduceResponse | null> {
  const url = `${API_BASE_URL}/api/posts/introduce?categoryId=${categoryId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "omit",
    });

    // 404인 경우 데이터가 없음을 의미하므로 null 반환
    if (response.status === 404) {
      return null;
    }

    // 500 서버 에러인 경우도 null 반환 (데이터 없음으로 처리)
    if (response.status === 500) {
      console.warn("서버 에러로 인해 프로젝트 소개를 불러올 수 없습니다.");
      return null;
    }

    // 기타 에러인 경우에만 throw
    if (!response.ok) {
      throw new Error(
        `프로젝트 소개 조회 실패: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // 데이터가 있으면 반환 (빈 content라도 빈 게시글로 표시)
    return data;
  } catch (error) {
    // 네트워크 에러인 경우 null 반환
    if (error instanceof TypeError) {
      console.warn("네트워크 에러로 인해 프로젝트 소개를 불러올 수 없습니다.");
      return null;
    }

    // 기타 예상치 못한 에러는 다시 throw
    console.error(`getIntroduce API 오류:`, error);
    throw error;
  }
}

// 프로젝트 소개 수정
export async function updateIntroduce(
  req: CreateIntroduce,
  categoryId: number
): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/posts/introduce?categoryId=${categoryId}`,
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
      `프로젝트 소개 수정 실패: ${response.status} ${response.statusText}`
    );
  }

  return await response.text();
}
