package com.port.folio.global.init;

import com.port.folio.domain.main.entity.Card;
import com.port.folio.domain.main.entity.CardItem;
import com.port.folio.domain.main.entity.CategoryName;
import com.port.folio.domain.main.entity.SkillCategory;
import com.port.folio.domain.main.repository.SkillCategoryRepository;
import com.port.folio.domain.user.entity.User;
import com.port.folio.domain.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Profile({"dev", "prod"})
@Component
@RequiredArgsConstructor
@Transactional
public class CardInitializer implements CommandLineRunner {

    private final SkillCategoryRepository skillCategoryRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {

        if (skillCategoryRepository.count() > 0) {
            log.info("[SkillCategoryInitializer] 이미 데이터 존재 → 초기화 생략");
            return;
        }

        User defaultUser = userRepository.findById(1L)
                .orElseThrow(() -> new IllegalStateException("초기화용 User(1L)를 찾을 수 없습니다."));

        log.info("[SkillCategoryInitializer] 초기 데이터 생성 시작");

        // 1. 각 카테고리별 카드 및 아이템 정의
        Map<CategoryName, List<CardSeed>> defaultData = new LinkedHashMap<>();

        defaultData.put(CategoryName.SKILLS, List.of(
                new CardSeed("기술적 전문성", "다양한 기술 스택을 활용한 개발 역량", List.of("풀스택 개발", "시스템 설계", "성능 최적화", "보안 구현")),
                new CardSeed("문제 해결", "복잡한 문제를 체계적으로 분석하고 해결", List.of("논리적 사고", "디버깅", "알고리즘 설계")),
                new CardSeed("DevOps", "배포/운영 기술 스택", List.of("AWS", "Docker", "CI/CD"))
        ));

        defaultData.put(CategoryName.PERSONALITY, List.of(
                new CardSeed("Communication", "의사소통 능력", List.of("팀 회의 참여", "보고서 작성", "피드백 수용")),
                new CardSeed("Leadership", "리더십", List.of("프로젝트 리드", "팀 관리", "멘토링")),
                new CardSeed("Adaptability", "적응력", List.of("환경 변화 대응", "새로운 툴 학습", "유연한 업무 처리"))
        ));

        defaultData.put(CategoryName.INTERESTS, List.of(
                new CardSeed("Music", "음악 관심사", List.of("작곡", "악기 연주", "음악 감상")),
                new CardSeed("Sports", "운동 및 스포츠", List.of("축구", "농구", "마라톤")),
                new CardSeed("Travel", "여행", List.of("국내 여행", "해외 여행", "문화 체험"))
        ));

        defaultData.put(CategoryName.EXPERIENCE, List.of(
                new CardSeed("Internship", "인턴 경험", List.of("기업 A", "기업 B", "기업 C")),
                new CardSeed("Project", "프로젝트 경험", List.of("웹 서비스 개발", "모바일 앱 개발", "팀 프로젝트")),
                new CardSeed("Volunteer", "봉사 활동", List.of("교육 봉사", "환경 봉사", "사회 봉사"))
        ));

        // 2. 초기화 반복문
        for (Map.Entry<CategoryName, List<CardSeed>> entry : defaultData.entrySet()) {

            SkillCategory category = SkillCategory.builder()
                    .name(entry.getKey())
                    .user(defaultUser)
                    .build();

            List<Card> cards = new ArrayList<>();
            for (CardSeed cardSeed : entry.getValue()) {
                Card card = Card.builder()
                        .title(cardSeed.getTitle())
                        .subTitle(cardSeed.getSubTitle())
                        .skillCategory(category)
                        .build();

                List<CardItem> items = new ArrayList<>();
                for (int i = 0; i < cardSeed.getItems().size(); i++) {
                    items.add(CardItem.builder()
                            .content(cardSeed.getItems().get(i))
                            .orderIndex(i + 1)
                            .card(card)
                            .build());
                }
                card.setItems(items);
                cards.add(card);
            }

            category.setCards(cards);
            skillCategoryRepository.save(category); // cascade로 카드 + 아이템까지 저장
        }

        log.info("[SkillCategoryInitializer] 초기 데이터 생성 완료");
    }

    @AllArgsConstructor
    @Getter
    private static class CardSeed {
        private final String title;
        private final String subTitle;
        private final List<String> items;
    }
}
