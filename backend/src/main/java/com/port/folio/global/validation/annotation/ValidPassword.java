package com.port.folio.global.validation.annotation;

import com.port.folio.global.validation.validator.PasswordComplexityValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({ FIELD, METHOD, PARAMETER, ANNOTATION_TYPE })
@Retention(RUNTIME)
@Constraint(validatedBy = PasswordComplexityValidator.class)
@Documented
public @interface ValidPassword {
    String message() default "비밀번호는 영문, 숫자, 특수문자 중 2종류 이상을 포함하고, 10자 이상이어야 합니다.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
