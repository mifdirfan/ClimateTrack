package com.ClimateTrack.backend.dto;

import lombok.*;

@Data
public class ReportRequestDto{
    private String reportId;
    // private String userId;
    private String disasterId;
    private String disasterType;
    private String description;
    private String photoUrl;
    private String locationName;
    private double latitude;
    private double longitude;

}
