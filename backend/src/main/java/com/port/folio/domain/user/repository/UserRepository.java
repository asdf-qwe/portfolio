package com.port.folio.domain.user.repository;

import com.port.folio.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    //사용자를 이메일로 찾기
    // → UserService.login()에서 입력값에 @ 포함 시 이메일로 판단되어 사용됨
    Optional<User> findByEmail(String email);

    // 로그인 시 사용자가 입력한 loginId로 사용자 조회
    // → UserService.login()에서 입력값이 일반 ID일 때 사용됨
    Optional<User> findByLoginId(String loginId);

    boolean existsByEmail(String email);

    boolean existsByLoginId(String loginId);
    // refreshToken으로 사용자 조회
    Optional<User> findByRefreshToken(String refreshToken);

    @Query("""
    SELECT u FROM User u
    WHERE u.id = :id
""")
    Optional<User> findByIdWithRelations(@Param("id") Long id);


}
