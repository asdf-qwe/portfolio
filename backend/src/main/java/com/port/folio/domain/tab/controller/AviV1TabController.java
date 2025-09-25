package com.port.folio.domain.tab.controller;

import com.port.folio.domain.tab.dto.BasicTabDto;
import com.port.folio.domain.tab.dto.BasicTabUpdateReq;
import com.port.folio.domain.tab.dto.CreateTabReq;
import com.port.folio.domain.tab.dto.TabRes;
import com.port.folio.domain.tab.entity.Tab;
import com.port.folio.domain.tab.service.TabService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/tab")
@RequiredArgsConstructor
public class AviV1TabController {
        private final TabService tabService;
    @PostMapping
    public ResponseEntity<String> createTab(@RequestBody CreateTabReq req, @RequestParam Long categoryId){
        tabService.createTab(req, categoryId);

        return ResponseEntity.ok("생성 완료");
    }

    @GetMapping("/list")
    public ResponseEntity<List<TabRes>> tabsList(@RequestParam Long categoryId){
        List<TabRes> tabRes = tabService.getTabs(categoryId);

        return ResponseEntity.ok(tabRes);
    }

    @GetMapping("/basic")
    public ResponseEntity<BasicTabDto> basicTab(@RequestParam Long categoryId){
        BasicTabDto basicTabDto = tabService.getBasicTabs(categoryId);
        return ResponseEntity.ok(basicTabDto);
    }

    @PutMapping("/basic")
    public ResponseEntity<String> updateBasicContent(@RequestBody BasicTabUpdateReq req, @RequestParam Long categoryId){
        String message = tabService.updateBasicContent(req, categoryId);
        return ResponseEntity.ok(message);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteTab(@RequestParam Long tabId){
        tabService.deleteTab(tabId);
        return ResponseEntity.ok("삭제 완료");
    }

}
