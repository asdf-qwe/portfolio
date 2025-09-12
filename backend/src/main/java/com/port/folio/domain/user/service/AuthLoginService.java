package com.port.folio.domain.user.service;

import com.port.folio.domain.user.dto.LoginRequestDto;
import com.port.folio.domain.user.dto.TokenResponseDto;
import com.port.folio.domain.user.entity.User;
import com.port.folio.domain.user.entity.UserRole;
import com.port.folio.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthLoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthTokenService authTokenService;

    /**
     * 로그인
     */
    @Transactional
    public TokenResponseDto login(LoginRequestDto request) {
        String identifier = request.getLoginId(); // 사용자가 입력한 ID 또는 이메일

        // 입력값이 이메일인지 loginId인지 판단해서 사용자 조회
        Optional<User> userOptional;
        if (identifier.contains("@")) {
            userOptional = userRepository.findByEmail(identifier);
        } else {
            userOptional = userRepository.findByLoginId(identifier);
        }

        // 사용자 정보가 없으면 예외 발생
        User user = userOptional
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다."));


        // 비밀번호 일치 여부 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다");
        }

        String accessToken = authTokenService.genAccessToken(user);

        // 리프레시 토큰 생성
        String refreshToken = authTokenService.genRefreshToken(user);

        // 리프레시 토큰 저장
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return new TokenResponseDto(accessToken, refreshToken);
    }

    @Transactional
    public void logout(User user) {
        user.setRefreshToken(null);
        userRepository.save(user);
    }

    // refreshToken을 받아 access + refresh 토큰을 새로 발급해주는 메서드
    @Transactional
    public TokenResponseDto refreshToken(String refreshToken) {
        // 1. 토큰 유효성 검사
        if (!authTokenService.isValid(refreshToken)) {
            throw new IllegalArgumentException("토큰이 유효하지 않습니다");
        }

        // 2. refreshToken과 일치하는 유저 조회
        User user = userRepository.findByRefreshToken(refreshToken)
                .filter(u -> u.getRefreshToken().equals(refreshToken))  // 보안상 재확인
                .orElseThrow(() -> new IllegalArgumentException("토큰이 유효하지 않습니다"));

        // 3. 새 토큰 발급
        String newAccessToken = authTokenService.genAccessToken(user);
        String newRefreshToken = authTokenService.genRefreshToken(user);

        // 4. refreshToken 업데이트 후 저장
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        // 5. 응답
        return new TokenResponseDto(newAccessToken, refreshToken);
    }

    /**
     * AccessToken을 통해 사용자 정보 파싱
     * → Rq.getUserFromAccessToken()에서 사용
     */
    public User getUserFromAccessToken(String accessToken) {
        log.info("accessToken 파싱 시도 중");

        if (!authTokenService.isValid(accessToken)) {
            log.warn("accessToken 유효하지 않음");
            return null;
        }

        Map<String, Object> payload = authTokenService.payload(accessToken);

        if (payload == null) return null;

        long userId = ((Number) payload.get("userId")).longValue();
        String email = (String) payload.get("email");
        String nickname = (String) payload.get("nickname");
        String roleString = (String) payload.get("role");
        UserRole role = UserRole.valueOf(roleString);


        log.info("token payload userId: {}", userId);

        return User.builder()
                .id(userId)
                .email(email)
                .nickname(nickname)
                .role(role)
                .build();
    }

    @Transactional(readOnly = true)
    public Optional<User> findByRefreshToken(String refreshToken) {
        return userRepository.findByRefreshToken(refreshToken);
    }
}
