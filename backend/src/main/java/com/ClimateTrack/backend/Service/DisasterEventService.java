package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.DisasterEvent;
import com.ClimateTrack.backend.Entity.CountryGrid;
import com.ClimateTrack.backend.Repository.DisasterEventRepository;
import com.ClimateTrack.backend.Repository.CountryGridRepository;
import com.ClimateTrack.backend.dto.DisasterEventDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DisasterEventService {
    private static final Logger logger = LoggerFactory.getLogger(DisasterEventService.class);
    private static final String WEATHER_SOURCE = "OpenWeatherMap";

    private final DisasterEventRepository disasterEventRepository;
    private final NotificationService notificationService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final CountryGridRepository countryGridRepository;

//    @PostConstruct
//    public void init() {
//        objectMapper.registerModule(new JavaTimeModule());
//    }

    @Value("${weather.api.key}")
    private String weatherApiKey;

    @Value("${weather.api.base-url}")
    private String alertWeatherUrl;

    // Private helper to consistently map Entity to DTO
    private DisasterEventDto mapToDto(DisasterEvent e) {
        return DisasterEventDto.builder()
                .disasterId(e.getDisasterId())
                .disasterType(e.getDisasterType())
                .description(e.getDescription())
                .weatherIcon(e.getWeatherIcon())
                .locationName(e.getLocationName())
                .location(e.getLocation())
                .latitude(e.getLatitude())
                .longitude(e.getLongitude())
                .reportedAt(e.getReportedAt())
                .source(e.getSource())
                .build();
    }

    public List<DisasterEventDto> getAll() {
        // Use the single, correct helper method to ensure consistent mapping
        return disasterEventRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public DisasterEvent createDisasterEvent(DisasterEventDto eventDto) {
        DisasterEvent newEvent = DisasterEvent.builder()
                .disasterId(UUID.randomUUID().toString()) // Always generate a new ID for new events
                .disasterType(eventDto.getDisasterType())
                .description(eventDto.getDescription())
                .weatherIcon(eventDto.getWeatherIcon())
                .locationName(eventDto.getLocationName())
                .location(new GeoJsonPoint(eventDto.getLongitude(), eventDto.getLatitude()))
                .latitude(eventDto.getLatitude())
                .longitude(eventDto.getLongitude())
                .reportedAt(Instant.now()) // Use server time for new reports
                .source(eventDto.getSource())
                .build();

        // Save the newly created entity
        DisasterEvent savedEvent = disasterEventRepository.save(newEvent);

        // Trigger notifications to nearby users
        notificationService.sendProximityNotification(
                savedEvent.getLocation(),
                null, // No author to exclude for disaster alerts
                "ALERT: Disaster Event Nearby",
                "A new " + savedEvent.getDisasterType() + " event has been reported near your location."
        );

        return savedEvent;
    }

    @Transactional
    public void fetchAndSaveCurrentAlerts() {
        // 1. Find the active country grid from the database
        Optional<CountryGrid> activeGridOpt = countryGridRepository.findByIsActive(true);
        if (activeGridOpt.isEmpty()) {
            logger.warn("No active country grid found in the database. Skipping weather fetch.");
            return;
        }

        CountryGrid activeGrid = activeGridOpt.get();
        logger.info("Fetching weather for active country: {}", activeGrid.getCountryName());

        // 2. Clear all previous weather events before fetching new ones
        disasterEventRepository.deleteBySource(WEATHER_SOURCE);

        // 3. Loop through each grid point and fetch weather data
        for (CountryGrid.GridPoint point : activeGrid.getGridPoints()) {
            fetchAndSaveAlertForPoints(point, activeGrid.getCountryName());
        }
    }

    private void fetchAndSaveAlertForPoints(CountryGrid.GridPoint point, String countryName) {
        String url = UriComponentsBuilder.fromUriString(alertWeatherUrl)
                .queryParam("lat", point.getLat())
                .queryParam("lon", point.getLon())
                .queryParam("appid", weatherApiKey)
                .queryParam("units", "metric") // Get temperature in Celsius
                .queryParam("exclude", "minutely,hourly,daily") // We only want current weather and alerts
                .toUriString();

        logger.info("Fetching weather for {}...", point.getName());

        try {
            String response = restTemplate.getForObject(url, String.class);
            logger.info("Raw JSON response for {}: {}", point.getName(), response);
            if (response == null) {
                logger.error("OpenWeatherMap returned null response for {}", point.getName());
                return;
            }

            JsonNode root = objectMapper.readTree(response);

            // The One Call API response is different. Let's parse alerts if they exist.
            if (root.has("alerts")) {
                for (JsonNode alertNode : root.path("alerts")) {

                    // Parse tags from the API response
                    List<String> tags = new ArrayList<>();
                    if (alertNode.has("tags")) {
                        for (JsonNode tagNode : alertNode.path("tags")) {
                            tags.add(tagNode.asText());
                        }
                    }

                    DisasterEvent alertEvent = DisasterEvent.builder()
                            .disasterId(UUID.randomUUID().toString())
                            .disasterType(alertNode.path("event").asText())
                            // Sanitize description by removing newlines
                            .description(alertNode.path("description").asText().replace("\n", " ").replace("\r", ""))
                            .locationName(point.getName() + ", " + countryName)
                            .location(new GeoJsonPoint(point.getLon(), point.getLat()))
                            .latitude(point.getLat())
                            .longitude(point.getLon())
                            .reportedAt(Instant.ofEpochSecond(alertNode.path("start").asLong()))
                            .source(alertNode.path("sender_name").asText())
                            .tags(tags)
                            .build();
                    disasterEventRepository.save(alertEvent);
                    logger.info("Saved weather alert for {}: {}", point.getName(), alertEvent.getDescription());
                }
            }
        } catch (Exception e) {
            logger.error("Failed to fetch and save weather data for {}", point.getName(), e);
        }
    }
}