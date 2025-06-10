package com.ClimateTrack.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
public class ReportResponseDto {
    private String id;
    private String reportId;
    // private String userId;
    private String disasterId;
    private String disasterType;
    private String description;
    private String photoUrl;
    private String locationName;
    private double latitude;
    private double longitude;
    private LocalDateTime reportedAt;
    private String status;
    private boolean verified;
}
