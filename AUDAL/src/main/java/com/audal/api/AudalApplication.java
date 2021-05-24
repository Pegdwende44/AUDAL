package com.audal.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAutoConfiguration
public class AudalApplication {

	public static void main(String[] args) {
		
		SpringApplication.run(AudalApplication.class, args);
	}

}
