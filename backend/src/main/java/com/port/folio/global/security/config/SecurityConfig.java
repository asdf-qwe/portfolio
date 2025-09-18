package com.port.folio.global.security.config;

import com.port.folio.global.rq.Rq;
import com.port.folio.global.security.filter.CustomAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity  // Spring Security 활성화
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final Rq rq;

    /**
     * 비밀번호 암호화용 빈 등록
     * 회원가입 시 비밀번호를 해시 처리하는 데 사용
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }



    /**
     * 커스텀 JWT 인증 필터 빈 등록
     * → HTTP 요청마다 JWT 토큰 검사해서 로그인 여부 확인해주는 필터
     */
    @Bean
    public CustomAuthenticationFilter customAuthenticationFilter() {
        return new CustomAuthenticationFilter(rq);
    }



    /**
     * Spring Security 필터 체인 구성
     * 어떤 요청에 인증이 필요한지, 어떤 필터를 적용할지를 설정
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // CSRF 비활성화 (세션사용 X : JWT 방식이므로 꺼도 됨)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(config -> config.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션사용 X (JWT 기반 인증이므로)

                // 요청 경로별 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/v1/users/signup",
                                "/api/v1/users/login",
                                "/api/v1/users/refresh",
                                "/api/v1/link/**",
                                "/api/posts/**",
                                "/api/**"
                        ).permitAll() // 회원가입, 로그인, 토큰 재발급 : 허용✔️
                        .requestMatchers("/actuator/health")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/**").permitAll() // GET 요청 : 모두 허용✔️
                        .requestMatchers("/api/**").authenticated() // 그 외 /api/** 요청 : 인증 필요⚠️
                        .anyRequest().permitAll() // 나머지 요청 : 모두 허용✔️
                );

                // 커스텀 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 넣음
                // → 요청마다 JWT 토큰 확인 → 인증되면 SecurityContext 로그인 상태 저장


        return http.build();
    }



    /**
     * CORS 설정
     * → 모든 origin, method, header 허용
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "https://www.pofol.site"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // 쿠키 등 인증 정보 포함 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
