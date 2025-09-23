package com.ClimateTrack.backend.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import java.time.Instant;

@Data
@Builder
public class DisasterEventDto {
    private String disasterId;
    private String disasterType;
    private String description;
    private String weatherIcon;
    private String locationName;
    private GeoJsonPoint location;
    private double latitude;
    private double longitude;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Instant reportedAt;
    private String source;
}
