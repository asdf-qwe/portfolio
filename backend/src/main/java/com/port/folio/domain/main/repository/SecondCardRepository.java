package com.port.folio.domain.main.repository;

import com.port.folio.domain.main.entity.SecondCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecondCardRepository extends JpaRepository<SecondCard, Long> {
    SecondCard findBySkillCategoryId(Long skillCategoryId);
}
