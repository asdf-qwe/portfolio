import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.pofol.site'
  : 'http://localhost:8080';

export async function GET() {
  try {
    console.log(`[Health Check] Testing connection to: ${API_BASE_URL}`);
    
    // 백엔드 기본 경로 테스트
    const tests = [
      `${API_BASE_URL}`,
      `${API_BASE_URL}/health`,
      `${API_BASE_URL}/api/health`,
      `${API_BASE_URL}/api/v1/health`,
      `${API_BASE_URL}/api/v1/users/check-loginId?loginId=test`
    ];
    
    const results = [];
    
    for (const testUrl of tests) {
      try {
        const response = await fetch(testUrl, {
          method: 'GET',
          signal: AbortSignal.timeout(10000),
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        results.push({
          url: testUrl,
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });
      } catch (error) {
        results.push({
          url: testUrl,
          error: error instanceof Error ? error.message : 'Unknown error',
          name: error instanceof Error ? error.name : 'Unknown'
        });
      }
    }
    
    return NextResponse.json({
      apiBaseUrl: API_BASE_URL,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      tests: results
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      apiBaseUrl: API_BASE_URL,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}