package com.port.folio.domain.tab.repository;

import com.port.folio.domain.tab.entity.BasicTab;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BasicTabRepository extends JpaRepository<BasicTab, Long> {
    BasicTab findByCategoryId(Long categoryId);
}
