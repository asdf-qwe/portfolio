package com.port.folio.global.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Slf4j
@Component // 채팅(WebSocket) 등에서 DI로 사용 가능하게 추가
public class JwtUtil {

    // WebSocket 등에서 secret 주입 받기 위해 추가된 필드
    @Value("${custom.jwt.secretKey}")
    private String rawSecret;

    private SecretKey secretKey; // 내부 캐싱용

    // Bean 생성 이후 자동 초기화: 기존 static 방식엔 없던 부분
    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(rawSecret.getBytes());
    }

    // [기존 static] 로그인 기능에서 사용하던 토큰 생성 방식은 그대로 유지
    public static String generateToken(String secret, long expireSeconds, Map<String, Object> claims) {
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + 1000L * expireSeconds);

        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());

        return Jwts.builder()
                .claims(claims)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }

    // [기존 static] 유효성 검사 (로그인 필터 등에서 사용)
    public static boolean isValid(String secret, String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parse(token);
            return true;
        } catch (Exception e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    // [기존 static] Payload 추출 (로그인 필터 등에서 사용)
    @SuppressWarnings("unchecked")
    public static Map<String, Object> getPayload(String secret, String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
            return (Map<String, Object>) Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parse(token)
                    .getPayload();
        } catch (Exception e) {
            log.warn("Failed to parse JWT token: {}", e.getMessage());
            return null;
        }
    }

    // [new] 채팅 등에서 DI로 주입해서 secret 없이 사용
    public boolean isValid(String token) {
        try {
            Jwts.parser().verifyWith(secretKey).build().parse(token);
            return true;
        } catch (Exception e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    // [new] 채팅 등에서 DI로 주입해서 secret 없이 사용
    @SuppressWarnings("unchecked")
    public Map<String, Object> getPayload(String token) {
        try {
            return (Map<String, Object>) Jwts.parser().verifyWith(secretKey).build().parse(token).getPayload();
        } catch (Exception e) {
            log.warn("Failed to parse JWT token: {}", e.getMessage());
            return null;
        }
    }
}
