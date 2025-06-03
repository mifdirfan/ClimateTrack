package com.ClimateTrack.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
public class ReportResponseDto {
    private String id;
    private String title;
    private String description;
    private String location;
    private double latitude;
    private double longitude;
    private String imageUrl;
    private LocalDateTime createdAt;
    private boolean verified;
}
