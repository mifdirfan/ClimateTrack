package com.ClimateTrack.backend;

import org.springframework.beans.factory.annotation.Autowired;
import com.ClimateTrack.backend.Service.NewsArticleService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@SpringBootApplication
@EnableScheduling // Enables support for @Scheduled tasks
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	// You can uncomment this later to automate the process

	@Autowired
	private com.ClimateTrack.backend.Service.DisasterEventService disasterEventService;

	@Autowired
	private NewsArticleService newsArticleService;

	@Scheduled(fixedRate = 3600000) // Runs every hour
	public void scheduleWeatherFetch() {
		disasterEventService.fetchAndSaveCurrentWeather();
	}

	@Scheduled(fixedRate = 21600000) // Runs every 6 hours
	public void scheduleNewsFetch() {
		newsArticleService.fetchAndSaveNews();
	}
}
