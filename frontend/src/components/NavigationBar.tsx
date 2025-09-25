import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import Button from "@/features/auth/components/Button";

interface NavigationBarProps {
  userId: string;
  canEdit: boolean;
  isGlobalEditMode: boolean;
  isSavingMain: boolean;
  onToggleEditMode: () => void;
  onLogout: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  userId,
  canEdit,
  isGlobalEditMode,
  isSavingMain,
  onToggleEditMode,
  onLogout,
}) => {
  const { isLoggedIn, user, isLoading } = useAuth();
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100 z-50">
      <div className="container mx-auto px-22 py-4">
        <div className="flex justify-between items-center">
          <Link
            href={`/pof-1/${userId}`}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-sky-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent hover:from-sky-700 hover:to-cyan-700 transition-all duration-300">
              FolioPro
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {isLoading ? (
              // 인증 확인 중
              <div className="flex items-center space-x-4">
                <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              </div>
            ) : isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">
                    {user?.nickname || user?.loginId}
                  </span>
                </div>

                {canEdit && (
                  <button
                    onClick={onToggleEditMode}
                    disabled={isSavingMain}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isGlobalEditMode
                        ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {isGlobalEditMode ? (
                        isSavingMain ? (
                          <circle
                            className="animate-spin"
                            cx="12"
                            cy="12"
                            r="10"
                            strokeWidth="4"
                            stroke="currentColor"
                            fill="none"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        )
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      )}
                    </svg>
                    <span className="hidden sm:inline">
                      {isGlobalEditMode
                        ? isSavingMain
                          ? "저장 중..."
                          : "저장하기"
                        : "편집 모드"}
                    </span>
                  </button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await onLogout();
                    router.push("/");
                  }}
                  isLoading={isLoading}
                  className="border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 hover:border-gray-400"
                  >
                    로그인
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-sky-600 hover:bg-sky-700"
                  >
                    시작하기
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
