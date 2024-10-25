package com.mange.mange;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.mange.mange")
public class MangeApplication {
	public static void main(String[] args) {
		SpringApplication.run(MangeApplication.class, args);
	}
}