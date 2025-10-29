# Portfolio – 나의 개발 포트폴리오 프로젝트

## 📌 프로젝트 소개  
- **한 줄 요약**: 본 프로젝트는 개인 웹/앱 포트폴리오로, 프론트엔드, 백엔드, 인프라 구성까지 직접 설계하고 구현한 풀스택 예제입니다.  
- **제작 동기**: 취업 준비 및 기술 스택 숙련을 위해 ‘실서비스 수준’으로 구성해보자는 목표로 시작했습니다.  
- **본인의 역할**: 단독 개발자로, 설계 → 구현 → 배포까지 전 과정을 담당했습니다.

## 🛠 기술 스택 & 아키텍처  
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS  
- **Backend**: Spring Boot, JPA, MySQL  
- **Infra & 배포**: AWS EC2, AWS RDS, Docker, GitHub Actions CI/CD  
- **아키텍처 설계 요약**:  
  클라이언트(Next.js) → REST API(Spring Boot) → 데이터베이스(MySQL)  
  → Docker 컨테이너 + GitHub Actions로 자동 배포 → AWS EC2에 운영  

## ✅ 주요 기능  
- 사용자 로그인/회원가입 (JWT 기반 인증)  
- 게시글 생성/조회/수정/삭제(CRUD) 및 파일 업로드(S3)  
- 반응형 UI로 모바일·데스크탑 대응  
- CI/CD 파이프라인 적용(개발 → 테스트 자동화 → 운영)  
- 로깅 및 모니터링 기본 구현  

## 🚀 배포 및 데모  
- **라이브 데모 URL**: (여기에 배포 주소 입력)  
- **접근 방법**: 데모 계정 또는 직접 회원가입 후 테스트 가능  

## 🧪 설치 및 실행 방법  
### 요구 사항  
- Node.js 16+, Java 17+, Docker 설치  
- AWS 자격증명 설정(선택)  
### 로컬 실행  
```bash
git clone https://github.com/asdf-qwe/portfolio.git  
cd portfolio  
# 백엔드 실행  
cd backend && ./mvnw spring-boot:run  
# 프론트엔드 실행  
cd ../frontend && npm install && npm run dev  
