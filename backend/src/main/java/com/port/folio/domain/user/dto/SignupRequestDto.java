package com.port.folio.domain.user.dto;

import com.port.folio.global.validation.annotation.ValidPassword;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequestDto {
    @NotBlank(message = "아이디는 필수 입력값입니다.")
    private String loginId;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.") @ValidPassword
    private String password;

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    private String email;

    private String nickname;

    private String imageUrl;
    private String bio;
}
