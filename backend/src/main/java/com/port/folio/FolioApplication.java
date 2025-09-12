package com.port.folio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FolioApplication {

	public static void main(String[] args) {
		SpringApplication.run(FolioApplication.class, args);
	}

}
