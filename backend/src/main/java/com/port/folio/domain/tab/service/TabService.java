package com.port.folio.domain.tab.service;

import com.port.folio.domain.category.dto.CategoryResponse;
import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.category.repository.CategoryRepository;
import com.port.folio.domain.post.entity.Post;
import com.port.folio.domain.post.repository.PostRepository;
import com.port.folio.domain.tab.dto.BasicTabDto;
import com.port.folio.domain.tab.dto.BasicTabUpdateReq;
import com.port.folio.domain.tab.dto.CreateTabReq;
import com.port.folio.domain.tab.dto.TabRes;
import com.port.folio.domain.tab.entity.BasicTab;
import com.port.folio.domain.tab.entity.Tab;
import com.port.folio.domain.tab.repository.BasicTabRepository;
import com.port.folio.domain.tab.repository.TabRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TabService {
    private final TabRepository tabRepository;
    private final CategoryRepository categoryRepository;
    private final PostRepository postRepository;
    private final BasicTabRepository basicTabRepository;

    public Tab createTab(CreateTabReq req, Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다"));

        // 1. Tab 생성
        Tab tab = Tab.builder()
                .tabName(req.getTabName())
                .category(category)
                .build();

        // 2. Post 생성 + 연관관계 설정
        Post post = Post.builder()
                .title(null)
                .content(null)
                .imageUrl(null)
                .tab(tab)   // Post → Tab
                .build();

        tab.setPost(post); // Tab → Post

        // 3. 저장 (Cascade 설정 여부에 따라 다름)
        // Case 1: Tab 엔티티에 cascade = CascadeType.ALL 걸려있으면
        // return tabRepository.save(tab);

        // Case 2: Cascade 없으면 둘 다 저장
        tabRepository.save(tab);
        postRepository.save(post);

        return tab;
    }

    public List<TabRes> getTabs(Long categoryId){
        List<Tab> tabs = tabRepository.findAllByCategoryId(categoryId);
        return tabs.stream()
                .map(tab -> new TabRes(
                        tab.getId(),
                        tab.getTabName(),
                        tab.getCategory().getId(),
                        tab.getPost() != null ? tab.getPost().getContent() : null
                ))
                .collect(Collectors.toList());

    }

    public BasicTabDto getBasicTabs(Long categoryId){
        BasicTab basicTab = basicTabRepository.findByCategoryId(categoryId);

        return new BasicTabDto(
                basicTab.getBasicTab1(),
                basicTab.getBasicTab2(),
                basicTab.getBasicContent1(),
                basicTab.getBasicContent2()
        );
    }

    public String updateBasicContent(BasicTabUpdateReq req, Long categoryId){
        BasicTab basicTab = basicTabRepository.findByCategoryId(categoryId);

        basicTab.setBasicContent1(req.getBasicContent1());

        basicTabRepository.save(basicTab);
        return "수정 완료";
    }
}
