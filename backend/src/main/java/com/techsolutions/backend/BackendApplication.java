package com.techsolutions.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
	
	private static final Logger logger = LoggerFactory.getLogger(BackendApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
		
		// Log de inicio simple sin dependencias
		logger.info("╔═══════════════════════════════════════════════════════════════╗");
		logger.info("║         ✅ APLICACIÓN TECHSOLUTIONS INICIADA                 ║");
		logger.info("║         📅 Fecha: " + java.time.LocalDateTime.now() + "      ║");
		logger.info("╚═══════════════════════════════════════════════════════════════╝");
	}

}