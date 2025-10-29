[![Typing SVG](https://readme-typing-svg.herokuapp.com?size=30&color=78B3CE&lines=RE:cord;Record+Your+Work+and+Career)](https://git.io/typing-svg)

# Portfolio – 나의 개발 포트폴리오 프로젝트

## 📌 프로젝트 소개  
- **한 줄 요약**: 본 프로젝트는 개인 웹/앱 포트폴리오로, 프론트엔드, 백엔드, 인프라 구성까지 직접 설계하고 구현한 풀스택 예제입니다.  
- **제작 동기**: 취업 준비 및 기술 스택 숙련을 위해 ‘실서비스 수준’으로 구성해보자는 목표로 시작했습니다.  
- **본인의 역할**: 개인 프로젝트로, 설계 → 구현 → 배포까지 전 과정을 담당했습니다.

## 🛠 기술 스택 & 아키텍처  
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS  
- **Backend**: Spring Boot, JPA, MySQL  
- **Infra & 배포**: AWS EC2, AWS RDS, Docker, GitHub Actions CI/CD  
- **아키텍처 설계 요약**:  
  클라이언트(Next.js) → REST API(Spring Boot) → 데이터베이스(MySQL)  
  → Docker 컨테이너 + GitHub Actions로 자동 배포 → AWS EC2에 운영  

## ✅ 주요 기능

### 👤 사용자 인증 & 편집 모드
- 회원가입 및 로그인 기능 제공
- 로그인 사용자에게만 **편집 모드 버튼** 활성화
- 자신의 포트폴리오 콘텐츠를 직접 등록/수정 가능

### 📝 포트폴리오 관리
- **프로필 편집**: 이름, 소개, 이메일, 전화번호 관리
- **프로필 사진 업로드**: S3 연동을 통한 이미지 업로드
- **기술 태그 추가**: 사용 기술/스택을 자유롭게 태그로 관리

### 📍 위치 정보
- Kakao Maps API를 통한 **주소 자동 검색** 기능

### 📂 프로젝트 관리
- 프로젝트 생성 시 **미리보기 카드** 자동 생성
- 미리보기 클릭 시 프로젝트 상세 페이지로 이동
- 프로젝트 소개, 기술 스택, 역할 등 자유롭게 작성 가능

### 📁 파일 및 미디어 업로드
- Presigned URL 방식의 **보안성 높은 파일 업로드**
- 프로젝트에 **시연 동영상** 업로드 가능 (프로젝트 소개 강화)

### ➕ 확장 가능한 콘텐츠 구조
- 기본 제공 탭 외, **사용자가 원하는 탭을 추가**하여 자유로운 구성 가능

## 🚀 배포 및 데모  
- **라이브 데모 URL**: https://www.pofol.site/ 
- **접근 방법**: 데모 계정 또는 직접 회원가입 후 테스트 가능  

## 🧪 설치 및 실행 방법  
### 로컬 실행  
```bash
git clone https://github.com/asdf-qwe/portfolio.git  
cd portfolio  
# 백엔드 실행  
cd backend && ./mvnw spring-boot:run  
# 프론트엔드 실행  
cd ../frontend && npm install && npm run dev  
