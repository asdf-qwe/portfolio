package com.port.folio.domain.user.service;

import com.port.folio.domain.user.entity.User;
import com.port.folio.domain.user.entity.UserRole;
import com.port.folio.global.security.jwt.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
public class AuthTokenService {
    /**
     * yaml 파일에서 정보 @Value로 받아옴
     */
    @Value("${custom.jwt.secretKey}")
    private String jwtSecret;

    @Value("${custom.accessToken.expirationSeconds}")
    private long accessTokenExpirationSeconds;

    @Value("${custom.refreshToken.expirationSeconds}")
    private long refreshTokenExpirationSeconds;

    /**
     * 액세스 토큰 생성
     */
    public String genAccessToken(User user) {
        long id = user.getId();
        String email = user.getEmail();
        String nickname = user.getNickname();
        UserRole role = user.getRole();
        return JwtUtil.generateToken(
                jwtSecret,
                accessTokenExpirationSeconds,
                Map.of("userId", id, "email", email, "nickname", nickname, "role", role)
        );
    }

    /**
     * 리프레시 토큰 생성
     */
    public String genRefreshToken(User user) {
        long id = user.getId();
        String email = user.getEmail();

        return JwtUtil.generateToken(
                jwtSecret,
                refreshTokenExpirationSeconds,
                Map.of("userId", id, "email", email)
        );
    }

    public String genRefreshTokenByEmail(String email) {

        return JwtUtil.generateToken(
                jwtSecret,
                refreshTokenExpirationSeconds,
                Map.of("email", email)
        );
    }

    /**
     * 토큰 페이로드 추출
     */
    public Map<String, Object> payload(String token) {
        log.info("jwtSecret from AuthTokenService: {}", jwtSecret);
        return JwtUtil.getPayload(jwtSecret, token);
    }

    /**
     * 토큰 유효성 검증
     */
    public boolean isValid(String token) {
        log.info("isValid() - jwtSecret: {}", jwtSecret);
        return JwtUtil.isValid(jwtSecret, token);
    }
}