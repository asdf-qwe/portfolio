import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 프록시 설정 제거 - 백엔드에서 직접 CORS 처리
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "re-cord.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/pof-1/:id",
        destination: "/main/home/:id",
      },
      {
        source: "/pof-2/:id/:categoryId",
        destination: "/main/home/:id/category/:categoryId",
      },
    ];
  },
};

export default nextConfig;
