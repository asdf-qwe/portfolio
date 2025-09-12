package com.port.folio.domain.user.controller;


import com.port.folio.domain.user.dto.LoginRequestDto;
import com.port.folio.domain.user.dto.SignupRequestDto;
import com.port.folio.domain.user.dto.TokenResponseDto;
import com.port.folio.domain.user.dto.UserResponseDto;
import com.port.folio.domain.user.entity.User;
import com.port.folio.domain.user.service.AuthLoginService;
import com.port.folio.domain.user.service.UserService;
import com.port.folio.global.rq.Rq;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class ApiV1UserController {

    // service쪽에 태워서 가입시킴
    private final UserService userService;
    private final AuthLoginService authLoginService;

    private final Rq rq;

    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/signup")
    public ResponseEntity<UserResponseDto> signup(@Valid @RequestBody SignupRequestDto request) {
        User user = userService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserResponseDto.fromEntity(user));
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);

        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return ResponseEntity.badRequest().body("유효하지 않은 이메일 형식입니다");
        }

        if (exists) {
            return ResponseEntity.status(409).body("이미 사용 중인 이메일입니다");
        }
        return ResponseEntity.ok("사용 가능한 이메일입니다");
    }

    @GetMapping("/check-loginId")
    public ResponseEntity<?> checkLoginId(@RequestParam String loginId){
        boolean exists = userService.existsByLoginId(loginId);

        if (exists) {
            return ResponseEntity.status(409).body("이미 사용 중인 아이디입니다");
        }
        return ResponseEntity.ok("사용 가능한 아이디입니다");
    }

    @Operation(summary = "로그인", description = "로그인 ID 또는 이메일과 비밀번호를 입력해 accessToken을 발급받습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "401", description = "아이디 또는 비밀번호 불일치")
    })
    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(
            @Valid @RequestBody LoginRequestDto request,
            HttpServletResponse response) {
        TokenResponseDto tokenDto = authLoginService.login(request);

        //ResponseCookie 대신 직접 Set-Cookie 헤더 문자열 작성
        String accessCookie = "accessToken=" + tokenDto.getAccessToken()
                + "; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax"; // accessToken 1시간

        String refreshCookie = "refreshToken=" + tokenDto.getRefreshToken()
                + "; HttpOnly; Path=/; Max-Age=" + (60 * 60 * 24 * 7) + "; SameSite=Lax"; // refreshToken 7일

        response.addHeader("Set-Cookie", accessCookie);
        response.addHeader("Set-Cookie", refreshCookie);

        return ResponseEntity.ok(tokenDto);
    }

    @Operation(summary = "로그아웃", description = "로그아웃 처리를 합니다.")
    @ApiResponse(responseCode = "200", description = "로그아웃 성공")
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        User user = rq.getActor();
        if (user != null) authLoginService.logout(user); // 저장 필요 시

        rq.deleteCookie("accessToken");
        rq.deleteCookie("refreshToken");
        rq.deleteCookie("JSESSIONID");
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("로그아웃 되었습니다.");
    }

    @Operation(summary = "AccessToken 재발급", description = "쿠키에 저장된 refreshToken을 이용해 새로운 accessToken을 발급합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "AccessToken 재발급 성공"),
            @ApiResponse(responseCode = "401", description = "유효하지 않은 refreshToken")
    })
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDto> refresh(@CookieValue("refreshToken") String refreshToken) {
        TokenResponseDto response = authLoginService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "내 정보 조회", description = "현재 로그인한 사용자의 정보를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        try{
            User user = rq.getActor(); // 현재 로그인한 사용자 가져오기

            if (user == null) {
                System.out.println("user is null from rq.getActor()");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 인증 안 된 경우
            }

            System.out.println("user id: " + user.getId());
            System.out.println("imageUrl: " + user.getImageUrl());

            return ResponseEntity.ok(UserResponseDto.fromEntity(user)); // DTO 변환 후 반환
        } catch (Exception e) {
            log.error("사용자 정보 조회 중 예외 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 에러 발생: " + e.getMessage());
        }
    }
}