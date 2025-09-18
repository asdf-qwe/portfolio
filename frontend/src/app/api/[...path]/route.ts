import { NextRequest, NextResponse } from 'next/server';

// 환경 변수에서 API URL 가져오기 (런타임에 변경 가능)
const getApiBaseUrl = () => {
  // 프로덕션에서는 환경 변수로 오버라이드 가능
  if (process.env.NODE_ENV === 'production') {
    return process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://api.pofol.site';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();

// 헬스 체크 함수 추가
async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5초 타임아웃
    });
    return response.ok;
  } catch {
    return false;
  }
}

// 백엔드 서버 다운 시 사용할 대체 응답
function createFallbackResponse(path: string, method: string) {
  return new NextResponse(
    JSON.stringify({
      error: 'Service Temporarily Unavailable',
      message: '백엔드 서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.',
      details: {
        requestedPath: path,
        method: method,
        apiBaseUrl: API_BASE_URL,
        timestamp: new Date().toISOString(),
        suggestion: '백엔드 서버 상태를 확인하거나 관리자에게 문의하세요.'
      }
    }),
    {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Retry-After': '60', // 60초 후 재시도 권장
      },
    }
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params, 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params, 'PATCH');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    
    // path가 이미 'api/'로 시작하는지 확인
    const targetPath = path.startsWith('api/') ? path : `api/${path}`;
    const targetUrl = `${API_BASE_URL}/${targetPath}${url.search}`;

    console.log(`[API Proxy] ${method} ${request.url} -> ${targetUrl}`);

    // 요청 헤더에서 필요한 것들만 전달
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Authorization 헤더가 있으면 전달
    const authorization = request.headers.get('authorization');
    if (authorization) {
      headers['Authorization'] = authorization;
    }

    // 쿠키 전달
    const cookie = request.headers.get('cookie');
    if (cookie) {
      headers['Cookie'] = cookie;
    }

    let body: string | undefined = undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        const text = await request.text();
        if (text) {
          body = text;
        }
      } catch (error) {
        console.error('Error reading request body:', error);
      }
    }

    console.log(`[API Proxy] Request headers:`, headers);
    if (body) console.log(`[API Proxy] Request body:`, body);

    // 백엔드 연결 상태 확인 (프로덕션에서만)
    if (process.env.NODE_ENV === 'production') {
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        console.error(`[API Proxy] Backend health check failed: ${API_BASE_URL}`);
        return createFallbackResponse(path, method);
      }
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      // 타임아웃 설정 추가
      signal: AbortSignal.timeout(30000), // 30초 타임아웃
    });

    console.log(`[API Proxy] Response status: ${response.status}`);

    // 응답 헤더 처리
    const responseHeaders = new Headers();
    
    // CORS 헤더 설정
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');

    // Content-Type 전달
    const contentType = response.headers.get('content-type');
    if (contentType) {
      responseHeaders.set('Content-Type', contentType);
    }

    // Set-Cookie 헤더 전달 (인증 관련)
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      responseHeaders.set('Set-Cookie', setCookie);
    }

    // 응답 본문 처리
    let responseBody: string | null = null;
    try {
      responseBody = await response.text();
      console.log(`[API Proxy] Response body:`, responseBody);
    } catch (error) {
      console.error('Error reading response body:', error);
    }

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('[API Proxy] Error:', error);
    
    // 네트워크 오류 또는 타임아웃의 경우 더 구체적인 메시지
    let errorMessage = 'Internal Server Error';
    let errorDetails = error instanceof Error ? error.message : 'Unknown error';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request Timeout';
        errorDetails = 'API 요청이 시간 초과되었습니다';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Connection Refused';
        errorDetails = '백엔드 서버에 연결할 수 없습니다';
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'DNS Resolution Failed';
        errorDetails = 'API 서버 주소를 찾을 수 없습니다';
      }
    }
    
    const targetPath = params.path.join('/');
    const finalTargetPath = targetPath.startsWith('api/') ? targetPath : `api/${targetPath}`;
    
    return new NextResponse(
      JSON.stringify({ 
        error: errorMessage, 
        message: errorDetails,
        targetUrl: `${API_BASE_URL}/${finalTargetPath}`,
        timestamp: new Date().toISOString()
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    );
  }
}