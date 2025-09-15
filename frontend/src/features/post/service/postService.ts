import axios from "axios";
import {
  CreatePostDto,
  PostListDto,
  PostResponse,
  BasicTabDto,
  BasicTabUpdateReq,
} from "../types/post";

const API_BASE = "/api/posts";

// 게시글 생성
export async function createPost(
  dto: CreatePostDto,
  categoryId: number,
  tabId: number
): Promise<string> {
  const res = await axios.post(
    `${API_BASE}?categoryId=${categoryId}&tabId=${tabId}`,
    dto
  );
  return res.data;
}

// 게시글 수정
export async function updatePost(
  dto: CreatePostDto,
  tabId: number
): Promise<string> {
  try {
    console.log(`게시글 수정 시작 - tabId: ${tabId}`);
    const res = await axios.put(`${API_BASE}?tabId=${tabId}`, dto);
    console.log(`게시글 수정 성공 - tabId: ${tabId}`);
    return res.data;
  } catch (error) {
    console.error(`게시글 수정 실패 - tabId: ${tabId}`, error);
    throw error;
  }
}

// 카테고리별 게시글 목록 조회
export async function getPosts(categoryId: number): Promise<PostListDto[]> {
  const res = await axios.get(`${API_BASE}/list`, {
    params: { categoryId },
    withCredentials: false,
  });
  return res.data;
}

// 게시글 상세 조회
export async function getPost(postId: number): Promise<PostResponse> {
  const res = await axios.get(`${API_BASE}`, {
    params: { postId },
    withCredentials: false,
  });
  return res.data;
}

// 탭별 게시글 조회
export async function getPostByTab(
  tabId: number
): Promise<PostResponse | null> {
  try {
    console.log(`탭 게시글 조회 시작 - tabId: ${tabId}`);
    const res = await axios.get(`${API_BASE}`, {
      params: { tabId },
      withCredentials: false,
    });
    console.log(`탭 게시글 조회 성공 - tabId: ${tabId}`);
    return res.data;
  } catch (error) {
    console.error(`탭 게시글 조회 실패 - tabId: ${tabId}`, error);

    // axios 에러인 경우
    if (axios.isAxiosError(error)) {
      // 404 에러 (게시글이 없음)는 정상적인 상황으로 처리
      if (error.response?.status === 404) {
        console.log(`탭 ${tabId}에 게시글이 없습니다.`);
        return null;
      }

      // 500 에러나 기타 서버 에러
      if (error.response?.status === 500) {
        console.warn(
          `서버 에러로 인해 탭 ${tabId}의 게시글을 불러올 수 없습니다.`
        );
        return null;
      }
    }

    // 예상치 못한 에러는 다시 throw
    throw error;
  }
}

// 기본 탭 조회 (프로젝트 소개, 자료)
export async function getBasicTabs(categoryId: number): Promise<BasicTabDto> {
  try {
    console.log(`기본 탭 조회 시작 - categoryId: ${categoryId}`);
    const res = await axios.get(`/api/v1/tab/basic`, {
      params: { categoryId },
      withCredentials: false,
    });
    console.log(`기본 탭 조회 성공 - categoryId: ${categoryId}`);
    return res.data;
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
    const res = await axios.put(`/api/v1/tab/basic`, req, {
      params: { categoryId },
    });
    console.log(`기본 탭 업데이트 성공 - categoryId: ${categoryId}`);
    return res.data;
  } catch (error) {
    console.error(`기본 탭 업데이트 실패 - categoryId: ${categoryId}`, error);
    throw error;
  }
}
