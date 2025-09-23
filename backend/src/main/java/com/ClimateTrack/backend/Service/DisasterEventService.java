package com.ClimateTrack.backend.Service;

import com.ClimateTrack.backend.Entity.DisasterEvent;
import com.ClimateTrack.backend.Repository.DisasterEventRepository;
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

import java.util.List;
import java.util.UUID;
import java.time.Instant;
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

    @PostConstruct
    public void init() {
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Value("${weather.api.key}")
    private String weatherApiKey;

    @Value("${weather.api.base-url.current}")
    private String currentWeatherUrl;

    @Value("${weather.api.lat}")
    private double lat;

    @Value("${weather.api.lon}")
    private double lon;

    public List<DisasterEventDto> getAll() {
        return disasterEventRepository.findAll().stream().map(e -> DisasterEventDto.builder()
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
                .build()
        ).collect(Collectors.toList());
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
    public void fetchAndSaveCurrentWeather() {
        String url = UriComponentsBuilder.fromUriString(currentWeatherUrl)
                .queryParam("lat", lat)
                .queryParam("lon", lon)
                .queryParam("appid", weatherApiKey)
                .queryParam("units", "metric") // Get temperature in Celsius
                .toUriString();

        logger.info("Fetching current weather from OpenWeatherMap for lat={}, lon={}", lat, lon);

        try {
            String response = restTemplate.getForObject(url, String.class);
            logger.info("Raw JSON response from OpenWeatherMap: {}", response);
            if (response == null) {
                throw new RuntimeException("OpenWeatherMap returned null response");
            }

            JsonNode root = objectMapper.readTree(response);
            // Check for a valid response
            if (root == null || root.path("cod").asInt() != 200) {
                logger.error("Failed to fetch weather. API response: {}", root != null ? root.toString() : "null");
                return;
            }

            DisasterEvent weatherEvent = DisasterEvent.builder()
                    .disasterId(UUID.randomUUID().toString())
                    .disasterType(root.path("weather").get(0).path("main").asText())
                    .description(root.path("weather").get(0).path("description").asText())
                    .weatherIcon(root.path("weather").get(0).path("icon").asText())
                    .locationName(root.path("name").asText())
                    .location(new GeoJsonPoint(
                            root.path("coord").path("lon").asDouble(),
                            root.path("coord").path("lat").asDouble()))
                    .latitude(root.path("coord").path("lat").asDouble())
                    .longitude(root.path("coord").path("lon").asDouble())
                    .reportedAt(Instant.now()) // Use current time for the report
                    .source(WEATHER_SOURCE)
                    .build();

            // Atomically delete old weather data and save the new entry
            //disasterEventRepository.deleteBySource(WEATHER_SOURCE);
            disasterEventRepository.save(weatherEvent);
            logger.info("Successfully saved current weather for {} as a disaster event.", weatherEvent.getLocationName());
        } catch (Exception e) {
            logger.error("Failed to fetch and save current weather data", e);
        }
    }
}
