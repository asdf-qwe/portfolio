package com.port.folio.domain.main.service;

import com.port.folio.domain.main.dto.MainRequest;
import com.port.folio.domain.main.dto.MainResponse;
import com.port.folio.domain.main.dto.SkillCategoryRequest;
import com.port.folio.domain.main.dto.SkillCategoryResponse;
import com.port.folio.domain.main.entity.CategoryName;
import com.port.folio.domain.main.entity.Main;
import com.port.folio.domain.main.entity.SkillCategory;
import com.port.folio.domain.main.repository.MainRepository;
import com.port.folio.domain.main.repository.SkillCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Contract;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MainService {
    private final MainRepository mainRepository;
    private final SkillCategoryRepository skillCategoryRepository;

    public MainResponse getMain(Long userId){
        Main main = mainRepository.findByUserId(userId);

        return new MainResponse(
                main.getGreeting(),
                main.getSmallGreeting(),
                main.getIntroduce(),
                main.getName()

        );
    }

    public String updateMain(MainRequest req, Long userId){
        Main main = mainRepository.findByUserId(userId);

        main.setGreeting(req.getGreeting());
        main.setSmallGreeting(req.getSmallGreeting());
        main.setName(req.getName());
        main.setIntroduce(req.getIntroduce());

        mainRepository.save(main);
        return "수정 완료";
    }

    public void changeCategory(SkillCategoryRequest req, Long userId){
        SkillCategory skillCategory = skillCategoryRepository.findByUserId(userId);

        skillCategory.setName(req.getName());

        skillCategoryRepository.save(skillCategory);
    }

    public SkillCategoryResponse getSkillCategory(Long userId){
        SkillCategory skillCategory = skillCategoryRepository.findByUserId(userId);

        return new SkillCategoryResponse(
                skillCategory.getName()
        );
    }


}
