package com.ClimateTrack.backend.dto;
import lombok.*;

@Data
@Builder
public class DisasterEventDto {
    private String disasterId;
    private String disasterType;
    private String description;
    private String locationName;
    private String latitude;
    private String longitude;
    private String reportedAt;
    private String source;
}
