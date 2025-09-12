package com.port.folio.global.rq;

import com.port.folio.domain.user.entity.User;
import com.port.folio.domain.user.service.AuthLoginService;
import com.port.folio.domain.user.service.AuthTokenService;
import com.port.folio.domain.user.service.UserService;
import com.port.folio.global.security.auth.SecurityUser;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.util.Arrays;
import java.util.Optional;

@Slf4j
@RequestScope
@Component
@RequiredArgsConstructor
public class Rq {
    private final HttpServletRequest req;
    private final HttpServletResponse resp;
    private final AuthTokenService authTokenService;
    private final AuthLoginService authLoginService;
    private final UserService userService;

    // application.yml의 값 주입
    @Value("${custom.site.cookie.secure}")
    private boolean cookieSecure;

    @Value("${custom.site.cookie.sameSite}")
    private String cookieSameSite;

    {
        log.info("Rq 생성됨");
    }

    // accessToken → 사용자 추출
    public User getUserFromAccessToken(String accessToken) {
        log.info("getUserFromAccessToken() 호출됨");
        log.info("전달받은 accessToken: {}", accessToken);

        try {
            User user = authLoginService.getUserFromAccessToken(accessToken);
            log.info("user 반환됨: {}", user != null ? user.getEmail() : "null");
            return user;
        } catch (Exception e) {
            log.error("getUserFromAccessToken() 예외 발생", e);
            return null;
        }
    }

    // 로그인 상태 설정
    public void setLogin(User user) {
        try {
            UserDetails userDetails = new SecurityUser(
                    user.getId(),
                    user.getEmail(),
                    "", // password는 사용하지 않음
                    user.getNickname(),
                    user.getRole(),
                    user.getAuthorities()
            );

            Authentication auth = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );

            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (Exception e) {
            log.error("Login set error", e);
        }
    }

    // 현재 로그인한 사용자 조회
    public User getActor() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getPrincipal)
                .filter(p -> p instanceof SecurityUser)
                .map(p -> (SecurityUser) p)
                .map(su -> userService.findById(su.getId())) // 전체 유저 객체 fetch
                .orElse(null);
    }

    // 쿠키 읽기
    public String getCookieValue(String name) {
        return Optional.ofNullable(req.getCookies())
                .stream()
                .flatMap(Arrays::stream)
                .filter(cookie -> cookie.getName().equals(name))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    // 쿠키 설정
    public void setCookie(String name, String value) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .path("/")
                .secure(cookieSecure)   // 환경별 설정값 적용
                .sameSite(cookieSameSite)   // 환경별 설정값 적용
                .httpOnly(true)
                .build();

        resp.addHeader("Set-Cookie", cookie.toString());
    }

    // 쿠키 삭제
    public void deleteCookie(String name) {
        ResponseCookie cookie = ResponseCookie.from(name, null)
                .path("/")
                .maxAge(0)
                .secure(cookieSecure)  // 환경별 설정값 적용
                .sameSite(cookieSameSite)  // 환경별 설정값 적용
                .httpOnly(true)
                .build();

        resp.addHeader("Set-Cookie", cookie.toString());
    }

    // 인증 쿠키 일괄 설정
    public String makeAuthCookies(User user) {
        String accessToken = authTokenService.genAccessToken(user);

        setCookie("accessToken", accessToken);
        setCookie("refreshToken", user.getRefreshToken());

        return accessToken;
    }

    // 헤더 설정
    public void setHeader(String name, String value) {
        resp.setHeader(name, value);
    }

    // 헤더 읽기
    public String getHeader(String name) {
        return req.getHeader(name);
    }

    // accessToken 재발급
    public void refreshAccessToken(User user) {
        String newToken = authTokenService.genAccessToken(user);
        setHeader("Authorization", "Bearer " + newToken);
        setCookie("accessToken", newToken);
    }

    // refreshToken으로 accessToken 재발급
    public User refreshAccessTokenByRefreshToken(String refreshToken) {
        return authLoginService.findByRefreshToken(refreshToken)
                .map(user -> {
                    refreshAccessToken(user);
                    return user;
                })
                .orElse(null);
    }
}
