package com.port.folio.domain.tag.controller;

import com.port.folio.domain.tag.dto.TagRequest;
import com.port.folio.domain.tag.dto.TagResponse;
import com.port.folio.domain.tag.repository.TagRepository;
import com.port.folio.domain.tag.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tag")
@RequiredArgsConstructor
public class ApiV1TagController {
    private final TagService tagService;

    @PostMapping
    public ResponseEntity<TagResponse> createTag(@RequestBody TagRequest req, @RequestParam Long categoryId){
        TagResponse tag = tagService.createTag(req, categoryId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(tag);
    }

    @GetMapping
    public ResponseEntity<List<TagResponse>> getTags(@RequestParam Long categoryId){
        List<TagResponse> tagResponse = tagService.getTags(categoryId);
        return ResponseEntity.ok(tagResponse);
    }

    @PutMapping
    public ResponseEntity<String> updateTag(@RequestBody TagRequest req, @RequestParam Long tagId){
        tagService.updateTag(req,tagId);
        return ResponseEntity.ok("수정 완료");
    }

    @DeleteMapping
    public ResponseEntity<String> deleteTag(@RequestParam Long tagId){
        tagService.deleteTag(tagId);
        return ResponseEntity.ok("삭제 완료");
    }
}
