package com.port.folio.domain.tab.controller;

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
    public ResponseEntity<Tab> createTab(@RequestBody CreateTabReq req, @RequestParam Long categoryId){
        Tab tab = tabService.createTab(req, categoryId);

        return ResponseEntity.ok(tab);
    }

    @GetMapping("/list")
    public ResponseEntity<List<TabRes>> tabsList(@RequestParam Long categoryId){
        List<TabRes> tabRes = tabService.getTabs(categoryId);

        return ResponseEntity.ok(tabRes);
    }
}
