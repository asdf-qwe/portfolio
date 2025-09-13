package com.port.folio.domain.tab.repository;

import com.port.folio.domain.tab.entity.Tab;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TabRepository extends JpaRepository<Tab, Long> {
    List<Tab> findAllByCategoryId(Long categoryId);
}
