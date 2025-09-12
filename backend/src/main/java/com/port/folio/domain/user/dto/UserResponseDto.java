package com.port.folio.domain.user.dto;

import com.port.folio.domain.user.entity.User;
import com.port.folio.domain.user.entity.UserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDto {

    private Long id;
    private String loginId;
    private String nickname;
    private String email;
    private String imageUrl;
    private UserRole role;
    private String bio;


    public static UserResponseDto fromEntity(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .loginId(user.getLoginId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .imageUrl(user.getImageUrl())
                .role(user.getRole())
                .bio(user.getBio())
                .build();
    }
}