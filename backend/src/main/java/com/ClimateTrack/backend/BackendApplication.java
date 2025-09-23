package com.ClimateTrack.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // Enables support for @Scheduled tasks
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	// You can uncomment this later to automate the process
	/*
	@Autowired
	private com.ClimateTrack.backend.Service.DisasterEventService disasterEventService;

	@Scheduled(fixedRate = 3600000) // Runs every hour
	public void scheduleWeatherFetch() {
		disasterEventService.fetchAndSaveCurrentWeather();
	}
	*/
}
