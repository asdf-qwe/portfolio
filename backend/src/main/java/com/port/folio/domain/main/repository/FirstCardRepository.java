package com.port.folio.domain.main.repository;

import com.port.folio.domain.main.entity.CategoryName;
import com.port.folio.domain.main.entity.FirstCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FirstCardRepository extends JpaRepository<FirstCard, Long> {
    FirstCard findBySkillCategoryId(Long skillCategoryId);

    Optional<FirstCard> findBySkillCategory_IdAndCategoryName(Long skillCategoryId, CategoryName categoryName);

}
