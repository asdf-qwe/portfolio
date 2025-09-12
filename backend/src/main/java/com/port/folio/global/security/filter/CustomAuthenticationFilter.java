package com.port.folio.global.security.filter;

import com.port.folio.domain.user.entity.User;
import com.port.folio.global.rq.Rq;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationFilter extends OncePerRequestFilter {

    private final Rq rq;

    private record AuthTokens(String refreshToken, String accessToken) {}

    // 요청에서 토큰 꺼내기 (헤더 또는 쿠키)
    private AuthTokens getAuthTokensFromRequest() {
        String authorization = rq.getHeader("Authorization");

        if (authorization != null && authorization.startsWith("Bearer ")) {
            String accessToken = authorization.substring("Bearer ".length());
            return new AuthTokens(null, accessToken);
        }

        String refreshToken = rq.getCookieValue("refreshToken");
        String accessToken = rq.getCookieValue("accessToken");

        log.info("🍪 accessToken from cookie: {}", accessToken);

        if (accessToken != null) {
            return new AuthTokens(refreshToken, accessToken);
        }

        return null;
    }

    // accessToken → 유저 객체
    private User getUserFromAccessToken(String accessToken) {
        return rq.getUserFromAccessToken(accessToken);
    }

    // refreshToken → 유저 & accessToken 재발급
    private User refreshAccessTokenByRefreshToken(String refreshToken) {
        return rq.refreshAccessTokenByRefreshToken(refreshToken);
    }

    // 토큰이 있는지 먼저 검증
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        log.info("요청 URI: {}", request.getRequestURI());

        // API 요청이 아니면 통과
        if (!request.getRequestURI().startsWith("/api/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 인증 필요 없는 엔드포인트는 통과
        if (List.of(
                "/api/v1/users/signup",
                "/api/v1/users/login",
                "/api/v1/users/refresh"
        ).contains(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }


        // 요청상 검증을 해야 할 아이들
        // 토큰이 없다면 ban
        try {
            AuthTokens authTokens = getAuthTokensFromRequest();
            if (authTokens == null) {
                filterChain.doFilter(request, response);
                return;
            }

            // 토큰이 있는데 유효성이 지났을 경우 재발급
            String refreshToken = authTokens.refreshToken();
            String accessToken = authTokens.accessToken();

            User user = getUserFromAccessToken(accessToken);
            log.info("토큰 기반 사용자 확인 결과: {}", user != null ? user.getEmail() : "유저 없음");

            // accessToken이 유효하지 않으면 refreshToken으로 재발급 시도
            if (user == null && refreshToken != null) {
                user = refreshAccessTokenByRefreshToken(refreshToken);
            }

            // 유저가 있으면 인증 처리
            if (user != null) {
                log.info("로그인 인증 완료: {}", user.getEmail());
                rq.setLogin(user);
                log.info("SecurityContext에 로그인 설정 완료");
            } else {
                // 유효한 accessToken도 없고, refreshToken도 실패 → 인증 실패 처리

                log.warn("로그인 인증 실패: 유효한 토큰이 아님");

                // 쿠키 삭제 로직 일괄 관리 (secure, sameSite 자동 반영)
                rq.deleteCookie("accessToken");
                rq.deleteCookie("refreshToken");
            }
        } catch (Exception e) {
            log.error("CustomAuthenticationFilter 예외 발생", e);
        }

        // 다음 필터로 넘김
        filterChain.doFilter(request, response);
    }
}
