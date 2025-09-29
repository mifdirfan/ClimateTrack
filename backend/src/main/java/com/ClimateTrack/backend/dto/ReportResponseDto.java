package com.ClimateTrack.backend.dto;

import lombok.*;

import java.time.Instant;

@Data
@Builder
public class ReportResponseDto {
    private String reportId;
    private String title;
    private String description;
    private String disasterType;
    private String postedByUsername;
    private String photoUrl;
    private double latitude;
    private double longitude;
    // Using Instant for modern, timezone-aware date handling
    private Instant reportedAt;
}
