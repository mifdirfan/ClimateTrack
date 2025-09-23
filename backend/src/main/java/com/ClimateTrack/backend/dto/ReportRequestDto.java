package com.ClimateTrack.backend.dto;

import lombok.*;

@Data
public class ReportRequestDto{
    private String title;
    private String disasterType;
    private String description;
    private String photoUrl;
    private double latitude;
    private double longitude;
}