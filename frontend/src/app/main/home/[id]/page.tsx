"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import Button from "@/features/auth/components/Button";

interface HomePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function HomePage({ params }: HomePageProps) {
  const resolvedParams = React.use(params);
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const userId = resolvedParams.id;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
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

  // 주요 프로젝트 데이터
  const featuredProjects = [
    {
      title: "부트캠프 회고용 블로그",
      description:
        "Next.js와 Spring Boot를 활용한 포트폴리오 및 회고용 서비스. 포트폴리오 제출 시 이 사이트만 활용하면 되게 기획. 게시글 CRUD, 이미지 업로드, 반응형 디자인 구현",
      tech: ["Next.js", "Spring Boot", "TypeScript", "Tailwind CSS"],
      image: "/project1.png",
    },
    {
      title: "엔터사 특화 그룹웨어",
      description:
        "WebSocket을 활용한 실시간 채팅 기능, 파일 공유, 풀 캘린더 이용 일정관리, 자체 계약 서비스 로직 구현으로 자동화된 계약 관리와 정산관리",
      tech: ["React", "Node.js", "Socket.io", "MongoDB"],
      image: "/project2.png",
    },
    {
      title: "링크 관리 서비스",
      description:
        "redis를 이용해 캐시로 불필요한 DB요청 줄이고 비동기 큐, 워커를 이용해 트래픽 처리, 웹소켓으로 동시 작업 기능 제공, opengraph api를 이용해 자동화된 링크 정보 제공, youtube api를 이용해 자동 재생 및 재생목록 기능 제공",
      tech: ["Vue.js", "Python", "FastAPI", "OpenAI"],
      image: "/project3.png",
    },
  ];

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
                <Image
                  src="/김현우.jpg"
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
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
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
            {featuredProjects.map((project, index) => (
              <Link
                href={`/main/home/${userId}/category/${index + 1}`}
                key={index}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      quality={95}
                      priority={index === 0}
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/main/post"
              className="inline-block px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              모든 프로젝트 보기
            </Link>
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
