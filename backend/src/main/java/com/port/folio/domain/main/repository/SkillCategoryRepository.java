package com.port.folio.domain.main.repository;

import com.port.folio.domain.main.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillCategoryRepository extends JpaRepository<SkillCategory,Long> {
    SkillCategory findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
