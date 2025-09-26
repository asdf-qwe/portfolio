package com.port.folio.domain.tag.service;

import com.port.folio.domain.category.entity.Category;
import com.port.folio.domain.category.repository.CategoryRepository;
import com.port.folio.domain.tag.dto.TagRequest;
import com.port.folio.domain.tag.dto.TagResponse;
import com.port.folio.domain.tag.entity.Tag;
import com.port.folio.domain.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;
    private final CategoryRepository categoryRepository;

    public TagResponse createTag(TagRequest req, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()-> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        Tag tag = Tag.builder()
                .tagName(req.getTagName())
                .category(category)
                .build();

        tagRepository.save(tag);

        return new TagResponse(tag.getId(), req.getTagName());
    }

    public List<TagResponse> getTags(Long categoryId){
        List<Tag> tags = tagRepository.findAllByCategoryId(categoryId);
        return tags.stream().map(tag -> new TagResponse(
                tag.getId(),
                tag.getTagName()
        )).collect(Collectors.toList());
    }

    public void updateTag(TagRequest req, Long tagId){
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(()-> new IllegalArgumentException("태크가 없습니다."));
        tag.setTagName(req.getTagName());
        tagRepository.save(tag);
    }

    public void  deleteTag(Long tagId){
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(()-> new IllegalArgumentException("태크가 없습니다."));
        tagRepository.delete(tag);

    }
}
