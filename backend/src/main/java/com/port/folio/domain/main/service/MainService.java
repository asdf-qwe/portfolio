package com.port.folio.domain.main.service;

import com.port.folio.domain.main.dto.*;
import com.port.folio.domain.main.entity.*;
import com.port.folio.domain.main.repository.FirstCardRepository;
import com.port.folio.domain.main.repository.MainRepository;
import com.port.folio.domain.main.repository.SecondCardRepository;
import com.port.folio.domain.main.repository.SkillCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MainService {
    private final MainRepository mainRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final FirstCardRepository firstCardRepository;
    private final SecondCardRepository secondCardRepository;

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

    public void createFirst(CardDto req, Long skillId){
        SkillCategory skillCategory = skillCategoryRepository.findById(skillId)
                .orElseThrow(()-> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        FirstCard firstCard = FirstCard.builder()
                .title(req.getTitle())
                .subTitle(req.getSubTitle())
                .content(req.getContent())
                .categoryName(skillCategory.getName())
                .skillCategory(skillCategory)
                .build();

        firstCardRepository.save(firstCard);
    }

    public void updateFirst(CardDto req, Long skillId, CategoryName categoryName){
        FirstCard firstCard = firstCardRepository.findBySkillCategory_IdAndCategoryName(skillId, categoryName)
                .orElseThrow(()-> new IllegalArgumentException("카테고리 없음"));
        firstCard.setTitle(req.getTitle());
        firstCard.setSubTitle(req.getSubTitle());
        firstCard.setContent(req.getContent());
        firstCardRepository.save(firstCard);
    }

    public CardResponse getFirst(CategoryName categoryName, Long skillId){
        FirstCard firstCard = firstCardRepository.findBySkillCategory_IdAndCategoryName(skillId, categoryName)
                .orElseThrow(()-> new IllegalArgumentException("카테고리 없음"));
        return new CardResponse(firstCard.getTitle(), firstCard.getSubTitle(), firstCard.getContent(),firstCard.getCategoryName());
    }

    public void createSecond(CardDto req, Long skillId){
        SkillCategory skillCategory = skillCategoryRepository.findById(skillId)
                .orElseThrow(()-> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        SecondCard secondCard = SecondCard.builder()
                .title(req.getTitle())
                .subTitle(req.getSubTitle())
                .content(req.getContent())
                .categoryName(skillCategory.getName())
                .skillCategory(skillCategory)
                .build();

        secondCardRepository.save(secondCard);
    }

    public void updateSecond(CardDto req, Long skillId, CategoryName categoryName){
        SecondCard secondCard = secondCardRepository.findBySkillCategory_IdAndCategoryName(skillId, categoryName)
                .orElseThrow(()-> new IllegalArgumentException("카테고리 없음"));
        secondCard.setTitle(req.getTitle());
        secondCard.setSubTitle(req.getSubTitle());
        secondCard.setContent(req.getContent());
        secondCardRepository.save(secondCard);
    }

    public CardResponse getSecond(Long skillId, CategoryName categoryName){
        SecondCard secondCard = secondCardRepository.findBySkillCategory_IdAndCategoryName(skillId, categoryName)
                .orElseThrow(()-> new IllegalArgumentException("카테고리 없음"));
        return new CardResponse(secondCard.getTitle(), secondCard.getSubTitle(), secondCard.getContent(),secondCard.getCategoryName());
    }
}
