package com.ClimateTrack.backend.Service;


import com.ClimateTrack.backend.Entity.DisasterEvent;
import com.ClimateTrack.backend.Repository.DisasterEventRepository;
import com.ClimateTrack.backend.dto.DisasterEventDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DisasterEventService {
    private final DisasterEventRepository disasterEventRepository;
    private final NotificationService notificationService;

    public List<DisasterEventDto> getAll() {
        return disasterEventRepository.findAll().stream().map(e -> DisasterEventDto.builder()
                .disasterId(e.getDisasterId())
                .disasterType(e.getDisasterType())
                .description(e.getDescription())
                .location(e.getLocation())
                .latitude(e.getLatitude())
                .longitude(e.getLongitude())
                .reportedAt(e.getReportedAt())
                .source(e.getSource())
                .build()
        ).collect(Collectors.toList());
    }

    public DisasterEvent createDisasterEvent(DisasterEventDto eventDto) {
        DisasterEvent newEvent = new DisasterEvent();

        // MODIFIED: Mapping fields from the DTO to your entity
        newEvent.setDisasterId(eventDto.getDisasterId());
        newEvent.setDisasterType(eventDto.getDisasterType());
        newEvent.setDescription(eventDto.getDescription());
        newEvent.setLatitude(eventDto.getLatitude());
        newEvent.setLongitude(eventDto.getLongitude());
        newEvent.setReportedAt(eventDto.getReportedAt());
        newEvent.setSource(eventDto.getSource());
        // Create the GeoJsonPoint for proximity searches
        newEvent.setLocation(new GeoJsonPoint(eventDto.getLongitude(), eventDto.getLatitude()));

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
}
