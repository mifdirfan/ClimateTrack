package com.ClimateTrack.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
public class ReportResponseDto {
    private String reportId;
    private String title;
    private String description;
    private String disasterType;
    private String photoUrl;
    private double latitude;
    private double longitude;
    private Date reportedAt;



}
