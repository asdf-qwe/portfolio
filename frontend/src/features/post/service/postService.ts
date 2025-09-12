import axios from "axios";
import { CreatePostDto, PostListDto, PostResponse } from "../types/post";

const API_BASE = "/api/posts";

// 게시글 생성
export async function createPost(
  dto: CreatePostDto,
  categoryId: number
): Promise<string> {
  const res = await axios.post(`${API_BASE}?categoryId=${categoryId}`, dto);
  return res.data;
}

// 카테고리별 게시글 목록 조회
export async function getPosts(categoryId: number): Promise<PostListDto[]> {
  const res = await axios.get(`${API_BASE}/list`, { params: { categoryId } });
  return res.data;
}

// 게시글 상세 조회
export async function getPost(postId: number): Promise<PostResponse> {
  const res = await axios.get(`${API_BASE}`, { params: { postId } });
  return res.data;
}
