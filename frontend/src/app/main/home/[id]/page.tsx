"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import Button from "@/features/auth/components/Button";
import { categoryService } from "@/features/category/service/categoryService";
import { CategoryResponse } from "@/features/category/types/category";
import {
  uploadProfileImage,
  getUserProfileImage,
} from "@/features/upload/service/uploadService";

interface HomePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function HomePage({ params }: HomePageProps) {
  const resolvedParams = React.use(params);
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const userId = resolvedParams.id;

  // 카테고리 상태 관리
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // 프로필 이미지 상태 관리
  const [profileImageUrl, setProfileImageUrl] = useState<string>("/김현우.jpg"); // 기본 이미지
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [profileImageLoading, setProfileImageLoading] = useState(true);

  // 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await categoryService.getCategories(
          parseInt(userId)
        );
        setCategories(categoriesData);
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [userId]);

  // 프로필 이미지 가져오기
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        setProfileImageLoading(true);
        const imageUrl = await getUserProfileImage(parseInt(userId));
        if (imageUrl) {
          setProfileImageUrl(imageUrl);
        }
      } catch (error) {
        console.error("프로필 이미지 조회 실패:", error);
        // 에러 시 기본 이미지 유지
      } finally {
        setProfileImageLoading(false);
      }
    };

    fetchProfileImage();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 프로필 이미지 업로드 처리
  const handleProfileImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !canEdit) return;

    // 이미지 파일 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    try {
      setIsUploadingProfile(true);
      const imageUrl = await uploadProfileImage(file, parseInt(userId));
      setProfileImageUrl(imageUrl);
      alert("프로필 이미지가 성공적으로 업로드되었습니다!");
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      alert("프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploadingProfile(false);
    }
  };

  // 스크롤 이동 함수
  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const projectsSection = document.getElementById("projects");
    projectsSection?.scrollIntoView({ behavior: "smooth" });
  };

  // 기술 스택 데이터
  const skills = {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    backend: ["Spring Boot", "Node.js", "MySQL", "MongoDB"],
    tools: ["Git", "Docker", "AWS", "Figma"],
  };

  // 접근 권한 체크
  const isOwner = isLoggedIn && user && user.id?.toString() === userId;
  const canEdit = isOwner;

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href={`/main/home/${userId}`}
            className="text-xl font-bold text-gray-800"
          >
            Portfolio
          </Link>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-gray-600">
                  안녕하세요, {user?.nickname || user?.loginId}님!
                </span>
                {canEdit && (
                  <span className="text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded">
                    내 페이지
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  isLoading={isLoading}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    회원가입
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-400/80 to-blue-500/80 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">안녕하세요!</h1>
          <p className="text-2xl mb-8">
            열정과 책임감이 있는 백엔드 개발자입니다.
          </p>
          <p className="text-lg mb-8 opacity-90">
            User ID: {userId} {canEdit && "(내 페이지)"}
          </p>
          <button
            onClick={scrollToProjects}
            className="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
          >
            프로젝트 보기
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-center">About Me</h2>
            {canEdit && (
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                편집
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 h-[320px] flex flex-col justify-center p-4">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">김현우</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  새로운 기술을 배우고 적용할 때 신기해 하고 좋아하며, 사용자
                  경험을 개선하는 데 열정을 가지고 있습니다. 백엔드 개발자로서
                  데이터 관리와 처리, 서버의 성능 향상에 대하여 솔루션을
                  제공합니다.
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  열정과 창의성을 바탕으로 사용자 중심의 웹 서비스를 구현하는
                  것이 목표입니다.
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="relative w-[240px] h-[320px] rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-duration-300">
                {profileImageLoading ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <Image
                    src={profileImageUrl}
                    alt="Profile"
                    fill
                    sizes="(max-width: 240px) 100vw"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center top",
                    }}
                    className="rounded-lg"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>

                {/* 편집 가능한 경우 업로드 버튼 표시 */}
                {canEdit && (
                  <div className="absolute bottom-4 right-4">
                    <label
                      htmlFor="profile-image-upload"
                      className="cursor-pointer"
                    >
                      <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                        {isUploadingProfile ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                      disabled={isUploadingProfile}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-center">기술 스택</h2>
            {canEdit && (
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                편집
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, items]) => (
              <div
                key={category}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-4 capitalize">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {items.map((skill) => (
                    <li key={skill} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-center">주요 프로젝트</h2>
            {canEdit && (
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                편집
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {categoriesLoading ? (
              // 로딩 중일 때 스켈레톤 표시
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : categories.length > 0 ? (
              // 카테고리가 있을 때
              categories.map((category) => (
                <Link
                  href={`/main/home/${userId}/category/${category.id}`}
                  key={category.id}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <svg
                            className="w-16 h-16 mx-auto mb-2 opacity-80"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                          <p className="text-sm opacity-80">프로젝트</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {category.categoryTitle}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        프로젝트에 대한 자세한 내용을 확인해보세요.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-sm">
                          프로젝트
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // 카테고리가 없을 때
              <div className="col-span-3 text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  아직 프로젝트가 없습니다
                </h3>
                <p className="text-gray-500">
                  첫 번째 프로젝트를 만들어보세요!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">함께 일해보세요</h2>
          <p className="text-gray-600 mb-8">
            새로운 프로젝트나 협업 기회를 찾고 계신가요?
          </p>
          <button className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
            연락하기
          </button>
        </div>
      </section>
    </main>
  );
}
