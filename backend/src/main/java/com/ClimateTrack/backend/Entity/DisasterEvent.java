package com.ClimateTrack.backend.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("disaster_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisasterEvent {
    @Id
    private String id;
    private String disasterId;
    private String disasterType;
    private String description;
    private String weatherIcon;
    private String locationName;
    private GeoJsonPoint location;
    private double latitude;
    private double longitude;
    private Instant reportedAt;
    private String source;
}