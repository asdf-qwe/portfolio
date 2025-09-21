package com.port.folio.domain.main.dto;

import com.port.folio.domain.main.entity.WorkHistory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
public class MainResponse {
    private String greeting;
    private String smallGreeting;
    private String introduce;
    private String name;
    private String job;
    private WorkHistory workHistory;
}
