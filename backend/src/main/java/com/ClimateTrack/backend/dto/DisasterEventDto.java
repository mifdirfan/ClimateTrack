package com.ClimateTrack.backend.dto;
import lombok.*;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

@Data
@Builder
public class DisasterEventDto {
    private String disasterId;
    private String disasterType;
    private String description;
    private GeoJsonPoint location;
    private String locationName;
    private double latitude;
    private double longitude;
    private String reportedAt;
    private String source;
}
