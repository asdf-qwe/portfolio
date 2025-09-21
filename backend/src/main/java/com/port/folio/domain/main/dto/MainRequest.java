package com.port.folio.domain.main.dto;

import com.port.folio.domain.main.entity.WorkHistory;
import lombok.Getter;

@Getter
public class MainRequest {
    private String greeting;
    private String smallGreeting;
    private String introduce;
    private String name;
    private String job;
    private WorkHistory workHistory;
}
