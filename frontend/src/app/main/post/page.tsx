"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getPosts,
  getPost,
  createPost,
} from "@/features/post/service/postService";
import {
  CreatePostDto,
  PostListDto,
  PostResponse,
} from "@/features/post/types/post";

const PostListPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 categoryId와 returnTo 가져오기
  const categoryId = Number(searchParams.get("categoryId")) || 1;
  const returnTo = searchParams.get("returnTo");

  // 상태 관리
  const [posts, setPosts] = useState<PostListDto[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 새 게시글 폼 상태
  const [newPost, setNewPost] = useState<CreatePostDto>({
    title: "",
    content: "",
    imageUrl: "",
  });

  // 게시글 목록 조회
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts(categoryId);
      setPosts(data);
    } catch (err) {
      setError("게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 게시글 상세 조회
  const handleViewPost = async (postId: number) => {
    try {
      const post = await getPost(postId);
      setSelectedPost(post);
    } catch (err) {
      setError("게시글을 불러오지 못했습니다.");
    }
  };

  // 새 게시글 입력 처리
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 게시글 생성
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost(newPost, categoryId);
      if (returnTo) {
        // 지정된 페이지로 리다이렉션
        router.push(returnTo);
      } else {
        // 폼 초기화
        setNewPost({ title: "", content: "", imageUrl: "" });
        // 목록 새로고침
        fetchPosts();
      }
    } catch (err) {
      setError("게시글 생성에 실패했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      {/* 새 게시글 작성 폼 */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">새 게시글 작성</h2>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <input
              type="text"
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              placeholder="제목"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <textarea
              name="content"
              value={newPost.content}
              onChange={handleInputChange}
              placeholder="내용"
              className="w-full p-2 border rounded h-32"
            />
          </div>
          <div>
            <input
              type="text"
              name="imageUrl"
              value={newPost.imageUrl}
              onChange={handleInputChange}
              placeholder="이미지 URL"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            게시글 작성
          </button>
        </form>
      </div>

      {/* 게시글 목록 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">게시글 목록</h2>
        {posts.length === 0 ? (
          <div>게시글이 없습니다.</div>
        ) : (
          <ul className="space-y-2">
            {posts.map((post, idx) => (
              <li
                key={idx}
                className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => handleViewPost(idx + 1)}
              >
                <strong>{post.title}</strong> ({post.view} 조회)
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 선택된 게시글 상세 보기 */}
      {selectedPost && (
        <div className="p-4 border rounded">
          <h2 className="text-xl font-bold mb-4">게시글 상세</h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{selectedPost.title}</h3>
            <p className="text-gray-600">조회수: {selectedPost.view}</p>
            {selectedPost.imageUrl && (
              <img
                src={selectedPost.imageUrl}
                alt="게시글 이미지"
                className="max-w-full h-auto"
              />
            )}
            <p className="whitespace-pre-wrap">{selectedPost.content}</p>
          </div>
          <button
            onClick={() => setSelectedPost(null)}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
};

export default PostListPage;
