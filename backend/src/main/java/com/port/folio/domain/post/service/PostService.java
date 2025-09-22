package com.port.folio.domain.post.service;

import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.category.repository.CategoryRepository;
import com.port.folio.domain.post.dto.*;
import com.port.folio.domain.post.entity.Introduce;
import com.port.folio.domain.post.entity.Post;
import com.port.folio.domain.post.repository.IntroduceRepository;
import com.port.folio.domain.post.repository.PostRepository;
import com.port.folio.domain.tab.dto.TabRes;
import com.port.folio.domain.tab.entity.Tab;
import com.port.folio.domain.tab.repository.TabRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class PostService {
    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final TabRepository tabRepository;
    private final IntroduceRepository introduceRepository;

    public Post createPost(CreatePostDto dto, Long categoryId, Long tabId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 없습니다"));
        Tab tab = tabRepository.findById(tabId).orElseThrow(()->new IllegalArgumentException("탭이 없습니다"));

        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .imageUrl(dto.getImageUrl())
                .category(category)
                .tab(tab)
                .build();

        return postRepository.save(post);

    }

    public List<PostListDto> getPosts(Long categoryId) {
        List<Post> posts = postRepository.findByCategoryId(categoryId);
        return posts.stream()
                .map(post -> new PostListDto(
                        post.getTitle(),
                        post.getViews()
                ))
                .collect(Collectors.toList());
    }

    public PostResponse getPost(Long tabId) {
        Post post = postRepository.findByTabId(tabId);

        if (post == null) {
            return new PostResponse(null, null, null); // 빈 응답
        }

        return new PostResponse(
                post.getTitle(),
                post.getContent(),
                post.getImageUrl()
        );
    }

    public String updatePost(CreatePostDto dto, Long tabId) {
        Post post = postRepository.findByTabId(tabId);

        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setImageUrl(dto.getImageUrl());

        postRepository.save(post);
        return "업데이트 완료";
    }

    public void createIntroduce(CreateIntroduce req, Long categoryId){
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()-> new IllegalArgumentException("카테고리가 없습니다."));

        Introduce introduce = Introduce.builder()
                .title(req.getTitle())
                .content(req.getContent())
                .category(category)
                .build();

        introduceRepository.save(introduce);
    }

    public IntroduceResponse getIntro(Long categoryId) {
        Introduce introduce = introduceRepository.findByCategoryId(categoryId);
        if (introduce == null) {
            return new IntroduceResponse(null, null); // or throw new IllegalArgumentException("...")
        }
        return new IntroduceResponse(introduce.getTitle(), introduce.getContent());
    }


    public void updateIntro(CreateIntroduce req, Long categoryId){
        Introduce introduce = introduceRepository.findByCategoryId(categoryId);

        introduce.setTitle(req.getTitle());
        introduce.setContent(req.getContent());

        introduceRepository.save(introduce);
    }
}
