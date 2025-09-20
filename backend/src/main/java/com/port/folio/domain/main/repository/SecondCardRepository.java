package com.port.folio.domain.main.repository;

import com.port.folio.domain.main.entity.CategoryName;
import com.port.folio.domain.main.entity.FirstCard;
import com.port.folio.domain.main.entity.SecondCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SecondCardRepository extends JpaRepository<SecondCard, Long> {
    SecondCard findBySkillCategoryId(Long skillCategoryId);

    Optional<SecondCard> findBySkillCategory_IdAndCategoryName(Long skillCategoryId, CategoryName categoryName);
}
