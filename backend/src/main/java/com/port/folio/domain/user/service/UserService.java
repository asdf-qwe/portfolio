package com.port.folio.domain.user.service;

import com.port.folio.domain.category.repository.CategoryRepository;
import com.port.folio.domain.main.entity.*;
import com.port.folio.domain.main.repository.MainRepository;
import com.port.folio.domain.main.repository.SkillCategoryRepository;
import com.port.folio.domain.main.repository.UserLocationRepository;
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
    private final SkillCategoryRepository skillCategoryRepository;
    private final UserLocationRepository userLocationRepository;
    private final CategoryRepository categoryRepository;

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
                .job("직종")
                .workHistory(WorkHistory.ZERO)
                .user(user)
                .build();

        mainRepository.save(main);

        SkillCategory skillCategory = SkillCategory.builder()
                .name(CategoryName.SKILLS)
                .user(user)
                .build();

        skillCategoryRepository.save(skillCategory);

        UserLocation userLocation = UserLocation.builder()
                .userId(user.getId())
                .lat(37.5665)
                .lng(126.978)
                .address("서울, 대한민국")
                .email("contact@example.com")
                .phoneNumber("+82 10-1234-5678")
                .build();

        userLocationRepository.save(userLocation);

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

    public void deleteUser(Long userId){


        skillCategoryRepository.deleteByUserId(userId);
        mainRepository.deleteByUserId(userId);
        categoryRepository.deleteByUserId(userId);
        userLocationRepository.deleteByUserId(userId);

    }
}