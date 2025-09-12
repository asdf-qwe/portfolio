package com.port.folio.global.security.auth;

import com.port.folio.domain.user.entity.User;
import com.port.folio.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * 사용자가 로그인할 때 Spring Security가 호출하는 메서드
     * email로 DB에서 유저를 조회하고,
     * 해당 유저가 존재한다면 Spring Security가 인식할 수 있는 UserDetails 형태로 변환함.
     * → "이 유저는 인증 대상입니다"라고 시큐리티에 알려주는 과정
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .map(this::createUserDetails)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));
    }



    /**
     * DB에서 찾은 User 엔티티를 Spring Security가 이해할 수 있는 UserDetails 구현체(SecurityUser)로 변환.
     *
     * → 유저는 인증 대상이 되어 시큐리티 필터 체인을 통과할 수 있음.
     */
    private UserDetails createUserDetails(User user) {
        return new SecurityUser(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getNickname(),
                user.getRole(),
                user.getAuthorities()
        );
    }
}