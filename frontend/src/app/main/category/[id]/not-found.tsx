import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          프로젝트를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          요청하신 프로젝트가 존재하지 않거나 삭제되었습니다.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              또는 다른 프로젝트 보기:
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/main/category/1"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                프로젝트 1
              </Link>
              <Link
                href="/main/category/2"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                프로젝트 2
              </Link>
              <Link
                href="/main/category/3"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                프로젝트 3
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
