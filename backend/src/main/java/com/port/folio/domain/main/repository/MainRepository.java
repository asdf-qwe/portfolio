package com.port.folio.domain.main.repository;

import com.port.folio.domain.main.entity.Main;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MainRepository extends JpaRepository<Main, Long> {
    Main findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
