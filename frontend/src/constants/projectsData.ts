export interface ProjectData {
  id: string;
  title: string;
  description: string;
  videoSrc?: string;
  imageSrc?: string;
  goals: string[];
  features: string[];
  frontendTech: string[];
  backendTech: string[];
  detailedFeatures: {
    icon: string;
    title: string;
    description: string;
  }[];
  categoryId: number;
}

export const PROJECTS_DATA: Record<string, ProjectData> = {
  "1": {
    id: "1",
    title: "부트캠프 회고용 블로그",
    description:
      "Next.js와 Spring Boot를 활용한 포트폴리오 및 회고용 서비스입니다. 포트폴리오 제출 시 이 사이트만 활용하면 되도록 기획되었습니다.",
    categoryId: 1,
    goals: [
      "회고 및 포트폴리오 통합 관리",
      "사용자 친화적 인터페이스 구현",
      "안정적인 데이터 처리와 보안",
    ],
    features: [
      "마크다운 기반 에디터",
      "이미지 드래그 앤 드롭 업로드",
      "반응형 포트폴리오 레이아웃",
    ],
    frontendTech: ["Next.js", "TypeScript", "TailwindCSS", "React Query"],
    backendTech: ["Spring Boot", "JPA", "MySQL", "Spring Security"],
    detailedFeatures: [
      {
        icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
        title: "게시글 CRUD 기능",
        description: "직관적인 에디터와 함께 손쉬운 콘텐츠 관리",
      },
      {
        icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
        title: "이미지 업로드",
        description: "드래그 앤 드롭으로 간편한 이미지 업로드",
      },
      {
        icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        title: "사용자 인증",
        description: "안전한 인증 및 권한 관리 시스템",
      },
    ],
  },
  "2": {
    id: "2",
    title: "엔터사 특화 그룹웨어",
    description:
      "엔터테인먼트 회사의 특수성을 고려한 맞춤형 그룹웨어 시스템입니다. 실시간 소통과 계약 관리를 중심으로 설계되었습니다.",
    categoryId: 2,
    goals: [
      "엔터테인먼트 산업 특화 워크플로우 구현",
      "실시간 협업 환경 제공",
      "계약 및 정산 프로세스 자동화",
    ],
    features: [
      "실시간 메시징 및 화상 회의",
      "직관적인 일정 관리 시스템",
      "전자 계약 및 결재 프로세스",
    ],
    frontendTech: ["React", "TypeScript", "TailwindCSS", "Socket.io-client"],
    backendTech: ["Node.js", "Express", "MongoDB", "Socket.io"],
    detailedFeatures: [
      {
        icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
        title: "WebSocket 기반 실시간 채팅",
        description: "실시간 1:1 채팅, 그룹 채팅, 파일 공유 기능 제공",
      },
      {
        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
        title: "풀 캘린더 일정 관리",
        description: "드래그 앤 드롭으로 일정 관리, 일정 공유 및 알림 기능",
      },
      {
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        title: "계약 관리 시스템",
        description: "자동화된 계약서 생성, 전자 서명, 이력 관리",
      },
    ],
  },
  "3": {
    id: "3",
    title: "링크 관리 서비스",
    description:
      "고성능 링크 관리 및 공유 플랫폼입니다. Redis를 활용한 캐싱, 비동기 처리, 실시간 협업 기능을 제공합니다.",
    videoSrc: "/introduce1.mp4",
    imageSrc: "/project3.png",
    categoryId: 3,
    goals: [
      "고성능 링크 관리 시스템 구축",
      "실시간 협업 환경 제공",
      "효율적인 리소스 관리",
    ],
    features: [
      "Redis 기반의 고성능 캐싱",
      "실시간 동시 편집 지원",
      "자동화된 링크 메타데이터 추출",
    ],
    frontendTech: ["Vue.js", "Vuex", "TailwindCSS", "Socket.io-client"],
    backendTech: ["Python", "FastAPI", "Redis", "Celery"],
    detailedFeatures: [
      {
        icon: "M13 10V3L4 14h7v7l9-11h-7z",
        title: "고성능 캐싱",
        description: "Redis를 활용한 빠른 데이터 접근",
      },
      {
        icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
        title: "비동기 처리",
        description: "큐와 워커를 통한 효율적인 트래픽 관리",
      },
      {
        icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122",
        title: "실시간 협업",
        description: "WebSocket을 활용한 실시간 상호작용",
      },
    ],
  },
};

export const getProjectData = (id: string): ProjectData | null => {
  return PROJECTS_DATA[id] || null;
};
