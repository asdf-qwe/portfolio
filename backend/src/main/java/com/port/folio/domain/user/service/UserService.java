package com.port.folio.domain.user.service;

import com.port.folio.domain.main.entity.Main;
import com.port.folio.domain.main.repository.MainRepository;
import com.port.folio.domain.user.dto.SignupRequestDto;
import com.port.folio.domain.user.entity.User;
import com.port.folio.domain.user.entity.UserRole;
import com.port.folio.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MainRepository mainRepository;

    /**
     * 회원가입
     */
    @Transactional
    public User signup(SignupRequestDto request) {

        // 이메일 중복 체크
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 유저 생성
        User user = User.builder()
                .loginId(request.getLoginId())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .email(request.getEmail())
                .imageUrl(request.getImageUrl())
                .bio(request.getNickname() + "님의 프로필 입니다.")
                .role(UserRole.USER)
                .build();

        userRepository.save(user);

        Main main = Main.builder()
                .greeting("안녕하세요")
                .smallGreeting("간략한 자기소개 입니다.")
                .name("이름")
                .introduce("자기소개 입니다.")
                .user(user)
                .build();

        mainRepository.save(main);
        return user;
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByLoginId(String loginId) {return userRepository.existsByLoginId(loginId);}

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new IllegalArgumentException("관계에 해당하는 유저 없음"));
    }
}